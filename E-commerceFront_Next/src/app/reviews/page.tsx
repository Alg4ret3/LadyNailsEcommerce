'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Star, BarChart3, TrendingUp, ShieldCheck, Heart, ArrowRight, User, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { getPlatformReviews, createPlatformReview, updatePlatformReview, deletePlatformReview, getCustomerReviews, ReviewData } from '@/services/medusa/review';

const REVIEW_TAGS = ['Experiencia Web', 'Seguridad', 'Ficha Técnica', 'Mobile Friendly', 'Proceso de Compra', 'Rendimiento'];

export default function ReviewsPage() {
  const { user } = useUser();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [myReviews, setMyReviews] = useState<ReviewData[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    tag: 'Experiencia Web'
  });

  const loadReviews = useCallback(async () => {
    try {
      const response = await getPlatformReviews();
      if (response && response.reviews) {
        setReviews(response.reviews);
      }
      
      if (user?.isLoggedIn) {
        const myRes = await getCustomerReviews(user.id);
        if (myRes && myRes.reviews) {
          setMyReviews(myRes.reviews);
        }
      }
    } catch (error) {
      console.error("Error cargando reviews", error);
    }
  }, [user]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const userReviews = useMemo(() => {
    return user?.isLoggedIn ? myReviews : [];
  }, [myReviews, user]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : '5.0';
    const fiveStars = reviews.filter(r => r.rating === 5).length;
    const satisfaction = total > 0 ? Math.round((fiveStars / total) * 100) : 100;
    
    return { total, avg, satisfaction };
  }, [reviews]);

  const hasChanges = useMemo(() => {
    if (!isEditing) return true;
    const original = userReviews.find(r => r.id === editingId);
    if (!original) return true;
    return (
      formData.rating !== original.rating ||
      formData.comment.trim() !== original.content.trim()
    );
  }, [formData, isEditing, userReviews, editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.isLoggedIn || !hasChanges) return;

    try {
        if (isEditing && editingId) {
          await updatePlatformReview(editingId, {
            rating: formData.rating,
            content: formData.comment,
            customer_name: `${user.firstName} ${user.lastName || ''}`.trim(),
            customer_id: user.id
          });
        } else {
          await createPlatformReview({
              rating: formData.rating,
              content: formData.comment,
              customer_name: `${user.firstName} ${user.lastName || ''}`.trim(),
              customer_id: user.id
          });
        }

        showToast(isEditing ? '¡Reseña actualizada!' : '¡Reseña creada!', 'success');
        await loadReviews();
        resetForm();
      } catch (err: unknown) {
         const error = err as { message?: string };
         if (error.message?.includes('403') || error.message?.includes('límite máximo')) {
            showToast('Límite de 3 reseñas alcanzado.', 'error');
            return; 
         }
         showToast('Error al procesar la reseña.', 'error');
      }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePlatformReview(id);
      showToast('Reseña eliminada con éxito.', 'success');
      await loadReviews();
    } catch {
      showToast('No se pudo eliminar la reseña.', 'error');
    }
  };

  const handleEdit = (review: ReviewData) => {
    setFormData({
      rating: review.rating,
      comment: review.content,
      tag: 'Experiencia Web'
    });
    setEditingId(review.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ rating: 5, comment: '', tag: 'Experiencia Web' });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white min-h-screen selection:bg-black selection:text-white">
      <Navbar />

      <main className="pt-32 sm:pt-48 lg:pt-56">
        {/* ── Hero Section Estilizado ── */}
        <section className="px-6 max-w-7xl mx-auto mb-24 sm:mb-32">
          <div className="flex flex-col items-center text-center space-y-8 sm:space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 mt-4 sm:mt-8"
            >
              <span className="w-8 h-px bg-slate-200" />
              <span>Plataforma de Opiniones</span>
              <span className="w-8 h-px bg-slate-200" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Typography variant="h1" className="text-4xl sm:text-7xl lg:text-8xl font-light tracking-tight text-slate-900 leading-none sm:leading-[1.1]">
                Nuestra <span className="font-serif italic">comunidad</span> <br className="hidden sm:block" /> 
                <span className="font-medium">Profesional</span>
              </Typography>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg sm:text-xl font-light max-w-2xl leading-relaxed"
            >
              Voces auténticas que definen el estándar de excelencia en Lady Nails. Análisis y métricas de nuestra infraestructura digital.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-100 rounded-3xl overflow-hidden mt-12 sm:mt-20 border border-slate-100"
          >
            {[
              { label: 'OPINIONES TOTALES', value: stats.total, icon: <BarChart3 className="w-4 h-4" /> },
              { label: 'CALIFICACIÓN MEDIA', value: stats.avg, icon: <TrendingUp className="w-4 h-4" />, suffix: '/ 5.0' },
              { label: 'SATISFACCIÓN NPS', value: `${stats.satisfaction}%`, icon: <ShieldCheck className="w-4 h-4" /> }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 sm:p-12 flex flex-col items-center justify-center space-y-4 hover:bg-slate-50 transition-colors group">
                <div className="text-slate-300 group-hover:text-slate-900 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-center">
                  <p className="text-4xl sm:text-5xl font-light text-slate-900 tabular-nums">
                    {stat.value}
                    {stat.suffix && <span className="text-sm font-medium text-slate-300 ml-1">{stat.suffix}</span>}
                  </p>
                  <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 mt-2 uppercase">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Feed & Interaction ── */}
        <section className="bg-slate-50 py-24 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6">
            {!user?.isLoggedIn ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-10 sm:p-16 text-center border border-slate-200/60 shadow-sm flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white mb-6">
                  <User size={20} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-light text-slate-900 mb-3 tracking-tight">Experiencia Profesional</h2>
                <p className="text-slate-400 text-sm font-light mb-8 max-w-xs leading-relaxed">Inicia sesión para registrar tu testimonio en nuestra base de datos.</p>
                <Link 
                  href="/auth/login?redirect=/reviews"
                  className="px-8 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
                >
                  Identificarse
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {/* User Reviews List */}
                {userReviews.length > 0 && !showForm && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Tus Testimonios ({userReviews.length}/3)</h3>
                      {userReviews.length < 3 && (
                        <button 
                          onClick={() => setShowForm(true)}
                          className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-black transition-all"
                        >
                          Nueva Reseña
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {userReviews.map((review) => (
                        <motion.div 
                          key={review.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-8 rounded-xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between gap-6"
                        >
                          <div className="space-y-4">
                            <div className="flex gap-1 text-slate-900">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} strokeWidth={1} />
                              ))}
                            </div>
                            <p className="text-slate-600 font-light text-sm italic leading-relaxed">&ldquo;{review.content}&rdquo;</p>
                            <div className="flex items-center gap-3">
                              <p className="text-[9px] font-medium text-slate-300 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex sm:flex-col items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(review)}
                              className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                              title="Editar"
                            >
                              <Edit3 size={16} strokeWidth={1.5} />
                            </button>
                            <button 
                              onClick={() => handleDelete(review.id)}
                              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State / Call to Action */}
                {userReviews.length === 0 && !showForm && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-16 text-center space-y-6">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-900 mx-auto border border-slate-100">
                      <Heart size={16} strokeWidth={1.5} className="animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-light text-slate-900 tracking-tight">Registro de Voz</h2>
                      <p className="text-slate-400 text-sm font-light max-w-sm mx-auto">Comparte tu visión profesional sobre nuestra infraestructura digital.</p>
                    </div>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="bg-slate-900 text-white px-8 py-3.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                    >
                      <span>Escribir Opinión</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}

                {/* Review Form */}
                <AnimatePresence mode="wait">
                  {showForm && (
                    <motion.div 
                      key="form-container"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
                    >
                      <div className="p-10 sm:p-14">
                        <div className="flex justify-between items-center mb-12">
                          <button 
                            onClick={resetForm}
                            className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
                          >
                            <ArrowRight size={10} className="rotate-180" />
                            Cancelar
                          </button>
                          <div className="text-right">
                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-0.5">{isEditing ? 'Editando' : 'Nuevo'}</p>
                            <p className="text-[10px] font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                          </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-12">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-10">
                              <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-300">Calificación</p>
                                  <span className="text-[9px] font-medium text-slate-400 capitalize">
                                    {formData.rating === 5 ? 'Excelente' : formData.rating === 4 ? 'Muy bueno' : formData.rating === 3 ? 'Bueno' : formData.rating === 2 ? 'Regular' : 'Malo'}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map(s => (
                                    <button 
                                      key={s} 
                                      type="button" 
                                      onClick={() => setFormData({...formData, rating: s})} 
                                      className="relative transition-all"
                                    >
                                      <Star 
                                        size={24} 
                                        strokeWidth={1} 
                                        className={`transition-all duration-300 ${
                                          formData.rating >= s 
                                            ? 'fill-slate-900 text-slate-900' 
                                            : 'text-slate-200 hover:text-slate-400'
                                        }`} 
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-5">
                                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-300">Categoría</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {REVIEW_TAGS.map(t => (
                                    <button 
                                      key={t}
                                      type="button" 
                                      onClick={() => setFormData({...formData, tag: t})}
                                      className={`px-4 py-2 rounded-md text-[9px] font-bold transition-all border duration-200 ${
                                        formData.tag === t 
                                          ? 'bg-slate-900 text-white border-slate-900' 
                                          : 'bg-transparent text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600'
                                      }`}
                                    >
                                      {t}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-300">Testimonio</p>
                                <span className="text-[8px] font-medium text-slate-300 uppercase tracking-tighter">{formData.comment.length} / 500</span>
                              </div>
                              <div className="relative">
                                <textarea 
                                  value={formData.comment}
                                  maxLength={500}
                                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                  className="w-full bg-slate-50 border border-transparent rounded-xl p-6 text-sm font-light text-slate-600 min-h-[160px] focus:bg-white focus:border-slate-100 transition-all duration-300 placeholder:text-slate-300 resize-none outline-none"
                                  placeholder="..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
                            <button 
                              disabled={formData.comment.trim().length < 2}
                              className={`px-12 py-3.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                                formData.comment.trim().length >= 2
                                  ? 'bg-slate-900 text-white hover:bg-black' 
                                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                              }`}
                            >
                              <span className="flex items-center justify-center gap-2">
                                {isEditing ? 'Guardar Cambios' : 'Publicar'}
                              </span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
