'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Typography } from '@/components/atoms/Typography';
import { ProductCard } from '@/components/molecules/ProductCard';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts, type MedusaProduct } from '@/services/medusa/products';

interface TransformedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  tags: string[];
  slug: string;
  rating: number;
}



export const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFeaturedProducts();
        console.log(data);

        const transformed = data.map((product: MedusaProduct) => ({
          id: product.id,
          name: product.title,
          price: (product.variants?.[0]?.prices?.[0]?.amount ?? 0), // Medusa uses cents
          image: product.thumbnail || '',
          images: product.images?.map(img => img.url) || [],
          tags: product.tags?.map(tag => tag.value) || [],
          slug: product.handle,
          rating: (product.metadata?.rating as number) || 5.0
        }));

        setProducts(transformed);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-32 sm:py-48 bg-white border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-20 gap-8">
          <div className="space-y-4">
            <Typography variant="detail" className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">PRODUCTOS MÁS VENDIDOS</Typography>
            <Typography variant="h2" className="text-4xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.9] sm:leading-[0.85]">EQUIPAMIENTO <br /> NUEVO</Typography>
          </div>
          <Link href="/shop" className="group flex items-center gap-4 py-2 border-b-2 border-slate-100 hover:border-slate-950 transition-all duration-500">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-950 transition-colors duration-500">VER CATÁLOGO</span>
            <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-950 group-hover:translate-x-3 transition-all duration-500 ease-out" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((item) => (
              <div key={item.id} className="h-full">
                <ProductCard {...item} />
              </div>
          ))}
        </div>
      </div>
    </section>
  );
};
