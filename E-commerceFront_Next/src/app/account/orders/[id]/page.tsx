'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Package, Truck, Clock, ArrowLeft, MapPin, CreditCard, ExternalLink, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { getOrder } from '@/services/medusa/order';
import Image from 'next/image';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface TrackingLink {
  url?: string;
  tracking_url?: string;
}

interface Label {
  tracking_url?: string;
}

interface Fulfillment {
  id: string;
  tracking_numbers?: string[];
  tracking_links?: TrackingLink[];
  labels?: Label[] | { tracking_url?: string };
  label_url?: string;
  shipped_at?: string | null;
  delivered_at?: string | null;
  canceled_at?: string | null;
  created_at?: string;
}

interface FulfillmentStep {
  key: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

// ─── Helper: extraer tracking info de fulfillments ───────────────────────────

/**
 * Extrae el primer tracking number y tracking URL disponibles
 * de la lista de fulfillments. Soporta la estructura de Medusa v2
 * donde los links pueden estar en tracking_links[], labels[] o label_url.
 */
function extractTrackingInfo(fulfillments: Fulfillment[]): {
  trackingNumber: string | null;
  trackingUrl: string | null;
} {
  if (!fulfillments?.length) return { trackingNumber: null, trackingUrl: null };

  for (const f of fulfillments) {
    if (f.canceled_at) continue; // ignorar fulfillments cancelados

    // 1. tracking_links[] — estructura estándar de Medusa v2
    if (f.tracking_links?.length) {
      for (const link of f.tracking_links) {
        const url = link.url || link.tracking_url;
        if (url && url !== '#') {
          return {
            trackingNumber: f.tracking_numbers?.[0] ?? null,
            trackingUrl: url,
          };
        }
      }
    }

    // 2. labels[] como array (algunos carriers lo usan)
    if (Array.isArray(f.labels) && f.labels.length > 0) {
      const url = f.labels[0]?.tracking_url;
      if (url && url !== '#') {
        return {
          trackingNumber: f.tracking_numbers?.[0] ?? null,
          trackingUrl: url,
        };
      }
    }

    // 3. labels como objeto directo
    if (f.labels && !Array.isArray(f.labels)) {
      const url = (f.labels as { tracking_url?: string }).tracking_url;
      if (url && url !== '#') {
        return {
          trackingNumber: f.tracking_numbers?.[0] ?? null,
          trackingUrl: url,
        };
      }
    }

    // 4. label_url directo (legacy / carriers custom)
    if (f.label_url && f.label_url !== '#') {
      return {
        trackingNumber: f.tracking_numbers?.[0] ?? null,
        trackingUrl: f.label_url,
      };
    }

    // 5. Solo número de guía, sin URL de tracking
    if (f.tracking_numbers?.[0]) {
      return {
        trackingNumber: f.tracking_numbers[0],
        trackingUrl: null,
      };
    }
  }

  return { trackingNumber: null, trackingUrl: null };
}

// ─── Componente: Gráfica de progreso del fulfillment ─────────────────────────

const FULFILLMENT_STEPS: FulfillmentStep[] = [
  {
    key: 'pending_payment',
    label: 'Pago recibido',
    sublabel: 'Pago confirmado',
    icon: <CreditCard size={16} />,
  },
  {
    key: 'not_fulfilled',
    label: 'Preparando',
    sublabel: 'Alistando productos',
    icon: <Package size={16} />,
  },
  {
    key: 'fulfilled',
    label: 'Empacado',
    sublabel: 'Listo para despacho',
    icon: <Package size={16} />,
  },
  {
    key: 'shipped',
    label: 'En camino',
    sublabel: 'Con el transportista',
    icon: <Truck size={16} />,
  },
  {
    key: 'delivered',
    label: 'Entregado',
    sublabel: 'Pedido completado',
    icon: <CheckCircle2 size={16} />,
  },
];

function getActiveStepIndex(order: any): number {
  if (order.status === 'canceled') return -1;
  if (order.payment_status !== 'captured') return 0;

  switch (order.fulfillment_status) {
    case 'not_fulfilled': return 1;
    case 'fulfilled':     return 2;
    case 'shipped':       return 3;
    case 'delivered':     return 4;
    default:              return 1;
  }
}

function FulfillmentProgressChart({ order }: { order: any }) {
  const activeIndex = getActiveStepIndex(order);
  const isCanceled = order.status === 'canceled';

  if (isCanceled) {
    return (
      <div className="bg-white border border-slate-200 p-8 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
            <AlertCircle size={16} className="text-red-500" />
          </div>
          <Typography variant="h4" className="text-sm font-black uppercase">Estado del Pedido</Typography>
        </div>
        <div className="bg-red-50 border border-red-100 px-6 py-4 flex items-center gap-4">
          <AlertCircle size={20} className="text-red-500 shrink-0" />
          <div>
            <Typography variant="h4" className="text-sm font-black uppercase text-red-700">Pedido Cancelado</Typography>
            <Typography variant="body" className="text-xs text-red-500 mt-1">Este pedido fue cancelado y no será procesado.</Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
          <Truck size={16} className="text-slate-700" />
        </div>
        <Typography variant="h4" className="text-sm font-black uppercase">Progreso del Pedido</Typography>
      </div>

      {/* Steps — desktop: horizontal, mobile: vertical */}
      <div className="hidden md:flex items-start relative">
        {/* Línea base de fondo */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-slate-100 z-0" />

        {/* Línea de progreso activa */}
        {activeIndex > 0 && (
          <div
            className="absolute top-5 left-0 h-[2px] bg-slate-900 z-0 transition-all duration-700"
            style={{
              width: `${(activeIndex / (FULFILLMENT_STEPS.length - 1)) * 100}%`,
            }}
          />
        )}

        {FULFILLMENT_STEPS.map((step, i) => {
          const isDone    = i < activeIndex;
          const isActive  = i === activeIndex;
          const isPending = i > activeIndex;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center gap-3 relative z-10">
              {/* Círculo */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${isDone   ? 'bg-slate-900 border-slate-900 text-white' : ''}
                  ${isActive ? 'bg-white border-slate-900 text-slate-900 shadow-[0_0_0_4px_rgba(15,23,42,0.08)]' : ''}
                  ${isPending? 'bg-white border-slate-200 text-slate-300' : ''}
                `}
              >
                {isDone ? <CheckCircle2 size={18} /> : step.icon}
              </div>

              {/* Label */}
              <div className="text-center space-y-0.5 px-1">
                <Typography
                  variant="detail"
                  className={`text-[10px] font-black uppercase tracking-widest block leading-tight
                    ${isDone || isActive ? 'text-slate-900' : 'text-slate-300'}
                  `}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="detail"
                  className={`text-[9px] uppercase tracking-wide block leading-tight
                    ${isActive ? 'text-slate-500' : 'text-slate-300'}
                    ${isDone ? 'text-slate-400' : ''}
                  `}
                >
                  {step.sublabel}
                </Typography>
              </div>

              {/* Indicador "actual" */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Steps — mobile: vertical */}
      <div className="flex md:hidden flex-col gap-0">
        {FULFILLMENT_STEPS.map((step, i) => {
          const isDone    = i < activeIndex;
          const isActive  = i === activeIndex;
          const isPending = i > activeIndex;
          const isLast    = i === FULFILLMENT_STEPS.length - 1;

          return (
            <div key={step.key} className="flex gap-4">
              {/* Columna izquierda: círculo + línea vertical */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500
                    ${isDone   ? 'bg-slate-900 border-slate-900 text-white' : ''}
                    ${isActive ? 'bg-white border-slate-900 text-slate-900' : ''}
                    ${isPending? 'bg-white border-slate-200 text-slate-300' : ''}
                  `}
                >
                  {isDone ? <CheckCircle2 size={14} /> : React.cloneElement(step.icon as React.ReactElement<any>, { size: 14 })}
                </div>
                {!isLast && (
                  <div className={`w-[2px] flex-1 my-1 min-h-[24px] ${isDone ? 'bg-slate-900' : 'bg-slate-100'}`} />
                )}
              </div>

              {/* Texto */}
              <div className={`pb-4 pt-1 ${isLast ? '' : ''}`}>
                <Typography
                  variant="detail"
                  className={`text-[10px] font-black uppercase tracking-widest block
                    ${isDone || isActive ? 'text-slate-900' : 'text-slate-300'}
                  `}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="detail"
                  className={`text-[9px] uppercase tracking-wide block mt-0.5
                    ${isActive ? 'text-slate-500' : isDone ? 'text-slate-400' : 'text-slate-300'}
                  `}
                >
                  {step.sublabel}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje contextual según el estado actual */}
      {activeIndex >= 0 && (
        <div className="bg-slate-50 border border-slate-100 px-5 py-3 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0 animate-pulse" />
          <Typography variant="detail" className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            {activeIndex === 0 && 'Pago recibido. Tu pedido será procesado pronto.'}
            {activeIndex === 1 && 'Estamos preparando tus productos con cuidado.'}
            {activeIndex === 2 && 'Todo listo. En espera de despacho por el transportista.'}
            {activeIndex === 3 && 'Tu paquete está en camino. ¡Pronto llegará!'}
            {activeIndex === 4 && '¡Pedido entregado! Esperamos que lo disfrutes.'}
          </Typography>
        </div>
      )}
    </div>
  );
}

// ─── Componente: Banner de tracking ──────────────────────────────────────────

function TrackingBanner({
  trackingNumber,
  trackingUrl,
}: {
  trackingNumber: string | null;
  trackingUrl: string | null;
}) {
  if (!trackingNumber && !trackingUrl) return null;

  return (
    <div className="bg-white border-2 border-slate-900 p-10 flex flex-col md:flex-row items-center justify-between gap-8 no-print relative group overflow-hidden">
      <div className="relative z-10 flex items-center gap-6">
        <div className="w-14 h-14 bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200 shrink-0">
          <Truck size={28} />
        </div>
        <div className="space-y-1.5">
          <Typography variant="h3" className="text-xl font-black uppercase italic tracking-tight">
            Rastrea tu envío
          </Typography>
          {trackingNumber && (
            <div className="flex items-center gap-2">
              <Typography variant="detail" className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Guía:
              </Typography>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 select-all">
                {trackingNumber}
              </span>
            </div>
          )}
          <Typography variant="body" className="text-slate-500 text-xs font-medium max-w-sm">
            {trackingUrl
              ? 'Consulta el estado y ubicación exacta de tu paquete en tiempo real.'
              : 'Usa este número de guía para rastrear tu paquete con el transportista.'}
          </Typography>
        </div>
      </div>

      {trackingUrl ? (
        <a
          href={trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 bg-slate-900 text-white border-2 border-slate-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all duration-300 flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none"
        >
          Seguir Pedido
          <ExternalLink size={14} />
        </a>
      ) : (
        <button
          onClick={() => {
            navigator.clipboard?.writeText(trackingNumber ?? '');
          }}
          className="relative z-10 bg-slate-900 text-white border-2 border-slate-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all duration-300 flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none"
        >
          Copiar Guía
          <Package size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await getOrder(id as string);
        setOrder(response.order);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError('No se pudo encontrar la información de este pedido.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const handleDownloadInvoice = () => window.print();

  const getOrderStatusInfo = (order: any) => {
    const { fulfillment_status, payment_status, status } = order;

    if (status === 'canceled') {
      return { label: 'Cancelado', icon: <Clock size={16} />, color: 'bg-red-50 text-red-600 border-red-100' };
    }
    if (payment_status !== 'captured') {
      return { label: 'Pendiente de pago', icon: <Clock size={16} />, color: 'bg-yellow-50 text-yellow-600 border-yellow-100' };
    }
    switch (fulfillment_status) {
      case 'not_fulfilled': return { label: 'Preparando pedido', icon: <Package size={16} />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'fulfilled':     return { label: 'Listo para envío',  icon: <Package size={16} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
      case 'shipped':       return { label: 'En camino',         icon: <Truck size={16} />,   color: 'bg-orange-50 text-orange-600 border-orange-100' };
      case 'delivered':     return { label: 'Entregado',         icon: <Truck size={16} />,   color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      default:              return { label: 'Procesando',        icon: <Package size={16} />, color: 'bg-slate-50 text-slate-500 border-slate-100' };
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Navbar />
        <div className="text-center space-y-4 pt-44">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent animate-spin mx-auto rounded-full" />
          <Typography variant="detail" className="block font-black uppercase tracking-widest text-slate-400">
            Cargando Detalles del Pedido...
          </Typography>
        </div>
      </main>
    );
  }

  // ── Error ──
  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <section className="pt-44 pb-32 px-6 max-w-[800px] mx-auto text-center space-y-8">
          <div className="bg-white border border-slate-200 p-16 space-y-6">
            <Typography variant="h2" className="text-3xl font-black uppercase italic">Oops!</Typography>
            <Typography variant="body" className="text-slate-500">{error || 'El pedido solicitado no existe.'}</Typography>
            <Button label="Volver a mi cuenta" onClick={() => router.push('/account')} className="mx-auto" />
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const statusInfo = getOrderStatusInfo(order);
  const { trackingNumber, trackingUrl } = extractTrackingInfo(order.fulfillments ?? []);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <section className="pt-44 pb-32 px-6 max-w-[1200px] mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <Typography variant="detail" className="font-black uppercase tracking-widest text-[10px]">Volver al Historial</Typography>
        </button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 pb-8 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Typography variant="h1" className="text-4xl font-black uppercase italic">Pedido #{order.display_id}</Typography>
              <div className={`px-4 py-1.5 border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.label}
              </div>
            </div>
            <Typography variant="body" className="text-slate-400 text-sm">
              Realizado el {new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          </div>

          <div className="flex gap-4 w-full sm:w-auto no-print">
            <Button
              variant="outline"
              label="Descargar Factura"
              className="flex-1 sm:flex-initial text-[10px] py-4"
              onClick={handleDownloadInvoice}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ── Columna principal ── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Gráfica de progreso del fulfillment */}
            <FulfillmentProgressChart order={order} />

            {/* Tracking banner — solo si hay número de guía */}
            <TrackingBanner trackingNumber={trackingNumber} trackingUrl={trackingUrl} />

            {/* Productos */}
            <div className="bg-white border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <Typography variant="h3" className="text-base font-black uppercase tracking-tight">
                  Productos en tu pedido ({order.items?.length})
                </Typography>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="p-8 flex items-center gap-8">
                    <div className="w-24 h-24 bg-slate-50 border border-slate-100 relative overflow-hidden flex-shrink-0 group">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                          <Package size={32} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Typography variant="h4" className="text-sm font-black uppercase">{item.title}</Typography>
                          <Typography variant="body" className="text-xs text-slate-400 font-medium">
                            {item.variant?.title || item.description || 'Especificación estándar'}
                          </Typography>
                        </div>
                        <Typography variant="h4" className="text-sm font-black">${item.total.toLocaleString()}</Typography>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-slate-50 border border-slate-100 px-3 py-1 flex items-center gap-2">
                          <Typography variant="detail" className="text-[10px] text-slate-400">CANT:</Typography>
                          <Typography variant="h4" className="text-[10px] font-black">{item.quantity}</Typography>
                        </div>
                        <Typography variant="detail" className="text-[10px] text-slate-400">
                          Unit: ${item.unit_price.toLocaleString()}
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner soporte */}
            <div className="bg-slate-900 p-12 text-white space-y-6 flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden relative no-print">
              <div className="relative z-10 space-y-4">
                <Typography variant="h3" className="text-2xl font-black uppercase italic tracking-tighter">¿Necesitas ayuda con este pedido?</Typography>
                <Typography variant="body" className="text-slate-400 text-sm max-w-md">Nuestro equipo de soporte está disponible para resolver cualquier duda sobre tu envío o productos.</Typography>
              </div>
              <Button
                label="Contactar Soporte"
                variant="outline"
                className="relative z-10 border-white text-white hover:bg-white hover:text-slate-900 border-2 px-10 py-5"
                onClick={() => router.push('/contact')}
              />
              <Package size={200} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-8">

            {/* Resumen */}
            <div className="bg-white border-2 border-slate-900 p-8 space-y-8">
              <Typography variant="h3" className="text-lg font-black uppercase italic border-b-2 border-slate-900 pb-4">Resumen</Typography>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <Typography variant="body" className="text-slate-500 font-medium">Subtotal</Typography>
                  <Typography variant="h4" className="font-bold">${order.subtotal.toLocaleString()}</Typography>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <Typography variant="body" className="text-slate-500 font-medium">Envío</Typography>
                  <Typography variant="h4" className="font-bold">${order.shipping_total.toLocaleString()}</Typography>
                </div>
                <div className="flex justify-between items-center text-sm text-emerald-600">
                  <Typography variant="body" className="font-medium">Impuestos</Typography>
                  <Typography variant="h4" className="font-bold">${order.tax_total.toLocaleString()}</Typography>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-end">
                    <Typography variant="h3" className="text-sm font-black uppercase tracking-widest">Total</Typography>
                    <Typography variant="h3" className="text-2xl font-black">${order.total.toLocaleString()}</Typography>
                  </div>
                  <Typography variant="detail" className="text-[9px] text-slate-400 font-bold uppercase text-right block mt-2">Iva Incluido • Pesos Colombianos</Typography>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="bg-white border border-slate-200 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                  <MapPin size={16} />
                </div>
                <Typography variant="h4" className="text-sm font-black uppercase">Dirección de Envío</Typography>
              </div>

              <div className="space-y-1">
                <Typography variant="h4" className="text-xs font-black uppercase">
                  {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                </Typography>
                <Typography variant="body" className="text-xs text-slate-500 leading-relaxed font-medium">
                  {order.shipping_address?.address_1}{order.shipping_address?.address_2 && `, ${order.shipping_address?.address_2}`}
                  <br />
                  {order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}
                  <br />
                  {order.shipping_address?.country_code?.toUpperCase()}
                </Typography>
                <div className="pt-2">
                  <Typography variant="detail" className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Tel: {order.shipping_address?.phone || 'No registrado'}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Pago */}
            <div className="bg-white border border-slate-200 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                  <CreditCard size={16} />
                </div>
                <Typography variant="h4" className="text-sm font-black uppercase">Método de Pago</Typography>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-tighter">WOMPI</div>
                  <Typography variant="h4" className="text-xs font-black uppercase">Pasarela Segura</Typography>
                </div>
                <div className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest text-center border ${order.payment_status === 'captured' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                  Pago: {order.payment_status === 'captured' ? 'Completado' : order.payment_status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print, nav, footer, button, .whatsapp-button { display: none !important; }
          main { background-color: white !important; padding: 0 !important; display: block !important; }
          section { padding-top: 0 !important; margin: 0 !important; max-width: 100% !important; }
          .grid { display: block !important; }
          .lg\\:col-span-8, .lg\\:col-span-4 { width: 100% !important; }
          .bg-white { border: none !important; box-shadow: none !important; }
          .border { border-bottom: 1px solid #e2e8f0 !important; }
          h1 { font-size: 24pt !important; color: black !important; }
          .text-slate-400, .text-slate-500 { color: #64748b !important; }
          body::before {
            content: "LADY NAILS E-COMMERCE - FACTURA DE VENTA";
            display: block; text-align: center; font-weight: 900;
            font-size: 14pt; margin-bottom: 2rem; letter-spacing: 0.1em;
          }
          .bg-slate-900 { background-color: white !important; color: black !important; border: 2px solid black !important; }
        }
      `}} />
    </main>
  );
}