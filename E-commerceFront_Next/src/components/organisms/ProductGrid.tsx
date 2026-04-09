'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Typography } from '@/components/atoms/Typography';
import { ProductCard } from '@/components/molecules/ProductCard';
import { Search, ChevronDown, ListOrdered } from 'lucide-react';
import { filterProducts } from '@/utils/shop-filters';
import { useShop } from '@/context/ShopContext';
import { useInfiniteProducts } from '@/hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGridProps {
  initialProducts?: any[];
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ initialProducts, title, subtitle }) => {
  const { products: allProducts, loading: shopLoading, filters } = useShop();
  const pathname = usePathname();
  const resultsRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState('default');

  // TanStack Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteProducts({ limit: 12 });

  // Combinar productos iniciales, del context o de la query infinita
  const infiniteProducts = useMemo(() => {
    return data?.pages.flatMap(page => page.products) || [];
  }, [data]);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = useMemo(() => [
    { value: 'default', label: 'Orden Sugerido' },
    { value: 'price-asc', label: 'Precio Menor' },
    { value: 'price-desc', label: 'Precio Mayor' },
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'newest', label: 'Recientes' }
  ], []);

  const currentSortLabel = useMemo(() => 
    sortOptions.find(o => o.value === sortBy)?.label || 'Orden Sugerido',
  [sortBy, sortOptions]);

  const sourceProducts = useMemo(() => {
    if (infiniteProducts.length > 0) return infiniteProducts;
    if (allProducts && allProducts.length > 0) return allProducts;
    return initialProducts || [];
  }, [infiniteProducts, allProducts, initialProducts]);

  const currentPathCategory = useMemo(() => {
    const parts = pathname.split('/');
    if (parts.length > 2 && parts[1] === 'shop' && parts[2] !== '') {
       try {
         return decodeURIComponent(parts[2]);
       } catch (e) {
         return parts[2];
       }
    }
    return null;
  }, [pathname]);

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

  const normalizedProducts = useMemo(() => {
    const list = filteredProducts.map((p) => ({
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
      createdAt: (p as any).created_at,
    }));

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [filteredProducts, sortBy]);

  const loading = (status === 'pending' || shopLoading) && normalizedProducts.length === 0;

  // Intersection Observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={resultsRef} className="space-y-8 min-h-[600px]">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-12 sm:mb-20">
          <div className="space-y-2 lg:space-y-4">
            <Typography variant="detail" className="text-slate-400 block pb-2 tracking-widest">{subtitle}</Typography>
            <Typography variant="h1" className="text-4xl xs:text-5xl sm:text-5xl lg:text-5xl tracking-tighter leading-none sm:leading-[0.95] font-medium pt-2 uppercase">
              {title?.split(' ')[0]} <br /> 
              <span className="text-slate-200 font-light">{title?.split(' ').slice(1).join(' ') || 'PARA TI'}</span>
            </Typography>
          </div>
        </div>
      )}

      {/* Results Header (Minimalist) */}
      <div className="flex justify-end py-6 border-b border-zinc-100 mt-8 mb-8">
         <div className="relative" ref={sortRef}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-3 px-6 py-3 bg-zinc-50/50 hover:bg-zinc-50 rounded-full transition-all group"
            >
               <ListOrdered size={14} className="text-zinc-400 group-hover:text-zinc-950 transition-colors" />
               <Typography variant="h4" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-950">
                 {currentSortLabel}
               </Typography>
               <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                   className="absolute right-0 top-full mt-4 w-60 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl border border-zinc-50 overflow-hidden z-60 p-1.5"
                 >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          sortBy === option.value 
                          ? 'bg-zinc-950 text-white' 
                          : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-950'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                 </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="aspect-[3/4] bg-slate-50 animate-pulse rounded-3xl" />
           ))}
        </div>
      ) : normalizedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
             {normalizedProducts.map((p, index) => (
                <ProductCard key={p.id} {...p} slug={p.slug} priority={index < 6} />
             ))}
          </div>
          
          {/* Elemento observado para el scroll infinito */}
          <div ref={observerRef} className="h-20 flex items-center justify-center mt-12">
            {isFetchingNextPage && (
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-950 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            )}
            {!hasNextPage && normalizedProducts.length > 0 && (
              <Typography variant="detail" className="text-slate-400">Has llegado al final</Typography>
            )}
          </div>
        </>
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
    </div>
  );
};
