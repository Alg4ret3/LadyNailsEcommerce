'use client';

import React, { useState } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '@/context/CategoriesContext';
import { useShop } from '@/context/ShopContext';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  scrollable?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = true, 
  scrollable = true 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center group"
      >
        <Typography variant="h4" className="text-[10px] font-black tracking-[0.2em] text-slate-400 group-hover:text-slate-950 transition-colors uppercase">{title}</Typography>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown size={12} className="text-slate-300 group-hover:text-slate-950 transition-colors" />
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

export const ShopSidebar = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { brands, loading: productsLoading, filters, setFilters, resetFilters } = useShop();
  
  const toggleCategory = (val: string) => {
    const isSelected = filters.selectedCategories.includes(val);
    const newCats = isSelected
      ? filters.selectedCategories.filter(c => c !== val)
      : [...filters.selectedCategories, val];
    
    setFilters({ selectedCategories: newCats });
  };

  const toggleBrand = (brand: string) => {
    const isSelected = filters.selectedBrands.includes(brand);
    const newBrands = isSelected
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    
    setFilters({ selectedBrands: newBrands });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 pb-6 border-b border-slate-100">
        <Typography variant="h4" className="text-xs tracking-[0.2em] text-slate-950 font-bold uppercase">FILTROS</Typography>
        <div className="flex items-center justify-between">
            <button 
              onClick={resetFilters}
              className="text-[10px] font-medium uppercase text-slate-400 hover:text-slate-950 transition-colors tracking-[0.15em]"
            >
              Limpiar
            </button>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-3 pt-2">
        <div className="relative group">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
          <input 
            type="text" 
            placeholder="BUSCAR EN CATÁLOGO" 
            value={filters.query}
            onChange={(e) => setFilters({ query: e.target.value })}
            className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-4 outline-none focus:bg-white focus:border-slate-950 transition-all text-[10px] font-black tracking-widest placeholder:text-slate-300 rounded-none uppercase shadow-sm"
          />
        </div>
      </div>

      <FilterSection title="Categorías" scrollable={false}>
          <div className="space-y-4">
            {categoriesLoading ? (
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
                    checked={filters.selectedCategories.includes(c.id) || filters.selectedCategories.includes(c.handle)}
                    onChange={() => toggleCategory(c.handle || c.id)}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 border flex items-center justify-center transition-all ${filters.selectedCategories.includes(c.id) || filters.selectedCategories.includes(c.handle) ? 'border-slate-950 bg-slate-950' : 'border-slate-200 group-hover:border-slate-950'}`}>
                      <div className={`w-2 h-2 bg-white rounded-full transition-opacity ${filters.selectedCategories.includes(c.id) || filters.selectedCategories.includes(c.handle) ? 'opacity-100' : 'opacity-0'}`}></div>
                  </div>
                  <Typography variant="body" className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${filters.selectedCategories.includes(c.id) || filters.selectedCategories.includes(c.handle) ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-950'}`}>{c.name}</Typography>
                </label>
              ))
            )}
          </div>
      </FilterSection>


<FilterSection title="Marcas" scrollable={false}>
          <div className="grid grid-cols-2 gap-2">
            {productsLoading ? (
               <Typography variant="body" className="text-slate-400 text-[10px]">Cargando marcas...</Typography>
            ) : brands.length > 0 ? (
              brands.map(brand => (
                <button 
                  key={brand} 
                  onClick={() => toggleBrand(brand)}
                  className={`px-4 py-2 border text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${
                    filters.selectedBrands.includes(brand)
                    ? 'border-slate-950 bg-slate-950 text-white shadow-xl shadow-slate-200' 
                    : 'border-slate-100 text-slate-400 hover:border-slate-950 hover:text-slate-950'
                  }`}
                >
                    {brand}
                </button>
              ))
            ) : (
              <Typography variant="body" className="text-slate-400 text-[10px]">Sin marcas</Typography>
            )}
          </div>
      </FilterSection>
    </div>
  );
};
