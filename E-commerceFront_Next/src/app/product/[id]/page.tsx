'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { useParams } from 'next/navigation';
import { AddToCartModal } from '@/components/organisms/AddToCartModal';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare, type CompareItem } from '@/context/CompareContext';
import { Heart, ArrowLeftRight } from '@/components/icons';
import { getProductById, type MedusaProduct } from '@/services/medusa';
import { ProductReviews } from '@/components/organisms/ProductReviews';


export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<MedusaProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { toggleFavorite, isFavorite } = useWishlist();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(productId);
        console.log(data);
        setProduct(data);
      } catch (error) {
        console.error("Error cargando producto", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="pt-44 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    </main>
  );

  if (!product) return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="pt-44 text-center">
        <Typography variant="h3">Producto no encontrado</Typography>
      </div>
    </main>
  );

  // Precio desde la primera variante
  const price = product.variants?.[0]?.prices?.[0].amount ?? 0;
  const formattedPrice = price.toLocaleString('es-CO');

  // Imágenes: usa images[] o thumbnail como fallback
  const galleryImages = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : product.thumbnail
    ? [product.thumbnail]
    : ['/placeholder.png'];

  const category = product.categories?.[0]?.name ?? '';
  const sku = product.variants?.[0]?.id ?? product.id;

  const isFav = isFavorite(product.id);
  const isInComp = isInCompare(product.id);

  const productForActions = {
    id: product.id,
    name: product.title,
    price: price,
    image: product.thumbnail ?? galleryImages[0],
    category,
    categories: product.categories ?? [],
    slug: product.handle,
    vendor: product.collection?.title ?? 'Ladynail Shop',
    description: product.description ?? undefined,
    tags: product.tags?.map(t => t.value) ?? [],
  };

  const nextImage = () => setCurrentIndex(prev => (prev + 1) % galleryImages.length);
  const prevImage = () => setCurrentIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);


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
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 50) prevImage();
                    else if (info.offset.x < -50) nextImage();
                  }}
                >
                  <Image
                    src={galleryImages[currentIndex]}
                    alt={product.title}
                    fill
                    className="object-contain p-4 sm:p-8 select-none pointer-events-none"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Dots mobile */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 lg:hidden">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${currentIndex === i ? 'w-6 bg-slate-900' : 'w-2 bg-slate-300'}`}
                    />
                  ))}
                </div>
              )}

              {/* Arrows desktop */}
              {galleryImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex hover:bg-white">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex hover:bg-white">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails desktop */}
            {galleryImages.length > 1 && (
              <div className="hidden sm:grid grid-cols-4 gap-4">
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`relative aspect-square bg-white border cursor-pointer transition-all overflow-hidden ${currentIndex === i ? 'border-slate-950 p-2' : 'border-slate-100 opacity-50 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`${product.title} ${i}`} fill className="object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              {category && (
                <Typography variant="detail" className="text-slate-400 uppercase tracking-widest text-[9px]">
                  {category}
                </Typography>
              )}
              <Typography variant="h1" className="text-3xl sm:text-6xl uppercase tracking-tighter leading-tight sm:leading-none">
                {product.title}
              </Typography>
              <div className="flex items-center gap-4 py-2 border-y border-slate-100">
                <Typography variant="h3" className="text-2xl sm:text-3xl font-black">
                  ${formattedPrice}
                </Typography>
                <span className="text-[10px] sm:text-xs bg-slate-900 text-white px-3 py-1 font-bold tracking-widest uppercase">
                  STOCK DISPONIBLE
                </span>
              </div>
              <Typography variant="detail" className="text-slate-400 text-[10px]">
                SKU: {sku}
              </Typography>
            </div>

            {product.description && (
              <Typography variant="body" className="text-base sm:text-lg font-light leading-relaxed text-slate-600">
                {product.description}
              </Typography>
            )}

            <div className="space-y-8 pt-8 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button
                  label="Añadir al Carrito"
                  className="flex-1 py-5 text-[11px] sm:text-xs tracking-[0.3em]"
                  onClick={() => setIsModalOpen(true)}
                />

                <div className="flex gap-2 sm:gap-4">
                  <button
                    onClick={() => toggleFavorite({ ...productForActions })}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-2 sm:px-8 py-5 border transition-all uppercase text-[9px] sm:text-[10px] font-bold tracking-widest ${isFav ? 'bg-red-500 border-red-500 text-white' : 'border-slate-200 text-slate-900 hover:border-slate-950'}`}
                  >
                    <Heart size={16} fill={isFav ? 'currentColor' : 'none'} className="hidden min-[380px]:block sm:block" />
                    {isFav ? 'En Favoritos' : 'Favoritos'}
                  </button>

                  <button
                    onClick={() => {
                      const item: CompareItem = { ...productForActions, rating: 0 };
                      if (isInComp) removeFromCompare(product.id);
                      else addToCompare(item);
                    }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-2 sm:px-8 py-5 border transition-all uppercase text-[9px] sm:text-[10px] font-bold tracking-widest ${isInComp ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-900 hover:border-slate-950'}`}
                  >
                    <ArrowLeftRight size={16} className="hidden min-[380px]:block sm:block" />
                    Comparar
                  </button>
                </div>
              </div>
            </div>

            {/* Tags / Ficha Técnica */}
            {product.tags && product.tags.length > 0 && (() => {
              const specTags = product.tags!.filter(t => t.value.includes(':'));
              const otherTags = product.tags!.filter(t => !t.value.includes(':'));
              return (
                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <Typography variant="detail" className="text-slate-400 uppercase tracking-widest text-[9px] block">
                    Ficha Técnica
                  </Typography>
                  {specTags.length > 0 && (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                      {specTags.map(tag => {
                        const colonIdx = tag.value.indexOf(':');
                        const key = tag.value.slice(0, colonIdx).trim();
                        const val = tag.value.slice(colonIdx + 1).trim();
                        return (
                          <div key={tag.id} className="flex items-center justify-between px-4 py-2.5 text-xs">
                            <span className="text-slate-400 font-bold uppercase tracking-widest capitalize">{key}</span>
                            <span className="text-slate-900 font-semibold text-right">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {otherTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {otherTags.map(tag => (
                        <span key={tag.id} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {tag.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        
        {/* Product Reviews Section */}
        <ProductReviews productId={product.id} />
      </section>

      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={productForActions}
      />

      <Footer />
    </main>
  );
}
