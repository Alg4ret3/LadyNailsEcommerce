'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReviews, createReview, type ReviewData, getPlatformReviews } from '@/services/medusa/review';

interface ProductReviewsProps {
  productId: string;
  initialReviews?: ReviewData[];
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, initialReviews }) => {
  const { user } = useUser();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewsList, setReviewsList] = useState<ReviewData[]>(initialReviews || []);
  const [loadingReviews, setLoadingReviews] = useState(!initialReviews);
  const [userReviewsCount, setUserReviewsCount] = useState<number>(0);

  useEffect(() => {
    const fetchGlobalReviewsCount = async () => {
      if (!user?.isLoggedIn) return;
      try {
        const data = await getPlatformReviews();
        if (data && data.reviews) {
          const userCount = data.reviews.filter((r: any) => r.customer_id === user.id).length;
          setUserReviewsCount(userCount);
        }
      } catch (err) {
        console.error('Error fetching global reviews count:', err);
      }
    };
    fetchGlobalReviewsCount();
  }, [user?.isLoggedIn, user?.id]);

  useEffect(() => {
    if (!initialReviews) {
      const fetchReviews = async () => {
        try {
          const data = await getReviews(productId);
          setReviewsList(data?.reviews || []);
        } catch (err) {
          console.error('Error fetching reviews:', err);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [productId, initialReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setError(null);
    
    try {
      await createReview(productId, { 
        rating, 
        content: review, 
        customer_name: user?.name || 'Anónimo',
        customer_id: user?.id
      });
      setSubmitted(true);
      
      // Refresh reviews list
      const updatedData = await getReviews(productId);
      setReviewsList(updatedData?.reviews || []);

      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setReview('');
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      // Check for 403 or the limit message since status might be missing from Error object
      if (err.message?.includes('403') || err.message?.includes('límite máximo')) {
        setError('Has alcanzado el límite máximo de 3 reseñas por usuario.');
      } else {
        setError('Hubo un error al enviar tu reseña. Por favor intenta de nuevo.');
      }
    }
  };

  return (
    <div id="reviews" className="mt-16 pt-16 border-t border-slate-200">
      <Typography variant="h3" className="text-2xl font-bold mb-6">Valoraciones del Producto</Typography>

      {!user?.isLoggedIn ? (
        <div className="bg-slate-50 border border-slate-100 p-8 text-center rounded-xl space-y-4">
          <Typography variant="body" className="text-slate-600">
            Debes iniciar sesión para poder calificar este producto y dejar una reseña.
          </Typography>
          <div>
            <Button
              label="Iniciar Sesión"
              href={`/auth/login?redirect=${encodeURIComponent('/product/' + productId + '#reviews')}`}
              className="bg-slate-900 text-white mt-2 px-8"
            />
          </div>
        </div>
      ) : userReviewsCount >= 3 ? (
        <div className="bg-slate-50 border border-slate-200 p-8 text-center rounded-xl space-y-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border border-slate-100">
            <Star size={24} className="text-slate-400" fill="currentColor" />
          </div>
          <Typography variant="h4" className="text-lg font-bold text-slate-900 uppercase tracking-tighter">Límite de Reseñas Alcanzado</Typography>
          <Typography variant="body" className="text-slate-500 text-xs sm:text-sm uppercase tracking-widest font-medium">
             Has registrado {userReviewsCount}/3 reseñas globales en la plataforma. ¡Gracias por tu participación!
          </Typography>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-xl">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} fill="currentColor" />
              </div>
              <Typography variant="h4" className="text-xl font-bold text-slate-900 mb-2">¡Gracias por tu reseña!</Typography>
              <Typography variant="body" className="text-slate-500">Tu opinión nos ayuda a mejorar.</Typography>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Typography variant="detail" className="text-slate-700 font-bold mb-2 block">
                  Tu calificación *
                </Typography>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-colors focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Typography variant="detail" className="text-slate-700 font-bold mb-2 block">
                  Tu reseña (opcional)
                </Typography>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 bg-red-50 border border-red-100 p-4 rounded-lg flex items-center gap-3 overflow-hidden"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                      <Typography variant="body" className="text-red-600 text-xs font-bold uppercase tracking-widest">
                        {error}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>

                <textarea
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Escribe aquí tu opinión sobre este producto..."
                  className={`w-full border rounded-lg p-4 focus:outline-none min-h-[120px] resize-y transition-all ${
                    error ? 'border-red-200 focus:border-red-900' : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
              </div>

              <Button
                label="Enviar Reseña"
                type="submit"
                disabled={rating === 0}
                className="w-full sm:w-auto bg-slate-900 text-white px-8"
              />
            </form>
          )}
        </div>
      )}
      <div className="space-y-6 mt-12">
        <Typography variant="h4" className="text-xl font-bold">
          {reviewsList.length} {reviewsList.length === 1 ? 'Reseña' : 'Reseñas'}
        </Typography>

        {loadingReviews ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviewsList.length === 0 ? (
          <Typography variant="body" className="text-slate-500 italic">
            Aún no hay reseñas para este producto. ¡Sé el primero en calificar!
          </Typography>
        ) : (
          <div className="grid gap-6">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="detail" className="text-slate-900 font-bold block mb-1">
                      {rev.customer_name || 'Anónimo'}
                    </Typography>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}
                        />
                      ))}
                    </div>
                  </div>
                  {rev.created_at && (
                    <Typography variant="detail" className="text-slate-400 text-[10px] uppercase tracking-wider">
                      {new Date(rev.created_at).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Typography>
                  )}
                </div>
                {rev.content && (
                  <Typography variant="body" className="text-slate-700 leading-relaxed uppercase text-xs">
                    {rev.content}
                  </Typography>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
