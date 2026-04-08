'use client';

import React, { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Typography } from '@/components/atoms/Typography';
import { Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '@/context/CategoriesContext';
import { useShop } from '@/context/ShopContext';
import { filterProducts } from '@/utils/shop-filters';

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
  const pathname = usePathname();
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, brands, loading: productsLoading, filters, setFilters, resetFilters } = useShop();

  const currentPathCategory = useMemo(() => {
    const parts = pathname.split('/');
    if (parts.length > 2 && parts[1] === 'shop' && parts[2] !== '') {
       try { return decodeURIComponent(parts[2]); } catch (e) { return parts[2]; }
    }
    return null;
  }, [pathname]);

  const matchedCount = useMemo(() => {
    let base = products;
    if (currentPathCategory) {
      base = base.filter(p => 
        p.categories?.some((c: any) => c.handle === currentPathCategory)
      );
    }
    return filterProducts(base, filters).length;
  }, [products, filters, currentPathCategory]);
  
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
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <button 
          onClick={resetFilters}
          className="text-[10px] font-bold uppercase text-slate-400 hover:text-slate-950 transition-colors tracking-[0.2em]"
        >
          Limpiar
        </button>
      </div>

      {/* Minimalist Search */}
      <div className="pt-2">
        <div className="relative group">
          <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={filters.query}
            onChange={(e) => setFilters({ query: e.target.value })}
            className="w-full bg-transparent border-b border-slate-100 pl-7 pr-4 py-3 outline-none focus:border-slate-900 transition-all text-xs font-medium tracking-wide placeholder:text-slate-300 text-slate-800"
          />
        </div>
        {!productsLoading && (
          <div className="mt-3 text-[9px] uppercase tracking-widest font-bold">
            {matchedCount === 0 ? (
              <span className="text-red-500">Sin coincidencias</span>
            ) : (
              <span className="text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                {matchedCount} {matchedCount === 1 ? 'resultado' : 'resultados'}
              </span>
            )}
          </div>
        )}
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
