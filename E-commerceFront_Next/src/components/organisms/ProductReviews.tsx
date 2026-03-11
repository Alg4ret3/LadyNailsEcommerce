'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Star } from 'lucide-react';
import { getReviews, createReview, type ReviewData } from '@/services/medusa/review';

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
  const [reviewsList, setReviewsList] = useState<ReviewData[]>(initialReviews || []);
  const [loadingReviews, setLoadingReviews] = useState(!initialReviews);

  useEffect(() => {
    if (!initialReviews) {
      const fetchReviews = async () => {
        try {
          const data = await getReviews(productId);
          setReviewsList(data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
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
    
    try {
      await createReview(productId, { 
        rating, 
        content: review, 
        customer_name: user?.name || 'Anónimo' 
      });
      setSubmitted(true);
      
      // Refresh reviews list
      const updatedReviews = await getReviews(productId);
      setReviewsList(updatedReviews);

      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setReview('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-slate-200">
      <Typography variant="h3" className="text-2xl font-bold mb-6">Valoraciones del Producto</Typography>

      {!user?.isLoggedIn ? (
        <div className="bg-slate-50 border border-slate-100 p-8 text-center rounded-xl space-y-4">
          <Typography variant="body" className="text-slate-600">
            Debes iniciar sesión para poder calificar este producto y dejar una reseña.
          </Typography>
          <div>
            <Button
              label="Iniciar Sesión"
              href="/auth/login"
              className="bg-slate-900 text-white mt-2 px-8"
            />
          </div>
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
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Escribe aquí tu opinión sobre este producto..."
                  className="w-full border border-slate-300 rounded-lg p-4 focus:outline-none focus:border-slate-900 min-h-[120px] resize-y"
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
