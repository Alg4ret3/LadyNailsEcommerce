'use client';

import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CornerDownRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, commitQuantityUpdate, totalAmount, totalItems, medusaCartId, ensureCart, stockError, clearStockError, pendingQuantityUpdates, updatingItems } = useCart();
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);
  const [showMinWarning, setShowMinWarning] = useState(false);

  const handleFinalizePurchase = async () => {
    if (cartItems.length === 0) return;

    if (totalAmount < 200000) {
      setShowMinWarning(true);
      setTimeout(() => setShowMinWarning(false), 3500);
      return;
    }
    
    setIsFinishing(true);
    try {
      await ensureCart();
      router.push('/checkout');
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
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
                                 <Typography variant="h3" className="text-xl sm:text-2xl hover:text-gray-300 transition-colors uppercase tracking-tight">{item.name}</Typography>
                               </Link>
                               {(item.size || item.color) && (
                                 <div className="flex gap-4 pt-2">
                                    {item.size && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Talla: {item.size}</span>}
                                    {item.color && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Color: {item.color}</span>}
                                 </div>
                               )}
                            </div>

                            <div className="relative">
                              {stockError && stockError.id === item.id && (
                                <div className="absolute -top-1 left-0 w-full z-10 text-red-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 py-1 bg-white">
                                  <span className="shrink-0 text-xs">⚠</span> {stockError.message}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between sm:justify-start gap-8 sm:gap-16 pt-2">
                                <div className="flex items-center border border-slate-200 relative">
                                  <button 
                                    onClick={() => {
                                      updateQuantity(item.id, item.quantity - 1, item.size);
                                      commitQuantityUpdate(item.id, item.quantity - 1);
                                    }}
                                    disabled={updatingItems.get(item.id)}
                                    className="p-3 hover:bg-slate-50 transition-colors border-r border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <div className="w-12 flex items-center justify-center h-[42px]">
                                    {updatingItems.get(item.id) ? (
                                      <Loader2 size={18} className="animate-spin text-slate-400" />
                                    ) : (
                                      <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => {
                                          const value = parseInt(e.target.value, 10);
                                          if (value > 0) {
                                            updateQuantity(item.id, value, item.size);
                                          }
                                        }}
                                        onBlur={() => commitQuantityUpdate(item.id, item.quantity)}
                                        className="w-12 text-center font-black text-sm bg-transparent focus:outline-none"
                                        min="1"
                                      />
                                    )}
                                  </div>
                                  <button 
                                    onClick={() => {
                                      updateQuantity(item.id, item.quantity + 1, item.size);
                                      commitQuantityUpdate(item.id, item.quantity + 1);
                                    }}
                                    disabled={updatingItems.get(item.id)}
                                    className="p-3 hover:bg-slate-50 transition-colors border-l border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="bg-black p-8 lg:p-10 shadow-sm relative overflow-hidden group border border-white/5">
                   <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                     <Typography variant="h3" className="text-xs font-black uppercase tracking-[0.2em] text-white">
                       Resumen de Compra
                     </Typography>
                   </div>

                   <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-gray-300 uppercase tracking-widest text-[9px] font-black">Subtotal</span>
                        <span className="font-black text-white">${totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-gray-300 uppercase tracking-widest text-[9px] font-black">Logística Nacional</span>
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Calculado al Final</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-medium text-gray-300">
                        <span className="uppercase tracking-widest font-black">Impuestos (IVA 19%)</span>
                        <span className="font-bold text-gray-300">Incluido en Precio</span>
                      </div>

                      <div className="pt-6 mt-4 border-t border-white/10">
                        <div className="flex flex-col items-end gap-1.5 mb-10">
                          <Typography variant="detail" className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em] block">Total a Pagar</Typography>
                          <Typography variant="h3" className="text-4xl lg:text-5xl font-black leading-none text-white">${totalAmount.toLocaleString()}</Typography>
                        </div>

                        <div className="space-y-3 w-full">
                           <Button 
                             label={isFinishing ? "Sincronizando..." : "Realizar Pago"} 
                             onClick={handleFinalizePurchase} disabled={isFinishing || cartItems.length === 0} 
                             className="w-full py-5 !bg-white !text-slate-950 border-none hover:bg-neutral-200 transition-all text-[10px] font-black uppercase tracking-[0.2em]" 
                           />

                           {/* Minimum purchase warning banner */}
                           <AnimatePresence>
                             {showMinWarning && (
                               <motion.div
                                 initial={{ opacity: 0, y: -8 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -8 }}
                                 className="w-full bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest text-center px-4 py-3 rounded-xl"
                               >
                                 ⚠ No puedes hacer compras menores a $200.000 COP
                               </motion.div>
                             )}
                           </AnimatePresence>

                           <Link 
                             href="/shop" 
                             className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors py-4 w-full"
                           >
                              Volver al Catálogo <ArrowRight size={12} />
                           </Link>
                        </div>
                      </div>
                   </div>

                   {/* Distribution Perks */}
                   <div className="pt-8 mt-6 border-t border-white/10 grid grid-cols-2 gap-6 relative z-10">
                      <div className="space-y-1.5">
                         <Typography variant="detail" className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Seguridad</Typography>
                         <Typography variant="body" className="text-[9px] text-white/50 leading-relaxed font-medium tracking-wide">Transacciones garantizadas con SSL 256-bit.</Typography>
                      </div>
                      <div className="space-y-1.5">
                         <Typography variant="detail" className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Garantía</Typography>
                         <Typography variant="body" className="text-[9px] text-white/50 leading-relaxed font-medium tracking-wide">Distribuidores oficiales autorizados.</Typography>
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
