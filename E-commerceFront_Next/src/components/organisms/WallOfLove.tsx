'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Star, Quote, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { useUser } from '@/context/UserContext';
import { getPlatformReviews, ReviewData } from '@/services/medusa/review';
import Link from 'next/link';
import { ROUTES } from '@/constants';

// ─── Animations ─────────────────────────────────────────────────────────────

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const },
  viewport: { once: true }
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.15 }
  }
};

/**
 * WallOfLove: Independent component for the Home page that displays platform reviews
 * exclusively from our "BD" (stored in localStorage).
 */
export const WallOfLove: React.FC = () => {
  const { user } = useUser();
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getPlatformReviews();
        if (response && response.reviews) {
          setReviews(response.reviews);
        }
      } catch (error) {
        console.error("Error fetching platform reviews:", error);
      }
    };
    
    fetchReviews();
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '5.0';
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 overflow-hidden" id="wall-of-love">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Statistics Header */}
        <div className="flex flex-col md:flex-row justify-between items-center sm:items-end gap-10 mb-20 px-2 sm:px-4 text-center sm:text-left">
           <div className="space-y-4 max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Nuestra Comunidad Profesional</span>
              <Typography variant="h2" className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic text-neutral-950 leading-tight">
                Voces de nuestros <br/> profesionales Lady Nails
              </Typography>
              <p className="text-xs sm:text-sm font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                Lo que dicen quienes ya confían en nuestra infraestructura digital para abastecer sus salones.
              </p>
           </div>
           
           <div className="flex items-center gap-4 sm:gap-6 bg-white border border-neutral-100 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-4xl shadow-2xl shadow-black/5">
              <div className="flex gap-1 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                {[1, 2, 3, 4, 5].map(s => (
                   <Star 
                     key={s} 
                     size={16} 
                     fill={s <= Math.floor(Number(averageRating)) ? "currentColor" : "none"} 
                     className={s <= Math.floor(Number(averageRating)) ? "" : "text-neutral-100"}
                   />
                ))}
              </div>
              <div className="h-8 w-px bg-neutral-100" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black italic text-neutral-950 leading-none">{averageRating}</span>
                <span className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mt-1">PROMEDIO GLOBAL</span>
              </div>
           </div>
        </div>

        {/* Testimonials Grid (Wall of Love) */}
        {reviews.length === 0 ? (
          <div className="text-center py-24 rounded-4xl border border-dashed border-neutral-200">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-200 shadow-sm border border-neutral-100">
                <Quote size={24} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300 max-w-xs mx-auto">Aún no hay testimonios. <br/>¡Sé el primero en calificar!</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              variants={stagger}
              initial="animate"
              whileInView="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {reviews.map((review) => {
                const isOwner = user?.isLoggedIn && review.customer_id === user.id;
                
                return (
                  <motion.div 
                    layout
                    key={review.id}
                    {...fadeInUp}
                    exit={{ opacity: 0, scale: 0.8, y: 30 }}
                    className={`bg-white rounded-4xl p-8 sm:p-10 border border-neutral-100 shadow-xl shadow-black/5 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between ${isOwner ? 'ring-1 ring-accent/30' : ''}`}
                  >
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 text-neutral-950 transform -rotate-12 pointer-events-none">
                      <Quote size={120} />
                    </div>
                    
                    <div className="space-y-6 relative z-10 flex-1">
                      <div className="flex justify-between items-start">
                         <div className="flex gap-1 text-amber-400">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <Star 
                               key={i} 
                               size={14} 
                               fill={i < review.rating ? "currentColor" : "none" } 
                               className={i < review.rating ? "drop-shadow-[0_0_5px_rgba(251,191,36,0.2)]" : "text-neutral-100"}
                             />
                           ))}
                         </div>
                         <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                           isOwner ? 'text-accent bg-accent/5 border-accent/10' : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                         }`}>
                           {isOwner && <span className="inline-block mr-1">●</span>} {/* backend review default feature to web */} Experiencia Web
                         </span>
                      </div>

                      <Typography variant="body" className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-semibold italic">
                        “{review.content}”
                      </Typography>
                    </div>

                    <div className="mt-8 pt-8 border-t border-neutral-100 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-950 flex items-center justify-center text-white font-black italic border border-neutral-900 shadow-lg shadow-neutral-200">
                          {(review.customer_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <Typography variant="h4" className="text-[10px] sm:text-xs font-black uppercase text-neutral-950 leading-none mb-1 truncate">
                            {review.customer_name || 'Usuario'}
                          </Typography>
                          <p className="text-[8px] sm:text-[9px] font-bold text-neutral-400 tracking-widest uppercase truncate">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {isOwner && (
                        <div className="flex gap-2">
                           <Link 
                             href={ROUTES.reviews}
                             className="p-2 sm:p-2.5 bg-neutral-50 rounded-full text-neutral-400 hover:text-accent hover:bg-accent/10 transition-all shadow-sm"
                             title="Gestionar mi reseña"
                           >
                             <Edit2 size={12} className="sm:w-3.5 sm:h-3.5" />
                           </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </section>
  );
};
