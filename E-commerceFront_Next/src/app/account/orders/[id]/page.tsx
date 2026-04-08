'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography } from '@/components/atoms/Typography';
import { Package, Truck, Clock, ArrowLeft, MapPin, CreditCard, ExternalLink, CheckCircle2, AlertCircle, Star } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useOrderDetails, Order } from '@/hooks/useOrders';
import Image from 'next/image';
import { WHATSAPP_CONFIG } from '@/constants';
import { createPlatformReview, getPlatformReviews } from '@/services/medusa/review';

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
  statusNote: string;
  icon: React.ReactNode;
  activeColor: string;
  ringColor: string;
  doneColor: string;
}

// ─── Helper: extraer tracking info ───────────────────────────

function extractTrackingInfo(fulfillments: Fulfillment[]): {
  trackingNumber: string | null;
  trackingUrl: string | null;
} {
  if (!fulfillments?.length) return { trackingNumber: null, trackingUrl: null };

  for (const f of fulfillments) {
    if (f.canceled_at) continue;
    if (f.tracking_links?.length) {
      for (const link of f.tracking_links) {
        const url = link.url || link.tracking_url;
        if (url && url !== '#') {
          return { trackingNumber: f.tracking_numbers?.[0] ?? null, trackingUrl: url };
        }
      }
    }
    if (Array.isArray(f.labels) && f.labels.length > 0) {
      const url = f.labels[0]?.tracking_url;
      if (url && url !== '#') {
        return { trackingNumber: f.tracking_numbers?.[0] ?? null, trackingUrl: url };
      }
    }
    if (f.labels && !Array.isArray(f.labels)) {
      const url = (f.labels as { tracking_url?: string }).tracking_url;
      if (url && url !== '#') {
        return { trackingNumber: f.tracking_numbers?.[0] ?? null, trackingUrl: url };
      }
    }
    if (f.label_url && f.label_url !== '#') {
      return { trackingNumber: f.tracking_numbers?.[0] ?? null, trackingUrl: f.label_url };
    }
    if (f.tracking_numbers?.[0]) {
      return { trackingNumber: f.tracking_numbers[0], trackingUrl: null };
    }
  }

  return { trackingNumber: null, trackingUrl: null };
}

// ─── Componente: Gráfica de progreso del fulfillment ─────────────────────────

const FULFILLMENT_STEPS: FulfillmentStep[] = [
  { 
    key: 'pending_payment', 
    label: 'Verificando', 
    sublabel: 'Pago en proceso', 
    statusNote: 'Trámite de seguridad bancaria en curso.',
    icon: <CreditCard size={14} />, 
    activeColor: 'bg-white border-black text-black', 
    ringColor: 'ring-black/10', 
    doneColor: 'bg-emerald-500 border-emerald-500 text-white' 
  },
  { 
    key: 'not_fulfilled', 
    label: 'En Bodega', 
    sublabel: 'Alistamiento', 
    statusNote: 'Pedido en cola de selección y despacho.',
    icon: <Package size={14} />, 
    activeColor: 'bg-white border-black text-black', 
    ringColor: 'ring-black/10', 
    doneColor: 'bg-emerald-500 border-emerald-500 text-white' 
  },
  { 
    key: 'fulfilled', 
    label: 'Empacado', 
    sublabel: 'Listo para envío', 
    statusNote: 'Protección y embalaje final completado.',
    icon: <Package size={14} />, 
    activeColor: 'bg-white border-black text-black', 
    ringColor: 'ring-black/10', 
    doneColor: 'bg-emerald-500 border-emerald-500 text-white' 
  },
  { 
    key: 'shipped', 
    label: 'Despachado', 
    sublabel: 'En camino', 
    statusNote: 'Paquete entregado al operador logístico.',
    icon: <Truck size={14} />, 
    activeColor: 'bg-white border-black text-black', 
    ringColor: 'ring-black/10', 
    doneColor: 'bg-emerald-500 border-emerald-500 text-white' 
  },
  { 
    key: 'delivered', 
    label: 'Entregado', 
    sublabel: 'Pedido finalizado', 
    statusNote: 'Entrega confirmada. ¡Gracias por elegirnos!',
    icon: <CheckCircle2 size={14} />, 
    activeColor: 'bg-white border-black text-black', 
    ringColor: 'ring-black/10', 
    doneColor: 'bg-emerald-500 border-emerald-500 text-white' 
  }
];

