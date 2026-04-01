'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Typography } from '@/components/atoms/Typography';
import { ProductCard } from '@/components/molecules/ProductCard';
import { Badge } from '@/components/atoms/Badge';
import { Search } from 'lucide-react';
import { filterProducts } from '@/utils/shop-filters';
import { useShop } from '@/context/ShopContext';

interface ProductGridProps {
  initialProducts?: any[];
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ initialProducts, title, subtitle }) => {
  const { products: allProducts, loading, filters } = useShop();
  const pathname = usePathname();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const sourceProducts = (allProducts && allProducts.length > 0) ? allProducts : (initialProducts || []);

  const currentPathCategory = useMemo(() => {
    const parts = pathname.split('/');
    if (parts.length > 2 && parts[1] === 'shop' && parts[2] !== '') {
       return parts[2];
    }
    return null;
  }, [pathname]);

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

  const filteredProducts = useMemo(() => {
    let base = sourceProducts;
    if (currentPathCategory) {
      base = base.filter(p => 
        p.categories?.some((c: any) => c.handle === currentPathCategory)
      );
    }

    return filterProducts(base, {
      query: filters.query,
      selectedCategories: filters.selectedCategories,
      selectedBrands: filters.selectedBrands
    });
  }, [sourceProducts, filters, currentPathCategory]);

  const normalizedProducts = useMemo(() => filteredProducts.map((p) => ({
    id: p.id,
    name: p.title,
    price: p.variants?.[0]?.prices?.[0]?.amount ?? 0,
    image: p.thumbnail || "/placeholder.jpg",
    tags: p.tags?.map((t: any) => t.value) || [],
    description: p.description,
    categories: p.categories || [],
    brand: p.brand,
    slug: p.handle,
    vendor: p.brand?.name || p.vendor || "Ladynail Shop",
    variants: p.variants || [],
  })), [filteredProducts]);

  const totalPages = Math.ceil(normalizedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = normalizedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, currentPathCategory]);

  return (
    <div ref={resultsRef} className="space-y-8 min-h-[600px]">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-12 sm:mb-20">
          <div className="space-y-2 lg:space-y-4">
            <Typography variant="detail" className="text-slate-400 block pb-2 tracking-widest">{subtitle}</Typography>
            <Typography variant="h1" className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl tracking-tighter leading-none sm:leading-[0.95] font-medium pt-2">
              {title?.split(' ')[0]} <br /> 
              <span className="text-slate-200 font-light">{title?.split(' ').slice(1).join(' ') || 'PARA TI'}</span>
            </Typography>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b border-slate-100 gap-4 mt-8">
        <div className="flex items-center gap-4">
           {loading && normalizedProducts.length === 0 ? (
             <div className="h-4 w-32 bg-slate-50 animate-pulse rounded" />
           ) : (
             <>
               <Typography variant="detail" className="text-slate-400 normal-case whitespace-nowrap">Resultados</Typography>
               <Badge variant="outline" className="text-[10px] py-1 px-4 rounded-full font-black tracking-widest bg-slate-50">{normalizedProducts.length} PRODUCTOS</Badge>
             </>
           )}
        </div>
      </div>

      {/* Grid */}
      {loading && normalizedProducts.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-white border border-slate-100">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="aspect-[3/4] bg-slate-50 animate-pulse" />
           ))}
        </div>
      ) : paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-white border border-slate-100">
           {paginatedProducts.map((p, index) => (
              <ProductCard key={p.id} {...p} slug={p.slug} priority={index < 6} />
           ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center space-y-8 border-2 border-dashed border-slate-100 rounded-[60px] bg-slate-50/20">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-50">
            <Search size={32} className="text-slate-200" />
          </div>
          <div className="text-center space-y-3 px-4">
            <Typography variant="h3" className="text-3xl tracking-tighter uppercase font-black">Sin coincidencias</Typography>
            <Typography variant="body" className="text-slate-400 text-sm max-w-xs mx-auto">
              Intenta ajustar tus filtros para encontrar lo que buscas.
            </Typography>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-20 flex flex-wrap justify-center items-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: resultsRef.current?.offsetTop ? resultsRef.current.offsetTop - 100 : 0, behavior: 'smooth' });
              }}
              className={`w-14 h-14 flex items-center justify-center transition-all font-black text-sm rounded-full ${
                currentPage === page 
                ? 'bg-slate-950 text-white shadow-2xl scale-110' 
                : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-950 hover:text-slate-950'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
