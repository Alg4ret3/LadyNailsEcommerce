'use client';

import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { ProductCard } from '@/components/molecules/ProductCard';
import { useProductsByCategory, useFeaturedProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

interface RelatedProductsProps {
  categoryHandle?: string;
  currentProductId: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ categoryHandle, currentProductId }) => {
  // 1. Intentamos cargar productos de la misma categoría
  const { data: categoryProducts, isLoading: loadingCategory } = useProductsByCategory(categoryHandle || '');
  
  // 2. Cargamos destacados como fallback
  const { data: featuredProducts, isLoading: loadingFeatured } = useFeaturedProducts();

  const isLoading = loadingCategory || loadingFeatured;

  // Priorizamos productos de la misma categoría, excluyendo el actual
  const filteredCategoryProducts = categoryProducts?.filter(p => p.id !== currentProductId) || [];
  
  // Si no hay suficientes en la categoría, rellenamos con destacados (también excluyendo el actual)
  const displayProducts = filteredCategoryProducts.length >= 4 
    ? filteredCategoryProducts 
    : [...filteredCategoryProducts, ...(featuredProducts?.filter(p => p.id !== currentProductId && !filteredCategoryProducts.some(cp => cp.id === p.id)) || [])];

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="animate-spin text-slate-200" size={32} />
      </div>
    );
  }

  if (displayProducts.length === 0) return null;

  return (
    <section aria-label="Productos Relacionados" className="py-32 sm:py-48 bg-white border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16 sm:mb-20">
          <div className="space-y-4">
            <Typography variant="detail" className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
              {categoryHandle ? 'PRODUCTOS SIMILARES' : 'MÁS PARA TI'}
            </Typography>
            <Typography variant="h2" className="text-4xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.9] sm:leading-[0.85]">
              TE PUEDE <br /> INTERESAR
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayProducts.slice(0, 4).map((item) => (
            <div key={item.id} className="h-full">
              <ProductCard 
                id={item.id}
                name={item.title}
                price={(item.variants?.[0]?.prices?.[0]?.amount ?? 0)}
                image={item.thumbnail || ''}
                images={item.images?.map(img => img.url) || []}
                tags={item.tags?.map(tag => tag.value) || []}
                slug={item.handle}
                variants={item.variants || []}
                rating={(item.metadata?.rating as number) || 5.0}
                brand={item.brand}
                usage={item.usage}
                warranty={item.warranty}
                shipping={item.shipping}
                categories={item.categories}
                description={item.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