function getActiveStepIndex(order: Order): number {
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

function FulfillmentProgressChart({ order }: { order: Order }) {
  const activeIndex = getActiveStepIndex(order);
  const isCanceled = order.status === 'canceled';

  if (isCanceled) {
    return (
      <div className="bg-white border border-red-100 p-6 sm:p-8 space-y-4 shadow-sm mb-8">
        <div className="flex items-center gap-3 pb-4 border-b border-red-50">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-200">
            <AlertCircle size={14} className="text-red-600" />
          </div>
          <Typography variant="h4" className="text-xs sm:text-sm font-black uppercase tracking-widest text-red-600">Alerta del Pedido</Typography>
        </div>
        <div className="bg-red-50 border border-red-100 px-6 py-4 flex items-center gap-4">
          <AlertCircle size={20} className="text-red-500 shrink-0" />
          <div>
            <Typography variant="h4" className="text-xs font-black uppercase text-red-700">Pedido Cancelado</Typography>
            <Typography variant="body" className="text-[11px] sm:text-xs text-red-600 mt-1 max-w-lg">
              Este pedido ha sido cancelado en nuestro sistema logístico y no será procesado.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-6 sm:p-10 space-y-8 shadow-sm mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-black">
          <Truck size={14} />
        </div>
        <Typography variant="h4" className="text-xs font-black uppercase tracking-widest text-black">
          Progreso del Envío
        </Typography>
      </div>

      {/* Steps — desktop: horizontal */}
      <div className="hidden md:flex items-start relative px-4">
        <div className="absolute top-4 left-6 right-6 h-[2px] bg-gray-100 z-0" />

        {FULFILLMENT_STEPS.map((step, i) => {
          const isDone    = i < activeIndex;
          const isActive  = i === activeIndex;
          const isPending = i > activeIndex;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center gap-3 relative z-10">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-700
                  ${isDone   ? step.doneColor : ''}
                  ${isActive ? `${step.activeColor} ring-[3px] ${step.ringColor}` : ''}
                  ${isPending? 'bg-white border-gray-200 text-gray-300' : ''}
                `}
              >
                {isDone ? <CheckCircle2 size={14} /> : step.icon}
              </div>
              <div className="text-center space-y-1">
                <Typography
                  variant="detail"
                  className={`text-[9.5px] font-black uppercase tracking-widest block leading-tight
                    ${isDone || isActive ? 'text-black' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </Typography>
                <Typography
                  variant="detail"
                  className={`text-[8.5px] uppercase tracking-widest block leading-tight
                    ${isActive ? 'text-gray-500 font-bold' : 'text-gray-300'}
                    ${isDone ? 'text-gray-400' : ''}
                  `}
                >
                  {step.sublabel}
                </Typography>
                {(isDone || isActive) && (
                  <div className={`mt-2 flex flex-col items-center gap-1 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    <span className="text-[7px] font-black uppercase bg-black text-white px-1 leading-tight py-0.5">Nota:</span>
                    <Typography
                      variant="detail"
                      className="text-[7.5px] text-gray-600 font-bold uppercase tracking-tight text-center leading-[1.1] max-w-[80px]"
                    >
                      {step.statusNote}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Steps — mobile: vertical */}
      <div className="flex md:hidden flex-col gap-0 px-2">
        {FULFILLMENT_STEPS.map((step, i) => {
          const isDone    = i < activeIndex;
          const isActive  = i === activeIndex;
          const isPending = i > activeIndex;
          const isLast    = i === FULFILLMENT_STEPS.length - 1;

          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500
                    ${isDone   ? step.doneColor : ''}
                    ${isActive ? `${step.activeColor} ring-4 ${step.ringColor}` : ''}
                    ${isPending? 'bg-white border-gray-200 text-gray-300' : ''}
                  `}
                >
                  {isDone ? <CheckCircle2 size={12} /> : React.cloneElement(step.icon as React.ReactElement<any>, { size: 12 })}
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 my-1.5 min-h-[28px] ${isDone ? 'bg-emerald-500' : 'bg-gray-100'}`} />
                )}
              </div>
              <div className={`pb-4 pt-0.5 flex flex-col justify-start`}>
                <Typography variant="detail" className={`text-[10px] sm:text-xs font-black uppercase tracking-widest block ${isDone || isActive ? 'text-black' : 'text-gray-400'}`}>
                  {step.label}
                </Typography>
                <Typography variant="detail" className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest block mt-0.5 ${isActive ? 'text-gray-600' : isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                  {step.sublabel}
                </Typography>
                {(isDone || isActive) && (
                  <div className={`mt-1.5 flex items-center gap-2 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    <span className="text-[7.5px] font-black uppercase bg-black text-white px-1 leading-tight py-0.5 shrink-0">Nota:</span>
                    <Typography variant="detail" className={`text-[8.5px] font-bold uppercase tracking-tight ${isActive ? 'text-black' : 'text-gray-500'}`}>
                      {step.statusNote}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ─── Componente: Banner de tracking ──────────────────────────────────────────

function TrackingBanner({ trackingNumber, trackingUrl }: { trackingNumber: string | null; trackingUrl: string | null; }) {
  if (!trackingNumber && !trackingUrl) return null;

  return (
    <div className="bg-white border border-gray-200 p-6 sm:p-10 flex flex-col items-start gap-5 no-print shadow-sm mb-8">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Typography variant="h3" className="text-xl sm:text-2xl font-black uppercase tracking-tighter">
            Rastrea tu Envío
          </Typography>
          <Typography variant="body" className="text-[11px] text-gray-500 font-medium">
            Entérate de todos los movimientos de tu paquete en tiempo real con la transportadora.
          </Typography>
        </div>
        
        <div className="w-12 h-12 bg-gray-50 items-center justify-center text-black border border-gray-200 shrink-0 hidden sm:flex">
          <Truck size={20} />
        </div>
      </div>

      <div className="w-full bg-gray-50 border border-gray-200 p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {trackingNumber ? (
           <div className="space-y-1">
             <Typography variant="detail" className="text-[9px] font-black uppercase tracking-widest text-gray-500">
               Guía de Transportadora:
             </Typography>
             <div className="font-mono text-sm sm:text-base font-bold text-black select-all">
               #{trackingNumber}
             </div>
           </div>
        ) : (
           <div className="font-mono text-xs text-gray-500 italic">Número de guía procesando...</div>
        )}
        
        <div className="w-full md:w-auto mt-2 md:mt-0">
          {trackingUrl ? (
            <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-950 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 w-full text-center">
              Rastrear Envío
              <ExternalLink size={14} />
            </a>
          ) : (
            <button onClick={() => navigator.clipboard?.writeText(trackingNumber ?? '')} className="bg-slate-950 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 w-full text-center">
              Copiar la guía
              <Package size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página principal (Sin Navbar / Footer globales porque ya están en layout) ─

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { showToast } = useToast();
  const { 
    order, 
    isLoading, 
    isError, 
    error: queryError 
  } = useOrderDetails(id as string);

  // Estados para el formulario de reseña incrustado
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [reviewText, setReviewText] = React.useState('');
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);
  const [userReviewsCount, setUserReviewsCount] = React.useState(0);
  const [loadingCount, setLoadingCount] = React.useState(true);

  // Fetch reviews count on mount
  React.useEffect(() => {
    const fetchReviewsCount = async () => {
      try {
        const response = await getPlatformReviews();
        if (response && response.reviews && order?.customer_id) {
          const count = response.reviews.filter((r: any) => r.customer_id === order.customer_id).length;
          setUserReviewsCount(count);
        }
      } catch (err) {
        console.error('Error fetching reviews count:', err);
      } finally {
        setLoadingCount(false);
      }
    };
    if (order?.customer_id) {
      fetchReviewsCount();
    }
  }, [order?.customer_id]);

  const handleSubmitReview = async () => {
    if (!order || rating === 0) return;
    try {
      setIsSubmittingReview(true);
      await createPlatformReview({
        rating,
        content: reviewText,
        customer_name: `${order.shipping_address?.first_name || 'Cliente'} ${order.shipping_address?.last_name || ''}`,
        customer_id: order.customer_id
      });
      setReviewSubmitted(true);
      showToast('¡Gracias por tu aporte a la comunidad!', 'success');
      setUserReviewsCount(prev => prev + 1);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      if (err.message?.includes('403') || err.message?.includes('límite máximo')) {
          showToast('Has alcanzado el límite máximo de 3 reseñas por usuario.', 'error');
      } else {
          showToast('Hubo un error al guardar tu reseña', 'error');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getOrderStatusInfo = (order: Order) => {
    const { fulfillment_status, payment_status, status } = order;

    if (status === 'canceled') {
      return { label: 'Cancelado', icon: <AlertCircle size={14} />, color: 'bg-red-50 text-red-600 border-red-200' };
    }
    if (payment_status !== 'captured') {
      return { label: 'Verificando Pago', icon: <Clock size={14} />, color: 'bg-amber-50 text-amber-600 border-amber-200' };
    }
    switch (fulfillment_status) {
      case 'not_fulfilled': return { label: 'Alistando tu pedido', icon: <Package size={14} />, color: 'bg-amber-50 text-amber-600 border-amber-200' };
      case 'fulfilled':     return { label: 'Empacado y listo', icon: <Package size={14} />, color: 'bg-blue-50 text-blue-600 border-blue-200' };
      case 'shipped':       return { label: 'En camino', icon: <Truck size={14} />, color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200' };
      case 'delivered':     return { label: 'Entregado', icon: <CheckCircle2 size={14} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
      default:              return { label: 'Validando orden', icon: <Clock size={14} />, color: 'bg-gray-100 text-gray-500 border-gray-200' };
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[500px] bg-white flex flex-col items-center justify-center p-10">
        <div className="w-10 h-10 border-4 border-black border-t-transparent animate-spin mx-auto rounded-full mb-4" />
        <Typography variant="detail" className="font-black uppercase tracking-[0.2em] text-gray-400 text-[10px]">
          Cargando detalles del pedido...
        </Typography>
      </div>
    );
  }

  // ── Error ──
  if (isError || !order) {
    return (
      <div className="w-full bg-white p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto border border-red-100 mb-6">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <Typography variant="h2" className="text-2xl font-black uppercase tracking-tighter">Ocurrió un error</Typography>
        <Typography variant="body" className="text-gray-500 text-sm max-w-sm mx-auto">No pudimos encontrar el detalle de este pedido.</Typography>
        <button onClick={() => router.push('/account/orders')} className="mt-8 px-6 py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors mx-auto block">
          Volver a Mis Pedidos
        </button>
      </div>
    );
  }

  const statusInfo = getOrderStatusInfo(order);
  const { trackingNumber, trackingUrl } = extractTrackingInfo(order.fulfillments ?? []);

  return (
    <div className="w-full bg-white p-4 sm:p-8 lg:p-10">
      
      {/* Navigation Bar */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button onClick={() => router.back()} className="flex items-center gap-2.5 text-gray-400 hover:text-black transition-colors group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 group-hover:border-black transition-all bg-gray-50 group-hover:bg-white text-gray-600 group-hover:text-black">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <Typography variant="detail" className="font-black uppercase tracking-[0.2em] text-[10px]">Volver al historial</Typography>
        </button>
      </div>

      {/* Title Header */}
      <div className="flex flex-col mb-10 pb-8 border-b border-gray-100">
        <Typography variant="detail" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">
          Resumen Automático • {new Date(order.created_at).toLocaleDateString()}
        </Typography>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Typography variant="h1" className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black">
             Pedido #{order.display_id}
          </Typography>
          <div className={`px-4 py-2 border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="mt-px">{statusInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Body Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* ── Left Column ── */}
        <div className="xl:col-span-7 space-y-8">
          
          <TrackingBanner trackingNumber={trackingNumber} trackingUrl={trackingUrl} />
          <FulfillmentProgressChart order={order} />

          {/* Listado de Productos Premium */}
          <div className="bg-white border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-center">
              <Typography variant="detail" className="text-[11px] font-black uppercase tracking-wide text-black flex items-center gap-2">
                <Package size={14} className="text-gray-400" />
                Productos del Pedido
              </Typography>
              <Typography variant="detail" className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                {order.items?.length} Artículos
              </Typography>
            </div>

            <div className="divide-y divide-gray-100 bg-white">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-gray-50/30 transition-colors">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-200 relative shrink-0">
                    {item.thumbnail ? (
                      <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                    ) : (
                      <Package size={20} className="text-gray-300 absolute inset-0 m-auto" />
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 sm:max-w-[70%]">
                      <Typography variant="h4" className="text-sm font-black uppercase leading-tight">{item.title}</Typography>
                      <Typography variant="body" className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                        {item.variant?.title || item.description || 'Configuración Estándar'}
                      </Typography>
                    </div>
                    
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-dashed border-gray-200 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                      <div className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-widest text-black bg-gray-100 px-2 py-1 mb-0 sm:mb-2">
                        <span>CANT: {item.quantity}</span>
                      </div>
                      <Typography variant="h4" className="text-[15px] font-black">${item.total.toLocaleString()}</Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Support Block */}
          <div className="bg-white border border-gray-200 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 no-print group transition-all hover:bg-gray-50">
             <div className="space-y-1.5 flex-1">
               <Typography variant="h4" className="text-xs sm:text-sm font-black uppercase tracking-wide text-black flex items-center gap-2">
                 ¿Necesitas ayuda con este pedido?
               </Typography>
               <Typography variant="body" className="text-[11px] text-gray-500 font-medium max-w-sm">
                 Nuestro centro de atención al cliente está activo. Contáctanos si tienes dudas con los productos o el envío.
               </Typography>
             </div>
              <a 
                href={`${WHATSAPP_CONFIG.baseUrl}/${WHATSAPP_CONFIG.defaultNumber}?text=${encodeURIComponent(`Hola Ladynail Shop, necesito soporte con mi pedido #${order.display_id}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-slate-950 text-white text-[9px] font-black uppercase tracking-[0.15em] border border-slate-950 hover:bg-white hover:text-slate-950 transition-colors shrink-0 whitespace-nowrap text-center"
              >
                Contactar Soporte
              </a>
          </div>
          
        </div>

        {/* ── Right Column (Resumen, Dirección, Pago) ── */}
        <div className="xl:col-span-5 space-y-6">

          {/* Total Balance Block */}
          <div className="bg-slate-950 p-8 lg:p-10 shadow-sm relative overflow-hidden group border border-white/5">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
              <Typography variant="h3" className="text-xs font-black uppercase tracking-[0.2em] text-white">
                Resumen de Compra
              </Typography>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Subtotal</span>
                <span className="font-black text-white">${order.subtotal?.toLocaleString() ?? 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Costo de Domicilio</span>
                <span className="font-black text-white">${order.shipping_total?.toLocaleString() ?? 0}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] font-medium text-slate-500">
                <span className="uppercase tracking-widest font-black">Impuestos incluidos en precio</span>
                <span className="font-bold text-slate-400">${order.tax_total?.toLocaleString() ?? 0}</span>
              </div>

              <div className="pt-6 mt-4 border-t border-white/10">
                <div className="flex flex-col items-end gap-1.5">
                  <Typography variant="detail" className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] block">Total a Pagar</Typography>
                  <Typography variant="h3" className="text-3xl sm:text-4xl font-black leading-none text-white">${order.total?.toLocaleString() ?? 0}</Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Data */}
          <div className="bg-white border border-gray-200 p-8 shadow-sm group hover:border-black transition-colors">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-black border border-gray-200">
                <MapPin size={12} />
              </div>
              <Typography variant="h4" className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-black">Dirección de Entrega</Typography>
            </div>

            <div className="space-y-1.5">
              <Typography variant="h4" className="text-xs sm:text-sm font-black uppercase text-black mb-1">
                {order.shipping_address?.first_name} {order.shipping_address?.last_name}
              </Typography>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {order.shipping_address?.address_1}{order.shipping_address?.address_2 && `, ${order.shipping_address?.address_2}`}
                <br />
                {order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}
                <br />
                País: {order.shipping_address?.country_code?.toUpperCase()}
              </p>
              {order.shipping_address?.phone && (
                <div className="pt-4 mt-2 border-t border-gray-50">
                  <Typography variant="detail" className="text-[9px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Celular Confirmado: {order.shipping_address.phone}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Payment Integration */}
          <div className="bg-white border border-gray-200 p-8 shadow-sm group hover:border-black transition-colors">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-black border border-gray-200">
                <CreditCard size={12} />
              </div>
              <Typography variant="h4" className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-black">Método de Pago</Typography>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4 border border-gray-100 bg-gray-50 p-3 sm:p-4">
                 <div className="flex flex-col gap-1">
                    <Typography variant="detail" className="text-[8px] sm:text-[9px] text-gray-500 font-black uppercase tracking-widest">Pasarela Aliada</Typography>
                    <Typography variant="h4" className="text-xs sm:text-sm font-black uppercase">Wompi Segura</Typography>
                 </div>
                 <div className="shrink-0">
                    <Typography variant="h4" className="text-2xl font-black text-black tracking-tighter italic">W</Typography>
                 </div>
              </div>
              
              <div className={`px-4 py-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center justify-between border shadow-sm ${order.payment_status === 'captured' ? 'bg-slate-950 text-white border-slate-950' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                <span>Estado de pago</span>
                <span className="flex items-center gap-2">
                  {order.payment_status === 'captured' ? 'PAGADO EXITOSAMENTE' : order.payment_status}
                  {order.payment_status === 'captured' && <CheckCircle2 size={12} />}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print, nav, footer, button, .whatsapp-button { display: none !important; }
          body, main, div { background-color: white !important; color: black !important; }
          .bg-black { border: 2px solid black !important; color: black !important; }
          .text-white { color: black !important; }
          .shadow-xl, .shadow-sm, .shadow-md { box-shadow: none !important; }
          body::before {
            content: "LADY NAILS E-COMMERCE - CÓDIGO DE ORDEN: ${order.display_id}";
            display: block; text-align: center; font-weight: 900;
            font-size: 14pt; margin-bottom: 2rem; letter-spacing: 0.1em;
          }
        }
      `}} />
    </div>
  );
}