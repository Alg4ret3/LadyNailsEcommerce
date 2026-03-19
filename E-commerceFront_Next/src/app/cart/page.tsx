'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CornerDownRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { addItemToCart, createCart } from '@/services/medusa';
import { useState } from 'react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinalizePurchase = async () => {
    if (cartItems.length === 0) return;
    
    setIsFinishing(true);
    try {
      let cartId = localStorage.getItem('medusa_cart_id');
      if (!cartId) {
        const data = await createCart();
        cartId = data.cart.id;
        localStorage.setItem('medusa_cart_id', cartId);
      }

      // Sincronizar cada item con Medusa
      // Se hace en un bucle secuencial para evitar race conditions en algunos backends, 
      // o se podría usar Promise.all si el backend de Medusa lo soporta bien sin bloqueos.
      for (const item of cartItems) {
        // En nuestra implementación item.id es el variantId del producto
        await addItemToCart(cartId!, item.id, item.quantity);
      }

      router.push('/checkout');
    } catch (error) {
      console.error("Error al sincronizar el carrito:", error);
      // Podrías añadir un toast aquí si fuera necesario
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <section className="pt-32 sm:pt-44 pb-24 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <header className="mb-12 sm:mb-20 space-y-4">
           <Typography variant="detail" className="text-slate-400">Tu Selección Profesional</Typography>
           <Typography variant="h1" className="text-5xl sm:text-7xl md:text-8xl">MI <span className="text-slate-200">CARRITO</span></Typography>
          <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 border border-slate-100 rounded-2xl w-fit">
             <div className="w-10 h-10 bg-slate-950 text-white flex items-center justify-center rounded-full font-black">{totalItems}</div>
             <Typography variant="h4" className="text-[10px] text-slate-400">ARTÍCULOS EN EL CARRITO</Typography>
          </div>
        </header>

        {cartItems.length === 0 ? (
          <div className="py-24 sm:py-40 flex flex-col items-center justify-center border-t border-slate-100 space-y-8">
             <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full text-slate-300">
                <ShoppingBag size={32} />
             </div>
             <Typography variant="body" className="text-slate-400 text-xl font-light">Tu carrito está vacío.</Typography>
             <Button label="Explorar Catálogo" href="/shop" className="bg-slate-900 text-white px-12" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20">
             {/* Cart Items */}
             <div className="lg:col-span-8">
                <div className="border-t border-slate-950">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={`${item.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="py-10 border-b border-slate-100 flex flex-col sm:flex-row gap-8 items-start sm:items-center relative group"
                      >
                         <div className="relative w-32 h-40 bg-slate-50 overflow-hidden shrink-0 rounded-lg">
                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                         </div>
                         
                         <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2 text-accent">
                                 <Typography variant="detail" className="text-[9px]">{item.vendor || 'Ladynail Shop'}</Typography>
                                 <CornerDownRight size={10} className="opacity-20" />
                                 <Typography variant="detail" className="text-[9px]">{item.category}</Typography>
                               </div>
                               <Link href={`/product/${item.slug}`}>
                                 <Typography variant="h3" className="text-xl sm:text-2xl hover:text-slate-500 transition-colors uppercase tracking-tight">{item.name}</Typography>
                               </Link>
                               {(item.size || item.color) && (
                                 <div className="flex gap-4 pt-2">
                                    {item.size && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Talla: {item.size}</span>}
                                    {item.color && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Color: {item.color}</span>}
                                 </div>
                               )}
                            </div>

                            <div className="flex items-center justify-between sm:justify-start gap-8 sm:gap-16 pt-4">
                               <div className="flex items-center border border-slate-200">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                    className="p-3 hover:bg-slate-50 transition-colors border-r border-slate-200"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-12 text-center font-black text-sm">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                    className="p-3 hover:bg-slate-50 transition-colors border-l border-slate-200"
                                  >
                                    <Plus size={14} />
                                  </button>
                               </div>

                               <div className="flex flex-col">
                                  <Typography variant="detail" className="text-[8px] text-slate-300">Precio Unitario</Typography>
                                  <Typography variant="h4" className="text-lg">${item.price.toLocaleString()}</Typography>
                                </div>
                            </div>
                         </div>

                         <div className="absolute top-10 right-0 sm:static sm:text-right flex flex-col items-end gap-4 min-w-[12rem]">
                            <button 
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                              aria-label="Eliminar producto"
                            >
                              <Trash2 size={20} />
                            </button>
                            <Typography variant="h3" className="text-2xl pt-8">${(item.price * item.quantity).toLocaleString()}</Typography>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
             </div>

             {/* Summary Side */}
             <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                <div className="bg-slate-950 p-8 sm:p-12 text-white space-y-12">
                   <div className="space-y-6">
                      <Typography variant="h3" className="text-3xl text-white">RESUMEN</Typography>
                      <div className="space-y-4 text-white/40">
                         <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                            <span className="text-sm font-black text-white">${totalAmount.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-xs font-bold uppercase tracking-widest">Logística Nacional</span>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Calculado en Checkout</span>
                         </div>
                         <div className="flex justify-between border-b border-white/10 pb-4">
                            <span className="text-xs font-bold uppercase tracking-widest">IVA (19%)</span>
                            <span className="text-sm font-black text-white">Incluido</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="flex justify-between items-end">
                         <Typography variant="detail" className="text-slate-500">Total Final</Typography>
                         <Typography variant="h2" className="text-5xl text-white">${totalAmount.toLocaleString()}</Typography>
                      </div>

                      <div className="space-y-4">
                         <Button 
                           label={isFinishing ? "Sincronizando..." : "Finalizar Compra"} 
                           onClick={handleFinalizePurchase} disabled={isFinishing || cartItems.length === 0} 
                           className="w-full py-6 !bg-white !text-slate-950 border-none hover:bg-[#22c55e] hover:text-white transition-all text-sm" 
                         />
                         <Link 
                           href="/shop" 
                           className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors py-4"
                         >
                            Volver al Catálogo <ArrowRight size={14} />
                         </Link>
                      </div>
                   </div>

                   {/* Distribution Perks */}
                   <div className="pt-12 border-t border-white/10 grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Typography variant="detail" className="text-slate-500 text-[8px]">Seguridad</Typography>
                         <Typography variant="body" className="text-[9px] text-white/60 leading-tight">Transacciones B2B <br /> protegidas con SSL.</Typography>
                      </div>
                      <div className="space-y-2">
                         <Typography variant="detail" className="text-slate-500 text-[8px]">Garantía</Typography>
                         <Typography variant="body" className="text-[9px] text-white/60 leading-tight">Respaldo oficial de las <br /> mejores marcas.</Typography>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </section>
      
      <Footer />
    </main>
  );
}
