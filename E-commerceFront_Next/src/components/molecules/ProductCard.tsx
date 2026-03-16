'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ArrowLeftRight, XIcon as X, Heart } from '@/components/icons';
import { useCompare } from '@/context/CompareContext';
import { useWishlist } from '@/context/WishlistContext';
import type { CompareItem } from '@/context/CompareContext';
import { Typography } from '@/components/atoms/Typography';
import { AddToCartModal } from '@/components/organisms/AddToCartModal';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price?: number;
  image: string;
  hoverImage?: string;
  images?: string[];
  tags?: string[];
  slug: string;
  vendor?: string;
  rating?: number;
  isWholesale?: boolean;
  productType?: string;
  description?: string;
  categories?: { id: string; name: string; handle: string }[];
  brand?: { id: string; name: string };
  warranty?: { id: string; name: string };
  usage?: { id: string; name: string };
  shipping?: { id: string; name: string };
  color?: string;
  colors?: string[];
  sizes?: string[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  hoverImage,
  images = [],
  tags = [],
  slug,
  vendor = "Ladynail Shop",
  rating = 4.8,
  isWholesale = false,
  description,
  categories,
  brand,
  warranty,
  usage,
  shipping,
  color,
  colors,
  sizes,
}) => {
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const { toggleFavorite, isFavorite } = useWishlist();
  const alreadyInCompare = isInCompare(id);
  const alreadyInWishlist = isFavorite(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dynamicRating, setDynamicRating] = useState<number | null>(null);
  React.useEffect(() => {
    import('@/services/medusa/review').then(async ({ getReviews }) => {
      try {
        const data = await getReviews(id);
        if (data && data.reviews && data.reviews.length > 0) {
          setDynamicRating(data.average_rating || 0);
        } else {
          setDynamicRating(0);
        }
      } catch (e) {
        console.error("Error fetching reviews for ProductCard", e);
      }
    });
  }, [id]);

  const displayRating = dynamicRating !== null ? dynamicRating : rating;
  
  const gallery = images.length > 0 ? images : (hoverImage ? [image, hoverImage] : [image]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div 
      className="group bg-white border border-border rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_rgba(42,37,32,0.12)] transition-all duration-500 flex flex-col h-full font-sans"
      onMouseEnter={() => {}}
      onMouseLeave={() => {
        // Optional: Reset to first image on leave
        // setCurrentIndex(0);
      }}
    >
      {/* Visual Workspace */}
      <div className="relative aspect-4/5 overflow-hidden bg-muted">
        <Link href={`/product/${id}`} className="absolute inset-0 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full touch-none"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                if (info.offset.x > swipeThreshold) prevImage();
                else if (info.offset.x < -swipeThreshold) nextImage();
              }}
            >
              <Image 
                src={gallery[currentIndex]} 
                alt={name} 
                fill 
                className="object-cover transition-transform duration-[2s] group-hover:scale-105 select-none pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Pagination Indicators (only if more than 1 image) */}
          {gallery.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20 transition-opacity duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              {gallery.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${currentIndex === i ? 'w-4 bg-white shadow-sm' : 'w-1 bg-white/40'}`}
                />
              ))}
            </div>
          )}

          {/* Quick Interaction Overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
        </Link>
        
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
           <button
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               toggleFavorite({ id, name, price: price ?? 0, image, slug, tags, vendor, description, categories, brand, warranty, usage, shipping });
             }}
             className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${alreadyInWishlist ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur text-slate-900 hover:bg-white'}`}
             aria-label={alreadyInWishlist ? 'Eliminar de favoritos' : 'Añadir de favoritos'}
           >
             <Heart size={16} fill={alreadyInWishlist ? 'currentColor' : 'none'} className={alreadyInWishlist ? 'scale-110' : ''} />
           </button>
        </div>

        {/* Quality/Type Badge */}
        {(() => {
          const SYSTEM_TAGS = ['destacados-home', 'nuevo', 'new'];
          const visibleTag = tags.find(t => !SYSTEM_TAGS.includes(t.toLowerCase()) && !t.includes(':'));
          return (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2 z-20">
              {isWholesale && (
                <span className="bg-slate-950 text-white text-[7px] sm:text-[9px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-widest shadow-lg">Mayorista</span>
              )}
              {visibleTag && (
                <span className="bg-white/90 backdrop-blur text-slate-950 text-[7px] sm:text-[9px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-widest shadow-sm border border-slate-100">{visibleTag}</span>
              )}
            </div>
          );
        })()}

        {alreadyInCompare && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeFromCompare(id);
            }}
            className="absolute top-12 right-2 sm:hidden bg-red-500 text-white p-1.5 rounded-full shadow-md z-30"
            aria-label="Eliminar de comparación"
          >
            <X size={14} />
          </button>
        )}
        
        <div className="absolute bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-6 z-30 translate-y-0 opacity-100 sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-500 flex gap-1 sm:gap-2">
           <button 
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               setIsModalOpen(true);
             }}
             className="flex-1 bg-slate-900 text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-2xl hover:bg-[#22c55e] transition-all flex items-center justify-center gap-1 sm:gap-2"
           >
             <ShoppingBag size={12} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Añadir</span>
           </button>
           <button
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();

               const compareItem: CompareItem = { id, name, price: price ?? 0, image, tags, slug, vendor: vendor ?? 'Ladynail Shop', rating, description, categories, brand, warranty, usage, shipping };
               if (alreadyInCompare) {
                 removeFromCompare(id);
               } else {
                 addToCompare(compareItem);
               }
             }}
             className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-2xl transition-all ${alreadyInCompare ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
           >
             <ArrowLeftRight size={12} className="sm:w-4 sm:h-4" />
           </button>
        </div>
      </div>

      {/* Corporate Metadata */}
      <div className="p-3 sm:p-6 flex flex-col flex-1 justify-between gap-3 sm:gap-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
              <span className="text-[8px] sm:text-[10px] font-bold text-accent uppercase tracking-widest bg-muted px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap">{vendor}</span>
              <div className="flex items-center gap-0.5 sm:gap-1 text-foreground/40 flex-shrink-0">
                 <Star size={10} fill={displayRating > 0 ? "currentColor" : "none"} className={displayRating > 0 ? "text-yellow-400" : "text-slate-300"} />
                 <span className="text-[8px] sm:text-[10px] font-bold text-foreground">{displayRating > 0 ? displayRating : 'Sin reseñas'}</span>
              </div>
           </div>
           <Link href={`/product/${id}`} className="relative z-20 block group/title">
              <Typography variant="h3" className="text-xs sm:text-sm font-bold text-foreground group-hover/title:text-accent transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
                {name}
              </Typography>
           </Link>
        </div>
        
        <div className="pt-2 sm:pt-4 border-t border-border flex items-center justify-between gap-2">
          <Typography variant="h3" className="text-base sm:text-lg font-black text-foreground tracking-tighter">
            ${(price ?? 0).toLocaleString()}
          </Typography>
          <div className="text-[7px] sm:text-[9px] text-foreground/40 font-bold uppercase tracking-widest whitespace-nowrap">
            Disponible
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          id,
          name,
          price: price ?? 0,
          image,
          slug,
          tags,
          vendor,
          color,
          colors,
          sizes
        }}
      />
    </div>
  );
};
