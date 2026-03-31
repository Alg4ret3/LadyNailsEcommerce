'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { ProductCard } from '@/components/molecules/ProductCard';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { MainLayout } from './MainLayout';
import { Badge } from '@/components/atoms/Badge';
import { useCategories } from '@/context/CategoriesContext';
import { filterProducts } from '@/utils/shop-filters';

interface ShopLayoutProps {
  title: string;
  subtitle?: string;
  initialCategory?: string | null;
  products: any[];
}

const FilterSection = ({ title, children, defaultOpen = true, scrollable = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean, scrollable?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center group"
      >
        <Typography variant="h4" className="text-[10px] font-bold tracking-[0.15em] text-slate-400 group-hover:text-slate-950 transition-colors uppercase">{title}</Typography>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown size={12} className="text-slate-200 group-hover:text-slate-950 transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`pt-6 ${scrollable ? 'max-h-64 overflow-y-auto custom-scrollbar pr-2' : ''}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ShopLayout: React.FC<ShopLayoutProps> = ({ title, subtitle, initialCategory = null, products }) => {
  const { categories, loading } = useCategories();
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize from URL params if available, otherwise from initialCategory
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const fromQuery = searchParams.get('categories');
    if (fromQuery) return fromQuery.split(',');
    return initialCategory ? [initialCategory] : [];
  });
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(200000);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;
  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync state if URL changes significantly
  const queryCategories = searchParams.get('categories');
  useEffect(() => {
    if (queryCategories) {
      if (queryCategories !== selectedCategories.join(',')) {
        setSelectedCategories(queryCategories.split(','));
      }
    } else if (pathname === '/shop' && selectedCategories.length > 0 && !initialCategory) {
      // Clear state when returning to the base shop route without query params
      setSelectedCategories([]);
    }
  }, [queryCategories, pathname, initialCategory, selectedCategories]);

  // Scroll to results top when page or filters change
  useEffect(() => {
    if (resultsRef.current) {
      const yOffset = -100; // Account for fixed header
      const element = resultsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentPage, query, selectedCategories, selectedBrands, priceRange]);

  const brands = React.useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach(p => {
      // From new structured field
      if (p.brand?.name) {
        brandsSet.add(p.brand.name);
      }
      // Fallback/Legacy from tags
      p.tags?.forEach((t: any) => {
        if (t.value.startsWith('marca:')) {
          brandsSet.add(t.value.replace('marca:', ''));
        }
      });
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    return filterProducts(products, {
      query,
      priceRange,
      selectedCategories,
      selectedBrands
    });
  }, [products, query, priceRange, selectedCategories, selectedBrands])

  const normalizedProducts = filteredProducts.map((p) => ({
    id: p.id,
    name: p.title,
    price: p.variants?.[0]?.prices?.[0]?.amount ?? 0,
    image: p.thumbnail || "/placeholder.jpg",
    tags: p.tags?.map((t: any) => t.value) || [],
    description: p.description,
    categories: p.categories || [],
    brand: p.brand,
    warranty: p.warranty,
    usage: p.usage,
    shipping: p.shipping,
    slug: p.handle,
    vendor: p.brand?.name || p.vendor || "Ladynail Shop",
    variants: p.variants || [],
  }));

  const totalPages = Math.ceil(normalizedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = normalizedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const resetFilters = () => {
    // Clear all local states immediately
    setQuery('');
    setSelectedCategories([]); 
    setSelectedBrands([]);
    setPriceRange(200000);
    setCurrentPage(1);

    // Force navigation to clear any specialized category path or search params in the URL
    router.push('/shop');
  };

  const toggleCategory = (id: string, handle?: string) => {
    const isSelected = selectedCategories.includes(id) || (handle && selectedCategories.includes(handle));
    
    let newCategories: string[] = [];
    if (isSelected) {
      newCategories = selectedCategories.filter(c => c !== id && c !== handle);
    } else {
      // Prefer using the handle if available for nicer URLs
      newCategories = [...selectedCategories, handle || id];
    }

    setSelectedCategories(newCategories);
    setCurrentPage(1);

    // If we are in a strict category URL (/shop/[category]) or setting multiple categories,
    // we must push to generic /shop to fetch all products before filtering.
    // If the user unchecks the only category, we also return to generic /shop.
    if (pathname !== '/shop' || newCategories.length > 0) {
      const url = new URL('/shop', window.location.origin);
      if (newCategories.length > 0) {
        url.searchParams.set('categories', newCategories.join(','));
      }
      router.push(url.toString());
    } else if (newCategories.length === 0 && pathname === '/shop') {
      // Allow clearing categories when already on the generic route
      router.push('/shop');
    }
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <section className="pt-32 sm:pt-44 pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-16 sm:mb-20 space-y-12">
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
              <div className="flex flex-col space-y-2 lg:space-y-4">
                 <Typography variant="detail" className="text-slate-400 block pb-2">{subtitle || 'Tendencias en Belleza & Cuidado'}</Typography>
                 <Typography variant="h1" className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl tracking-tighter leading-none sm:leading-[0.95] font-medium pt-2">
                   {title.split(' ')[0]} <br /> 
                   <span className="text-slate-200 font-light">{title.split(' ').slice(1).join(' ') || 'PARA TI'}</span>
                 </Typography>
              </div>
              
               <div className="hidden lg:block">
                  {/* Outer actions removed for cleaner look */}
               </div>
            </div>
         </div>

        <div className="flex flex-col lg:flex-row gap-20">
           {/* Sidebar Filters */}
           <aside className="hidden lg:block lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-32 lg:max-h-[calc(100vh-160px)] flex flex-col">
                 <div className="flex flex-col gap-4 pb-6 border-b border-slate-100 shrink-0">
                    <Typography variant="h4" className="text-xs tracking-[0.2em] text-slate-950 font-bold uppercase">FILTROS</Typography>
                    <div className="flex items-center justify-between">
                       <button 
                         onClick={resetFilters}
                         className="text-[10px] font-medium uppercase text-slate-400 hover:text-slate-950 transition-colors tracking-[0.15em]"
                       >
                         Limpiar
                       </button>
                       <button 
                         onClick={resetFilters}
                         className="text-[10px] font-medium uppercase text-slate-600 hover:text-slate-950 transition-colors tracking-[0.15em]"
                       >
                         Ver Todos
                       </button>
                    </div>
                 </div>

                 {/* Scrollable Container for all Filters */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-6 py-4">
                    {/* Refined Sidebar Search */}
                    <div className="hidden lg:block space-y-3 pt-2">
                      <div className="relative group">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
                        <input 
                          type="text" 
                          placeholder="BUSCAR EN CATÁLOGO" 
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-4 outline-none focus:bg-white focus:border-slate-950 transition-all text-[10px] font-black tracking-widest placeholder:text-slate-300 rounded-none uppercase"
                        />
                      </div>
                    </div>

                    <FilterSection title="Categorías" scrollable={false}>
                        <div className="space-y-4">
                          {loading ? (
                            <div className="space-y-4">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="flex items-center gap-4 animate-pulse">
                                  <div className="w-5 h-5 bg-slate-50 border border-slate-100" />
                                  <div className="h-3 w-32 bg-slate-50 rounded" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            categories.map(c => (
                              <label key={c.id} className="flex items-center gap-4 cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  checked={selectedCategories.includes(c.id) || selectedCategories.includes(c.handle)}
                                  onChange={() => toggleCategory(c.id, c.handle)}
                                  className="hidden"
                                />
                                <div className={`w-5 h-5 border flex items-center justify-center transition-all ${selectedCategories.includes(c.id) || selectedCategories.includes(c.handle) ? 'border-slate-950' : 'border-slate-200 group-hover:border-slate-950'}`}>
                                   <div className={`w-2.5 h-2.5 bg-slate-950 transition-opacity ${selectedCategories.includes(c.id) || selectedCategories.includes(c.handle) ? 'opacity-100' : 'opacity-0'}`}></div>
                                </div>
                                <Typography variant="body" className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${selectedCategories.includes(c.id) || selectedCategories.includes(c.handle) ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-950'}`}>{c.name}</Typography>
                              </label>
                           ))
                          )}
                        </div>
                    </FilterSection>

                    <FilterSection title="Presupuesto" scrollable={false}>
                        <div className="space-y-8">
                           <input 
                             type="range" 
                             min="0" 
                             max="200000" 
                             step="2000"
                             value={priceRange} 
                             onChange={(e) => {
                               setPriceRange(Number(e.target.value));
                               setCurrentPage(1);
                             }}
                             className="w-full accent-slate-950 cursor-pointer" 
                           />
                           <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-lg">
                              <div className="text-center">
                                 <span className="block text-[8px] font-bold text-slate-400 uppercase">Min</span>
                                 <span className="font-black text-[11px]">$0</span>
                              </div>
                              <div className="h-8 w-px bg-slate-200"></div>
                              <div className="text-center">
                                 <span className="block text-[8px] font-bold text-slate-400 uppercase">Max</span>
                                 <span className="font-black text-[11px]">${priceRange.toLocaleString()}</span>
                              </div>
                           </div>
                        </div>
                    </FilterSection>

                    <FilterSection title="Marcas" scrollable={false}>
                        <div className="grid grid-cols-2 gap-2">
                           {brands.length > 0 ? (
                             brands.map(brand => (
                               <button 
                                 key={brand} 
                                 onClick={() => toggleBrand(brand)}
                                 className={`px-4 py-2 border text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${
                                   selectedBrands.includes(brand)
                                   ? 'border-slate-950 bg-slate-950 text-white' 
                                   : 'border-slate-100 text-slate-400 hover:border-slate-950 hover:text-slate-950'
                                 }`}
                               >
                                  {brand}
                               </button>
                             ))
                           ) : (
                             <Typography variant="body" className="text-slate-400 text-[10px] col-span-2">
                               No hay marcas disponibles
                             </Typography>
                           )}
                        </div>
                    </FilterSection>
                 </div>
              </div>
           </aside>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {isMobileDrawerOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-60 lg:hidden"
                  />
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-70 lg:hidden flex flex-col shadow-2xl"
                  >
                    <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10 flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Typography variant="h4" className="text-xs tracking-[0.2em] text-slate-950 font-bold uppercase">FILTROS (TEST)</Typography>
                          
                          {/* Persistent Header Feedback - Refined with labels and colors */}
                          <div className={`px-2.5 py-1 rounded-full border flex items-center gap-2 transition-all duration-300 ${
                            normalizedProducts.length > 0 
                            ? 'bg-green-50/50 border-green-100' 
                            : 'bg-red-50/30 border-red-100 animate-pulse'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${normalizedProducts.length > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`text-[7px] font-black uppercase tracking-widest ${normalizedProducts.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {normalizedProducts.length > 0 ? 'Encontrados' : 'Sin coincidencia'}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => setIsMobileDrawerOpen(false)}
                          className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-950 transition-colors"
                        >
                          <span className="text-lg">✕</span>
                        </button>
                      </div>

                      {/* Unified Mobile Action Bar */}
                      <div className="flex items-center justify-between">
                         <button 
                           onClick={resetFilters}
                           className="text-[10px] font-medium uppercase text-slate-400 hover:text-slate-950 transition-colors tracking-[0.15em]"
                         >
                           Limpiar Todo
                         </button>
                         <button 
                           onClick={() => {
                             resetFilters();
                             setIsMobileDrawerOpen(false);
                           }}
                           className="text-[10px] font-medium uppercase text-slate-600 hover:text-slate-950 transition-colors tracking-[0.15em]"
                         >
                           Ver Todos
                         </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
                      {/* Live Filter Results Alert removed from here and moved to sticky header */}
                      
                      {/* Sidebar Search inside Drawer */}
                      <div className="space-y-3">
                        <div className="relative group">
                          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
                          <input 
                            type="text" 
                            placeholder="BUSCAR EN CATÁLOGO" 
                            value={query}
                            onChange={(e) => {
                              setQuery(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-4 outline-none focus:bg-white focus:border-slate-950 transition-all text-[10px] font-black tracking-widest placeholder:text-slate-300 rounded-none uppercase"
                          />
                        </div>
                      </div>

                      <FilterSection title="Categorías" scrollable={false}>
                        <div className="space-y-4 pb-4">
                          {loading ? (
                            <div className="space-y-4">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="flex items-center gap-4 animate-pulse">
                                  <div className="w-5 h-5 bg-slate-50 border border-slate-100" />
                                  <div className="h-3 w-32 bg-slate-50 rounded" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            categories.map(c => (
                             <label key={c.id} className="flex items-center gap-4 cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  checked={selectedCategories.includes(c.id)}
                                  onChange={() => toggleCategory(c.id)}
                                  className="hidden"
                                />
                                <div className={`w-5 h-5 border flex items-center justify-center transition-all ${selectedCategories.includes(c.id) ? 'border-slate-950' : 'border-slate-200 group-hover:border-slate-950'}`}>
                                   <div className={`w-2.5 h-2.5 bg-slate-950 transition-opacity ${selectedCategories.includes(c.id) ? 'opacity-100' : 'opacity-0'}`}></div>
                                </div>
                                <Typography variant="body" className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${selectedCategories.includes(c.id) ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-950'}`}>{c.name}</Typography>
                             </label>
                           ))
                          )}
                        </div>
                      </FilterSection>

                      <FilterSection title="Presupuesto" scrollable={false}>
                        <div className="space-y-8 pb-4">
                           <input 
                             type="range" 
                             min="0" 
                             max="200000" 
                             step="2000"
                             value={priceRange} 
                             onChange={(e) => {
                               setPriceRange(Number(e.target.value));
                               setCurrentPage(1);
                             }}
                             className="w-full accent-slate-950 cursor-pointer" 
                           />
                           <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100 rounded-lg">
                              <div className="text-center">
                                 <span className="block text-[8px] font-bold text-slate-400 uppercase">Min</span>
                                 <span className="font-black text-[11px]">$0</span>
                              </div>
                              <div className="h-8 w-px bg-slate-200"></div>
                              <div className="text-center">
                                 <span className="block text-[8px] font-bold text-slate-400 uppercase">Max</span>
                                 <span className="font-black text-[11px]">${priceRange.toLocaleString()}</span>
                              </div>
                           </div>
                        </div>
                      </FilterSection>

                      <FilterSection title="Marcas" scrollable={false}>
                        <div className="grid grid-cols-2 gap-2 pb-8">
                           {brands.length > 0 ? (
                             brands.map(brand => (
                               <button 
                                 key={brand} 
                                 onClick={() => toggleBrand(brand)}
                                 className={`px-4 py-2 border text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${
                                   selectedBrands.includes(brand)
                                   ? 'border-slate-950 bg-slate-950 text-white' 
                                   : 'border-slate-100 text-slate-400 hover:border-slate-950 hover:text-slate-950'
                                 }`}
                               >
                                  {brand}
                               </button>
                             ))
                           ) : (
                             <Typography variant="body" className="text-slate-400 text-[10px] col-span-2">
                               No hay marcas disponibles
                             </Typography>
                           )}
                        </div>
                      </FilterSection>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-white">
                      <button 
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className="w-full py-4 bg-slate-950 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-lg shadow-slate-200 active:scale-95 transition-all"
                      >
                        Ver {normalizedProducts.length} Resultados
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

           {/* Results Grid */}
           <div ref={resultsRef} className={`flex-1 space-y-8 sm:space-y-12 transition-all duration-500 ${normalizedProducts.length > 0 ? 'min-h-[800px]' : 'min-h-[400px]'}`}>


              {/* Added: Global active filter/search feedback message */}
              {(query.trim() !== '' || (normalizedProducts.length === 0 && products.length > 0) || selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange !== 200000) && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 ${
                    normalizedProducts.length > 0 
                    ? 'bg-slate-50/50 border-slate-100' 
                    : 'bg-red-50/30 border-red-100 shadow-[0_0_20px_rgba(239,68,68,0.05)]'
                  }`}>
                    <div className="relative">
                      <span className={`flex h-2 w-2 rounded-full ${normalizedProducts.length > 0 ? 'bg-slate-900' : 'bg-red-500'}`} />
                      {normalizedProducts.length === 0 && (
                        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                      )}
                    </div>
                    
                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] leading-none ${
                        normalizedProducts.length > 0 ? 'text-slate-600' : 'text-red-600'
                      }`}>
                      {normalizedProducts.length > 0 ? (
                        <>
                          <span className="text-slate-900">{normalizedProducts.length}</span> RESULTADOS ENCONTRADOS
                        </>
                      ) : (
                        'SIN COINCIDENCIAS PARA TU BÚSQUEDA'
                      )}
                    </span>
                  </div>

                  {/* Quick clear button if filters active */}
                  {(query || selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange !== 200000) && (
                    <button 
                      onClick={resetFilters}
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest text-white leading-none">Limpiar Todo</span>
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <X size={10} className="text-white" />
                      </div>
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-6 border-b border-slate-100 gap-6 lg:gap-4">
                 <div className="flex items-center gap-4">
                    <Typography variant="detail" className="text-slate-400 normal-case whitespace-nowrap">Mostrando</Typography>
                    <Badge variant="outline" className="text-[10px] py-1 px-3 rounded-full whitespace-nowrap">{normalizedProducts.length} RESULTADOS</Badge>
                 </div>
              </div>


              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-white border border-slate-100">
                   {paginatedProducts.map((p) => (
                      <ProductCard key={p.id} {...p} slug={p.slug} />
                   ))}
                </div>
              ) : (
                <div className="py-20 sm:py-32 flex flex-col items-center justify-center space-y-6 sm:space-y-8 border-2 border-dashed border-slate-100 rounded-[40px] sm:rounded-[60px] bg-slate-50/10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50">
                    <Search size={32} className="sm:size-10 text-slate-100" />
                  </div>
                  <div className="text-center space-y-2 sm:space-y-3 px-4">
                    <Typography variant="h3" className="text-2xl sm:text-3xl tracking-tighter uppercase font-black">Sin coincidencias</Typography>
                    <Typography variant="body" className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">
                      Intenta ajustar tus filtros o búsqueda para encontrar lo que necesitas.
                    </Typography>
                  </div>
                  <button 
                    onClick={resetFilters}
                    className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] px-8 sm:px-12 py-3 sm:py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-slate-200"
                  >
                    Resetear Filtros
                  </button>
                </div>
              )}

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="pt-20 flex flex-wrap justify-center items-center gap-2 sm:gap-4">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-12 px-6 flex items-center justify-center border border-slate-100 hover:border-slate-950 font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:hover:border-slate-100"
                  >
                    Anterior
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 flex items-center justify-center border transition-all font-black text-xs ${
                          currentPage === page 
                          ? 'bg-slate-950 border-slate-950 text-white shadow-xl' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-950 hover:text-slate-950'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-12 px-6 flex items-center justify-center border border-slate-100 hover:border-slate-950 font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:hover:border-slate-100"
                  >
                    Siguiente
                  </button>
                </div>
              )}
           </div>
        </div>
      </section>

      {/* Floating Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-full shadow-2xl shadow-slate-400/50 group"
        >
          <SlidersHorizontal size={16} className="text-white/60 group-hover:text-white transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filtros</span>
          { (selectedCategories.length > 0 || selectedBrands.length > 0 || query) && (
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </motion.button>
      </div>
    </MainLayout>
  );
};
