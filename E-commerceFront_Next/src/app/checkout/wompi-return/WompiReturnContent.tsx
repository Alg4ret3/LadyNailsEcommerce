'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { Typography } from '@/components/atoms/Typography';
import { medusaFetch } from '@/services/medusa/client';
import { useCart } from '@/context/CartContext';
import {
  clearPersistedWompiCheckoutCartId,
  getPersistedWompiCheckoutCartId,
  getPersistedWompiCheckoutReference,
} from '@/utils/wompiCheckout';
import { getCartIdKey } from '@/utils/cartKeys';
import { useUser } from '@/context/UserContext';

function readStoredCartId(userId: string | null): string | null {
  if (typeof window === 'undefined') return null;
  return (
    getPersistedWompiCheckoutCartId() ||
    localStorage.getItem(getCartIdKey(userId))
  );
}

export function WompiReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { user } = useUser();
  const [error, setError] = React.useState('');
  const hasRun = React.useRef(false);

  const wompiTxId = searchParams.get('id');
  const wompiRef = searchParams.get('wompi_ref') || getPersistedWompiCheckoutReference();

  React.useEffect(() => {
    if (hasRun.current) return;
    if (!wompiTxId && !wompiRef) {
      setError('No se recibieron datos de confirmación de pago.');
      return;
    }
    hasRun.current = true;

    const finalize = async () => {
      const cartId = readStoredCartId(user?.id ?? null);
      if (!cartId) {
        setError(
          'No se encontró el carrito de su compra. Si el pago fue debitado, contacte a soporte con su comprobante.'
        );
        return;
      }

      try {
        const response = await medusaFetch<{
          type: string;
          order?: { id: string };
          message?: string;
          status?: string;
        }>('/store/wompi/finalize', {
          method: 'POST',
          body: JSON.stringify({
            cart_id: cartId,
            id: wompiTxId || undefined,
            reference: wompiRef || undefined,
          }),
        });

        if (response.type === 'order' && response.order?.id) {
          clearPersistedWompiCheckoutCartId();
          clearCart();
          router.replace(`/checkout/confirmation?order_id=${response.order.id}`);
          return;
        }

        setError(response.message || 'No se pudo confirmar el pedido.');
      } catch (err: unknown) {
        console.error('Wompi finalize error:', err);
        setError(
          err instanceof Error ? err.message : 'Error al finalizar su pedido.'
        );
      }
    };

    finalize();
  }, [wompiTxId, wompiRef, user?.id, router, clearCart]);

  return (
    <main className="min-h-screen bg-white relative">
      <Navbar />
      {!error && <ProcessingOverlay />}
      {error && (
        <section className="pt-44 pb-24 px-6 max-w-2xl mx-auto text-center space-y-6">
          <Typography variant="h2" className="text-red-600 font-black uppercase">
            Error al confirmar el pedido
          </Typography>
          <Typography variant="body" className="text-slate-600">
            {error}
          </Typography>
          <button
            type="button"
            onClick={() => router.push('/checkout')}
            className="px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest"
          >
            Volver al checkout
          </button>
        </section>
      )}
      <Footer />
    </main>
  );
}
