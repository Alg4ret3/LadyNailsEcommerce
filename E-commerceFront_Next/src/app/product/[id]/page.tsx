'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Truck, ShieldCheck, Box, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { useParams } from 'next/navigation';
import { AddToCartModal } from '@/components/organisms/AddToCartModal';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare, type CompareItem } from '@/context/CompareContext';
import { Heart, ArrowLeftRight } from '@/components/icons';

const PRODUCTS = [
  { 
    id: '1', 
    name: 'Máquina Master Fade Pro', 
    price: 450000, 
    image: '/products/clipper-1.png', 
    images: ['/products/clipper-1.png', '/products/clipper-2.png'],
    category: 'Barbería', 
    slug: 'maquina-master-fade-pro', 
    sku: 'BK-MFP-001' 
  },
  { 
    id: '2', 
    name: 'Lámpara LED UV Industrial', 
    price: 185000, 
    image: '/products/uv-lamp-industrial.png', 
    images: ['/products/uv-lamp-industrial.png', '/products/uv-lamp-2.png'],
    category: 'Uñas', 
    slug: 'lampara-led-uv-industrial', 
    sku: 'NA-UVL-002' 
  },
  { 
    id: '3', 
    name: 'Silla Barbería Elite Heavy-Duty', 
    price: 2100000, 
    image: '/products/chair-1.png', 
    images: ['/products/chair-1.png', '/products/chair-2.png'],
    category: 'Mobiliario', 
    slug: 'silla-barberia-elite', 
    sku: 'FN-SBE-003' 
  },
  { 
    id: '4', 
    name: 'Kit Aerógrafo Maquillaje Pro', 
    price: 320000, 
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000&auto=format&fit=crop', 
    images: [
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000',
        'https://images.unsplash.com/photo-1596462502278-27bfac4023c6?q=80&w=1000'
    ],
    category: 'Maquillaje', 
    slug: 'kit-aerografo-pro', 
    sku: 'MU-KAP-004' 
  },
];

export default function ProductPage() {
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const product = PRODUCTS.find(p => p.slug === params.id) || PRODUCTS[0];
  const galleryImages = product.images || [product.image];
  const [currentIndex, setCurrentIndex] = useState(0);

  const setIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const { toggleFavorite, isFavorite } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();

  const productForActions = {
    ...product,
    vendor: 'Ladynail Shop'
  };

  const isFav = isFavorite(product.id);
  const isInComp = isInCompare(product.id);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-32 sm:pt-44 pb-24 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 bg-white border border-slate-200 p-4 sm:p-16">
          {/* Images Section */}
          <div className="space-y-6">
             <div className="relative aspect-square bg-[#f1f5f9] border border-slate-100 flex items-center justify-center overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className="absolute inset-0 p-8 sm:p-12 flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      const swipeThreshold = 50;
                      if (info.offset.x > swipeThreshold) {
                        prevImage();
                      } else if (info.offset.x < -swipeThreshold) {
                        nextImage();
                      }
                    }}
                  >
                    <Image 
                       src={galleryImages[currentIndex]} 
                       alt={product.name} 
                       fill 
                       className="object-contain p-4 sm:p-8 select-none pointer-events-none" 
                       priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Mobile Pagination Dots */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 lg:hidden">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${currentIndex === i ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300'}`}
                    />
                  ))}
                </div>

                {/* Desktop/Touch Arrows (Optional enhancement) */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
             </div>

             {/* Desktop Thumbnails */}
             <div className="hidden sm:grid grid-cols-4 gap-4">
                {galleryImages.map((img, i) => (
                  <div 
                   key={i} 
                   onClick={() => setIndex(i)}
                   className={`relative aspect-square bg-white border cursor-pointer transition-all overflow-hidden ${currentIndex === i ? 'border-slate-950 p-2' : 'border-slate-100 opacity-50 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`${product.name} variant ${i}`} fill className="object-contain p-2" />
                  </div>
                ))}
             </div>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
             <div className="space-y-4">
                <Typography variant="detail" className="text-slate-400">SKU: {product.sku}</Typography>
                <Typography variant="h1" className="text-3xl sm:text-6xl uppercase tracking-tighter leading-tight sm:leading-none">{product.name}</Typography>
                <div className="flex items-center gap-4 py-2 border-y border-slate-100">
                   <Typography variant="h3" className="text-2xl sm:text-3xl font-black">${product.price.toLocaleString()}</Typography>
                   <span className="text-[10px] sm:text-xs bg-slate-900 text-white px-3 py-1 font-bold tracking-widest uppercase">STOCK DISPONIBLE</span>
                </div>
             </div>

             <Typography variant="body" className="text-base sm:text-lg font-light leading-relaxed text-slate-600">
               Herramienta de alto rendimiento diseñada específicamente para el uso intensivo en estaciones de trabajo profesionales. Fabricada con materiales de grado industrial bajo certificación GA.
             </Typography>

             <div className="space-y-8 pt-8 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                   <Button 
                      label="Añadir al Carrito" 
                      className="flex-1 py-5 text-[11px] sm:text-xs tracking-[0.3em]" 
                      onClick={() => setIsModalOpen(true)}
                   />
                   
                   <div className="flex gap-4">
                      <button 
                        onClick={() => toggleFavorite(productForActions)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 border transition-all uppercase text-[10px] font-bold tracking-widest ${isFav ? 'bg-red-500 border-red-500 text-white' : 'border-slate-200 text-slate-900 hover:border-slate-950'}`}
                      >
                         <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                         {isFav ? 'En Favoritos' : 'Añadir a Favoritos'}
                      </button>

                      <button 
                        onClick={() => {
                          const item: CompareItem = { ...productForActions, rating: 4.8 };
                          if (isInComp) removeFromCompare(product.id);
                          else addToCompare(item);
                        }}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 border transition-all uppercase text-[10px] font-bold tracking-widest ${isInComp ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-900 hover:border-slate-950'}`}
                      >
                         <ArrowLeftRight size={16} />
                         {isInComp ? 'En Comparación' : 'Comparar'}
                      </button>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-6 pt-12">
                <div className="flex items-center gap-3">
                   <Truck size={18} className="text-slate-400" />
                   <Typography variant="small" className="text-[10px] sm:text-xs">Envío Nacional</Typography>
                </div>
                <div className="flex items-center gap-3">
                   <ShieldCheck size={18} className="text-slate-400" />
                   <Typography variant="small" className="text-[10px] sm:text-xs">Garantía Industrial</Typography>
                </div>
                <div className="flex items-center gap-3">
                   <Box size={18} className="text-slate-400" />
                   <Typography variant="small" className="text-[10px] sm:text-xs">Stock en Bodega</Typography>
                </div>
                <div className="flex items-center gap-3">
                   <RefreshCcw size={18} className="text-slate-400" />
                   <Typography variant="small" className="text-[10px] sm:text-xs">Devolución 30 Días</Typography>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Add To Cart Modal */}
      <AddToCartModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          ...product,
          vendor: 'Ladynail Shop'
        }}
      />

      <Footer />
    </main>
  );
}
