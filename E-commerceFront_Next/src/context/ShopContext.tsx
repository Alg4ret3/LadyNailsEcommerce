'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { MedusaProduct } from '@/services/medusa/products';
import { useRouter } from 'next/navigation';
import { useAllProducts } from '@/hooks/useProducts';

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

  // ── Hook de TanStack Query ──
  const { data: allProducts = [], isLoading: isProductsLoading } = useAllProducts();

  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);

  // Sync initial state from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
       const pathname = window.location.pathname;
       const params = new URLSearchParams(window.location.search);
       
       const parts = pathname.split('/');
       let pathCategory = null;
       if (parts.length > 2 && parts[1] === 'shop' && parts[2] !== '') {
          try { pathCategory = decodeURIComponent(parts[2]); } catch (e) {}
       }

       const q = params.get('q') || '';
       const cats = params.get('categories')?.split(',') || [];
       if (pathCategory && !cats.includes(pathCategory)) {
          cats.push(pathCategory);
       }
       const brs = params.get('brands')?.split(',') || [];
       
       setFiltersState({
         query: q,
         selectedCategories: cats,
         selectedBrands: brs
       });
    }
  }, []);

  const products = useMemo(() => {
    // Si tenemos productos de la query (cache o fresh), los usamos. 
    // De lo contrario, usamos los iniciales (SSR).
    return allProducts.length > 0 ? allProducts : initialProducts;
  }, [allProducts, initialProducts]);

  const loading = isProductsLoading && products.length === 0;

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

  const setFilters = useCallback((updates: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.selectedCategories.length) params.set('categories', filters.selectedCategories.join(','));
    if (filters.selectedBrands.length) params.set('brands', filters.selectedBrands.join(','));

    const search = params.toString();
    const newUrl = search ? `/shop?${search}` : '/shop';
    
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
