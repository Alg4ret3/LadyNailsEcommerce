'use client';

import React, { useState } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { ProductCard } from '@/components/molecules/ProductCard';
import { Search, Filter, ChevronDown, ChevronUp, SlidersHorizontal, Grid2X2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from './MainLayout';
import { Badge } from '@/components/atoms/Badge';

// Mock products database (this should ideally come from a shared constant or API)
const ALL_PRODUCTS = [
  { 
    id: '1', 
    name: 'Máquina Master Fade Pro', 
    price: 450000, 
    image: '/products/clipper-1.png', 
    hoverImage: '/products/clipper-2.png',
    images: ['/products/clipper-1.png', '/products/clipper-2.png'],
    category: 'Barbería', 
    slug: 'maquina-master-fade-pro', 
    category_slug: 'barber-hair',
    rating: 5.0,
    vendor: 'Wahl'
  },
  { 
    id: '2', 
    name: 'Lámpara LED UV Industrial', 
    price: 185000, 
    image: '/products/uv-lamp-industrial.png', 
    hoverImage: '/products/uv-lamp-2.png',
    images: ['/products/uv-lamp-industrial.png', '/products/uv-lamp-2.png'],
    category: 'Uñas', 
    category_slug: 'uv-lamps',
    slug: 'lampara-led-uv-industrial', 
    rating: 4.9,
    vendor: 'Mía Secret'
  },
  { 
    id: '3', 
    name: 'Silla Barbería Elite Heavy-Duty', 
    price: 2100000, 
    image: '/products/chair-1.png', 
    hoverImage: '/products/chair-2.png',
    images: ['/products/chair-1.png', '/products/chair-2.png'],
    category: 'Mobiliario', 
    category_slug: 'barber-hair',
    slug: 'silla-barberia-elite', 
    rating: 5.0,
    vendor: 'Luxury Salon'
  },
  { 
    id: '4', 
    name: 'Kit Aerógrafo Maquillaje Pro', 
    price: 320000, 
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000', 
    hoverImage: 'https://images.unsplash.com/photo-1596462502278-27bfac4023c6?q=80&w=1000',
    images: [
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000',
        'https://images.unsplash.com/photo-1596462502278-27bfac4023c6?q=80&w=1000'
    ],
    category: 'Maquillaje', 
    category_slug: 'makeup',
    slug: 'kit-aerografo-pro', 
    rating: 4.8,
    vendor: 'Loreal'
  },
  { 
    id: '5', 
    name: 'Esmalte Semipermanente Pro', 
    price: 35000, 
    image: 'https://images.unsplash.com/photo-1604654894611-6973b376cbde?q=80&w=1000', 
    images: [
        'https://images.unsplash.com/photo-1604654894611-6973b376cbde?q=80&w=1000',
        'https://images.unsplash.com/photo-1627252824361-93c6628006bf?q=80&w=1000'
    ],
    category: 'Esmaltes', 
    category_slug: 'semi-permanent',
    slug: 'esmalte-semipermanente-pro', 
    rating: 4.7,
    vendor: 'Mía Secret'
  },
];

const CATEGORIES = [
  { name: 'Lámparas UV', slug: 'uv-lamps' },
  { name: 'Drilles', slug: 'drills' },
  { name: 'Esmaltes', slug: 'semi-permanent' },
  { name: 'Barbería', slug: 'barber-hair' },
  { name: 'Maquillaje', slug: 'makeup' },
  { name: 'Cuidado Piel', slug: 'skincare' },
];

const FilterSection = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center group"
      >
        <Typography variant="h4" className="text-[10px] font-bold tracking-[0.15em] text-slate-400 group-hover:text-slate-950 transition-colors uppercase">{title}</Typography>
        {isOpen ? <ChevronUp size={12} className="text-slate-200" /> : <ChevronDown size={12} className="text-slate-200" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ShopLayoutProps {
  title: string;
  subtitle?: string;
  initialCategory?: string | null;
}

export const ShopLayout: React.FC<ShopLayoutProps> = ({ title, subtitle, initialCategory = null }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [priceRange, setPriceRange] = useState(2100000);

  const filteredProducts = React.useMemo(() => {
    return ALL_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !selectedCategory || p.category_slug === selectedCategory;
      const matchesPrice = p.price <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [query, selectedCategory, priceRange]);

  return (
    <MainLayout>
      <section className="pt-32 sm:pt-44 pb-32 px-4 sm:px-6 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-16 sm:mb-20 space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
              <div className="space-y-4">
                 <Typography variant="detail" className="text-slate-400">{subtitle || 'Tendencias en Belleza & Cuidado'}</Typography>
                 <Typography variant="h1" className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl tracking-tighter leading-[0.85] sm:leading-[0.9] font-medium">
                   {title.split(' ')[0]} <br /> 
                   <span className="text-slate-200 font-light">{title.split(' ').slice(1).join(' ') || 'PARA TI'}</span>
                 </Typography>
              </div>
              
               <div className="hidden md:flex w-full md:w-auto flex-col items-stretch sm:flex-row sm:items-center gap-3">
                 <div className="relative w-full sm:w-80 group">
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
                  onClick={() => { setQuery(''); setSelectedCategory(initialCategory); setPriceRange(2100000); }}
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
              <div className="lg:sticky lg:top-32 space-y-2">
                 <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <Typography variant="h4" className="text-xs tracking-[0.2em] text-slate-950 font-bold uppercase">FILTROS</Typography>
                    <button 
                      onClick={() => { setSelectedCategory(initialCategory); setPriceRange(2100000); }}
                      className="text-[9px] font-bold uppercase text-slate-300 hover:text-slate-950 transition-colors tracking-widest"
                    >
                      Limpiar
                    </button>
                 </div>

                 <FilterSection title="Categorías">
                    <div className="space-y-4">
                       {CATEGORIES.map(c => (
                         <label key={c.slug} className="flex items-center gap-4 cursor-pointer group">
                            <input 
                              type="radio" 
                              name="category" 
                              checked={selectedCategory === c.slug}
                              onChange={() => setSelectedCategory(c.slug)}
                              className="hidden"
                            />
                            <div className={`w-5 h-5 border flex items-center justify-center transition-all ${selectedCategory === c.slug ? 'border-slate-950' : 'border-slate-200 group-hover:border-slate-950'}`}>
                               <div className={`w-2.5 h-2.5 bg-slate-950 transition-opacity ${selectedCategory === c.slug ? 'opacity-100' : 'opacity-0'}`}></div>
                            </div>
                            <Typography variant="body" className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${selectedCategory === c.slug ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-950'}`}>{c.name}</Typography>
                         </label>
                       ))}
                    </div>
                 </FilterSection>

                 <FilterSection title="Presupuesto">
                    <div className="space-y-8">
                       <input 
                         type="range" 
                         min="0" 
                         max="2100000" 
                         value={priceRange} 
                         onChange={(e) => setPriceRange(Number(e.target.value))}
                         className="w-full accent-slate-950" 
                       />
                       <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-100">
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

                 <FilterSection title="Marcas">
                    <div className="grid grid-cols-2 gap-2">
                       {['OPI', 'Wahl', 'Mía Secret', 'Andis', 'Loreal', 'Babyliss'].map(brand => (
                         <button key={brand} className="px-4 py-2 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:border-slate-950 hover:text-slate-950 transition-all">
                            {brand}
                         </button>
                       ))}
                    </div>
                 </FilterSection>
              </div>
           </aside>

           {/* Results Grid */}
           <div className="flex-1 space-y-12">

              {/* Mobile-only search bar — placed right above products to minimize scroll */}
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
                {query.trim() !== '' && (
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-full">
                    {filteredProducts.length > 0 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                          {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Sin resultados — intenta otra búsqueda
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b border-slate-100 gap-6 sm:gap-4">
                 <div className="flex items-center gap-4">
                    <Typography variant="detail" className="text-slate-400 normal-case whitespace-nowrap">Mostrando</Typography>
                    <Badge variant="outline" className="text-[10px] py-1 px-3 rounded-full whitespace-nowrap">{filteredProducts.length} RESULTADOS</Badge>
                 </div>
                 <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
                    <div className="hidden sm:flex items-center gap-4 border-r border-slate-100 pr-8">
                       <button className="text-slate-950" aria-label="Grid view"><Grid2X2 size={20} /></button>
                       <button className="text-slate-200 hover:text-slate-400 transition-colors" aria-label="List view"><Filter size={20} /></button>
                    </div>
                    <select className="bg-transparent font-black text-[10px] uppercase tracking-[0.2em] outline-none cursor-pointer max-w-[150px] sm:max-w-none truncate">
                       <option>Ordenar por: Popularidad</option>
                       <option>Recientes</option>
                       <option>Precio: Menor a Mayor</option>
                    </select>
                 </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                   {filteredProducts.map((p) => (
                      <div key={p.id} className="h-full">
                         <ProductCard {...p} slug={p.slug} />
                      </div>
                   ))}
                </div>
              ) : (
                <div className="py-24 text-center border border-dashed border-slate-100 rounded-3xl">
                   <Typography variant="body" className="text-slate-400">No se encontraron productos en esta categoría.</Typography>
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
