'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { ProductCard } from '@/components/molecules/ProductCard';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(200000);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results top when filters change
  useEffect(() => {
    if (resultsRef.current) {
      const yOffset = -100; // Account for fixed header
      const element = resultsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [query, selectedCategories, selectedBrands, priceRange]);

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
  }));

  const resetFilters = () => {
    setQuery('');
    setSelectedCategories(initialCategory ? [initialCategory] : []);
    setSelectedBrands([]);
    setPriceRange(200000);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
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
              
               <div className="hidden lg:flex w-full lg:w-auto flex-col items-stretch lg:flex-row lg:items-center gap-3">
                 <div className="relative w-full lg:w-80 group">
                   <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                   <input 
                     type="text" 
                     placeholder="Busca lo que necesitas..." 
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     className="w-full bg-white border border-slate-100 pl-14 pr-8 py-4 outline-none focus:border-slate-300 transition-all text-sm font-light placeholder:text-slate-300"
                   />
                 </div>
                 <button 
                  onClick={resetFilters}
                  className="hidden lg:flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-400 font-bold text-[9px] uppercase tracking-widest hover:bg-slate-100 hover:text-slate-950 transition-all rounded-full border border-slate-100"
                 >
                    <SlidersHorizontal size={14} /> Ver Todo
                 </button>
               </div>
            </div>
         </div>

        <div className="flex flex-col lg:flex-row gap-20">
           {/* Sidebar Filters */}
           <aside className="lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-32 lg:max-h-[calc(100vh-160px)] flex flex-col">
                 <div className="flex items-center justify-between pb-6 border-b border-slate-100 shrink-0">
                    <Typography variant="h4" className="text-xs tracking-[0.2em] text-slate-950 font-bold uppercase">FILTROS</Typography>
                    <button 
                      onClick={resetFilters}
                      className="text-[9px] font-bold uppercase text-slate-300 hover:text-slate-950 transition-colors tracking-widest"
                    >
                      Limpiar
                    </button>
                 </div>

                 {/* Scrollable Container for all Filters */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4 space-y-2 py-2">
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
                        <div className="space-y-8">
                           <input 
                             type="range" 
                             min="0" 
                             max="200000" 
                             step="2000"
                             value={priceRange} 
                             onChange={(e) => setPriceRange(Number(e.target.value))}
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

           {/* Results Grid */}
           <div ref={resultsRef} className={`flex-1 space-y-8 sm:space-y-12 transition-all duration-500 ${normalizedProducts.length > 0 ? 'min-h-[800px]' : 'min-h-[400px]'}`}>

              {/* Mobile-only search bar */}
              <div className="lg:hidden space-y-3">
                <div className="relative w-full group">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Busca lo que necesitas..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white border border-slate-100 pl-12 pr-4 py-4 outline-none focus:border-slate-300 transition-all text-sm font-light placeholder:text-slate-300 rounded-xl"
                  />
                    {query && (
                      <button 
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors text-xs font-bold uppercase"
                      >
                        ✕
                      </button>
                    )}
                </div>
              </div>

              {/* Added: Global active filter/search feedback message */}
              {(query.trim() !== '' || (normalizedProducts.length === 0 && products.length > 0) || selectedCategories.length > 0 || selectedBrands.length > 0) && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 ${
                    normalizedProducts.length > 0 
                    ? 'bg-slate-50/50 border-slate-100' 
                    : 'bg-red-50/30 border-red-100 shadow-[0_0_20px_rgba(239,68,68,0.05)]'
                  }`}>
                    <div className="relative">
                      <span className={`flex h-2 w-2 rounded-full ${normalizedProducts.length > 0 ? 'bg-indigo-500' : 'bg-red-500'}`} />
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
                  {(query || selectedCategories.length > 0 || selectedBrands.length > 0) && (
                    <button 
                      onClick={resetFilters}
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest text-white leading-none">Limpiar Todo</span>
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <span className="text-white text-[10px] leading-none">✕</span>
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


              {normalizedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 bg-slate-100 border border-slate-100">
                   {normalizedProducts.map((p) => (
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

              {/* Pagination Placeholder */}
              {filteredProducts.length > 0 && (
                <div className="pt-20 flex justify-center gap-4">
                   <button className="w-12 h-12 flex items-center justify-center border border-slate-950 bg-slate-950 text-white font-black text-sm transition-all">1</button>
                   <button className="w-12 h-12 flex items-center justify-center border border-slate-100 hover:border-slate-950 font-black text-sm transition-all">2</button>
                </div>
              )}
           </div>
        </div>
      </section>
    </MainLayout>
  );
};
