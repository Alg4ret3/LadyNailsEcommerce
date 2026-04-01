'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { MedusaProduct, getAllProducts } from '@/services/medusa/products';
import { useRouter } from 'next/navigation';

export interface FilterState {
  query: string;
  selectedCategories: string[];
  selectedBrands: string[];
}

interface ShopContextType {
  products: MedusaProduct[];
  loading: boolean;
  brands: string[];
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DEFAULT_FILTERS: FilterState = {
  query: '',
  selectedCategories: [],
  selectedBrands: [],
};

export const ShopProvider: React.FC<{ children: React.ReactNode; initialProducts?: MedusaProduct[] }> = ({ 
  children, 
  initialProducts = [] 
}) => {
  const router = useRouter();
  const [products, setProducts] = useState<MedusaProduct[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    if (initialProducts.length === 0) {
      getAllProducts().then(allProducts => {
        setProducts(allProducts);
        setLoading(false);
      });
    }
  }, [initialProducts]);

  const brands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand?.name) brandsSet.add(p.brand.name);
      p.tags?.forEach((t) => {
        if (t.value.startsWith('marca:')) {
          brandsSet.add(t.value.replace('marca:', ''));
        }
      });
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  // Update filters in state AND sync URL as a side effect (not inside setState)
  const setFilters = useCallback((updates: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...updates }));
  }, []);

  // Sync URL when filters change (side effect, not inside setState)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.selectedCategories.length) params.set('categories', filters.selectedCategories.join(','));
    if (filters.selectedBrands.length) params.set('brands', filters.selectedBrands.join(','));

    const search = params.toString();
    const newUrl = search ? `/shop?${search}` : '/shop';
    
    // Use replaceState safely outside of render
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', newUrl);
    }
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    router.push('/shop', { scroll: false });
  }, [router]);

  return (
    <ShopContext.Provider value={{ products, loading, brands, filters, setFilters, resetFilters }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
