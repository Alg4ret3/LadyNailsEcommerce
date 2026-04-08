'use client';

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Star, Trash2, LogIn, Award, BarChart3, TrendingUp, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { getPlatformReviews, createPlatformReview, ReviewData } from '@/services/medusa/review';

const REVIEW_TAGS = ['Experiencia Web', 'Seguridad', 'Ficha Técnica', 'Mobile Friendly', 'Proceso de Compra', 'Rendimiento'];

export default function ReviewsPage() {
  const { user } = useUser();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false); // Nuevo estado de visibilidad
  
  // Form State
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    tag: 'Experiencia Web'
  });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await getPlatformReviews();
        if (response && response.reviews) {
          setReviews(response.reviews);
        }
      } catch (error) {
        console.error("Error cargando reviews", error);
      }
    };
    loadReviews();
  }, []);

  const userReviews = useMemo(() => {
    return user?.isLoggedIn ? reviews.filter(r => r.customer_id === user.id) : [];
  }, [reviews, user]);

  const userReview = userReviews.length > 0 ? userReviews[0] : null;

  useEffect(() => {
    if (userReview && !isEditing) {
      setFormData({
        rating: userReview.rating,
        comment: userReview.content,
        tag: 'Experiencia Web' 
      });
    }
  }, [userReview, isEditing]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : '5.0';
    const fiveStars = reviews.filter(r => r.rating === 5).length;
    const satisfaction = total > 0 ? Math.round((fiveStars / total) * 100) : 100;
    
    return { total, avg, satisfaction };
  }, [reviews]);

  const hasChanges = useMemo(() => {
    if (userReviews.length === 0) {
      return true;
    }
    return (
      formData.rating !== userReview?.rating ||
      formData.comment.trim() !== (userReview?.content || '').trim()
    );
  }, [formData, userReviews, userReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.isLoggedIn || !hasChanges) return;

    try {
        await createPlatformReview({
            rating: formData.rating,
            content: formData.comment,
            customer_name: `${user.firstName} ${user.lastName || ''}`.trim(),
            customer_id: user.id
        });

        if (userReviews.length > 0) {
             showToast('¡Reseña adicional enviada!', 'success');
        } else {
             showToast('¡Reseña creada con éxito!', 'success');
        }

        const response = await getPlatformReviews();
        if (response && response.reviews) {
          setReviews(response.reviews);
        }
        setIsEditing(false);
        setShowForm(false);
    } catch (err: any) {
        console.error("Error guardando review", err);
        // Checking message since status might be missing from Error object in medusaFetch
        if (err.message?.includes('403') || err.message?.includes('límite máximo')) {
          showToast('Has alcanzado el límite máximo de 3 reseñas por usuario.', 'error');
        } else {
          showToast('Hubo un error al guardar tu reseña', 'error');
        }
    }
  };

  const handleDelete = () => {
    showToast('La eliminación no está disponible actualmente.', 'error');
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <Navbar />

      <main className="pt-24 sm:pt-32 pb-24">
        {/* ── Dashboard Estadístico Avanzado ── */}
        <section className="px-6 py-16 sm:py-24 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
          
          <div className="max-w-[1400px] mx-auto relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-center sm:items-end gap-10 mb-20 text-center sm:text-left">
                <div className="space-y-6">
                   <div className="flex items-center gap-4 justify-center sm:justify-start">
                      <span className="w-12 h-px bg-white/20" />
                      <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white">Auditoría Global de Plataforma</span>
                   </div>
                   <Typography variant="h1" className="text-4xl sm:text-7xl font-black uppercase tracking-tighter italic text-white leading-tight">
                      Métricas de <br/> <span className="text-white underline decoration-white/20 underline-offset-12">Excelencia</span>
                   </Typography>
                   <p className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest max-w-xl">
                      Análisis dinámico de la percepción profesional sobre nuestra infraestructura digital.
                   </p>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-4 p-8 bg-white/5 border border-white/10 rounded-4xl backdrop-blur-xl">
                   <div className="flex gap-1.5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                   </div>
                   <div className="text-right">
                      <p className="text-4xl font-black italic text-white leading-none mb-1">{stats.avg}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">PROMEDIO DE CALIDAD WEB</p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 border border-white/10 p-10 rounded-4xl backdrop-blur-sm group hover:border-white/20 transition-all relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-30 text-white group-hover:scale-110 transition-transform group-hover:opacity-100 transition-opacity"><BarChart3 size={40}/></div>
                   <Typography variant="h2" className="text-5xl font-black text-white italic leading-none mb-4">{stats.total}</Typography>
                   <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white">TESTIMONIOS</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Base de datos autenticada</p>
                   </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-10 rounded-4xl backdrop-blur-sm group hover:border-white/20 transition-all relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-30 text-white group-hover:scale-110 transition-transform group-hover:opacity-100 transition-opacity"><TrendingUp size={40}/></div>
                   <Typography variant="h2" className="text-5xl font-black text-white italic leading-none mb-4">{stats.satisfaction}%</Typography>
                   <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white">NPS POSITIVO</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Satisfacción del Profesional</p>
                   </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-10 rounded-4xl backdrop-blur-sm group hover:border-white/20 transition-all relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-30 text-white group-hover:scale-110 transition-transform group-hover:opacity-100 transition-opacity"><ShieldCheck size={40}/></div>
                   <Typography variant="h2" className="text-5xl font-black text-white italic leading-none mb-4">100%</Typography>
                   <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white">VERIFICADO</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Feedback real de personas profesionales</p>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* ── Centro de Gestión (Submit/Login) ── */}
        <section className="max-w-[1000px] mx-auto px-6 -mt-16 relative z-20">
          {!user?.isLoggedIn ? (
            <div className="bg-white rounded-4xl p-10 sm:p-20 shadow-2xl shadow-slate-200 text-center border border-slate-100 flex flex-col items-center space-y-10">
               <div className="w-24 h-24 bg-slate-950 rounded-full flex items-center justify-center text-white shadow-2xl relative">
                  <LogIn size={36} />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full border-4 border-white flex items-center justify-center text-white"><Award size={16}/></div>
               </div>
               <div className="space-y-4">
                  <Typography variant="h2" className="text-3xl font-black uppercase italic text-slate-950 tracking-tighter">¿Eres un profesional Lady Nails?</Typography>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
                     Para registrar tu testimonio en nuestra base de datos pública, debes validar tu perfil profesional.
                  </p>
               </div>
               <Link 
                 href="/auth/login?redirect=/reviews"
                 className="inline-flex items-center gap-6 px-16 py-7 bg-slate-950 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.5em] hover:bg-accent transition-all shadow-xl shadow-slate-300 active:scale-95"
               >
                 INICIAR SESIÓN
               </Link>
            </div>
          ) : (
            <div className="bg-white rounded-4xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
               <AnimatePresence mode="wait">
                  {!showForm ? (
                    <motion.div 
                      key="motivation"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="p-10 sm:p-20 text-center space-y-10"
                    >
                       <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center text-accent mx-auto mb-4 border border-accent/10">
                          <Heart size={32} fill="currentColor" className="animate-pulse" />
                       </div>
                       <div className="space-y-4">
                          <Typography variant="h2" className="text-3xl sm:text-4xl font-black uppercase italic text-slate-950 tracking-tighter leading-tight">
                             {userReviews.length >= 3 
                               ? 'Has completado tus testimonios' 
                               : userReviews.length > 0 
                                 ? 'Tu voz ya resuena en nuestro muro' 
                                 : 'Tú eres el corazón de nuestra plataforma'}
                          </Typography>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed">
                             {userReviews.length >= 3 
                               ? `Has alcanzado el límite máximo de 3 reseñas permitidas (${userReviews.length}/3). ¡Gracias por tu participación activa!`
                               : userReviews.length > 0 
                                 ? `Llevas ${userReviews.length} de 3 reseñas permitidas. ¿Quieres añadir otro testimonio profesional?`
                                 : 'Nuestra comunidad profesional se construye sobre experiencias reales. Ayúdanos a inspirar a otros compartiendo tu visión.'}
                          </p>
                       </div>
                       
                       <div className="flex flex-col items-center gap-4">
                          {userReviews.length < 3 ? (
                            <button 
                              onClick={() => setShowForm(true)}
                              className="flex items-center gap-4 px-8 py-4 sm:px-16 sm:py-7 bg-slate-950 text-white rounded-2xl text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] hover:bg-accent transition-all shadow-xl shadow-slate-300 group mx-auto"
                            >
                              {userReviews.length > 0 ? 'AÑADIR OTRA' : 'DAR OPINIÓN'}
                              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                          ) : (
                            <div className="px-8 py-4 bg-slate-100 text-slate-400 rounded-2xl text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] border border-slate-200 opacity-60">
                               Límite alcanzado
                            </div>
                          )}
                          {userReviews.length > 0 && (
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Tienes {userReviews.length}/3 reseñas registradas</p>
                          )}
                       </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-10 sm:p-16"
                    >
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-slate-50 pb-12">
                          <div className="space-y-2">
                             <div className="flex items-center gap-3 text-slate-400 mb-2 cursor-pointer hover:text-slate-950 transition-colors" onClick={() => setShowForm(false)}>
                                <ArrowRight size={14} className="rotate-180" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Volver</span>
                             </div>
                             <Typography variant="h3" className="text-3xl font-black uppercase italic text-slate-950 tracking-tighter">
                                {userReview ? 'Actualiza tu experiencia' : 'Registra tu voz'}
                             </Typography>
                             <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[11px] font-black uppercase text-accent tracking-widest">PERFIL VALIDADO: {user.firstName} {user.lastName}</p>
                             </div>
                          </div>
                          {userReview && (
                             <button 
                               onClick={handleDelete}
                               className="flex items-center gap-3 px-6 py-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 group"
                             >
                                <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> ELIMINAR AHORA
                             </button>
                          )}
                       </div>

                       <form onSubmit={handleSubmit} className="space-y-12">
                          <div className="space-y-8">
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Calificación de la Plataforma</p>
                                <div className="flex gap-4">
                                   {[1, 2, 3, 4, 5].map(s => (
                                      <button key={s} type="button" onClick={() => setFormData({...formData, rating: s})} className="transition-all hover:scale-125 active:scale-90">
                                         <Star size={40} className={`${formData.rating >= s ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'text-slate-100'}`} />
                                      </button>
                                   ))}
                                </div>
                             </div>
                             
                             <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">¿Qué área deseas destacar hoy?</p>
                                <div className="flex flex-wrap gap-2.5">
                                   {REVIEW_TAGS.map(t => (
                                      <button 
                                        key={t}
                                        type="button" 
                                        onClick={() => setFormData({...formData, tag: t})}
                                        className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                          formData.tag === t ? 'bg-slate-950 text-white border-slate-950 shadow-lg' : 'bg-white text-slate-400 border-slate-50 hover:border-slate-200'
                                        }`}
                                      >
                                         {t}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="space-y-6">
                             <textarea 
                                value={formData.comment}
                                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-4xl p-10 text-sm font-semibold italic text-slate-700 min-h-[200px] focus:outline-none focus:border-accent/30 transition-all shadow-inner"
                                placeholder="Comparte tu visión sobre la plataforma... (Opcional)"
                             />
                             
                     <button 
                       disabled={!hasChanges}
                       className={`w-full py-4 sm:py-7 rounded-2xl text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] transition-all shadow-xl ${
                         hasChanges 
                           ? 'bg-slate-950 text-white hover:bg-accent hover:shadow-accent/20 cursor-pointer' 
                           : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                       }`}
                     >
                        {userReview ? 'ACTUALIZAR AHORA' : 'PUBLICAR AHORA'}
                     </button>
                             
                             {!hasChanges && userReview && (
                                <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">No se han detectado cambios en tu reseña</p>
                             )}
                          </div>
                       </form>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
