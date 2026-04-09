'use client';

import React from 'react';
import { Package, Truck, Clock, ChevronRight, Search, AlertCircle } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { useCustomerOrders, Order } from '@/hooks/useOrders';
import Link from 'next/link';
import Image from 'next/image';

export default function OrdersPage() {
  const { user } = useUser();
  const { showToast } = useToast();
  const { orders, isLoading: isOrdersLoading, isError } = useCustomerOrders();
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (isError) {
      showToast('No se pudieron cargar tus pedidos', 'error');
    }
  }, [isError, showToast]);

  const getOrderDisplayStatus = (order: Order) => {
    const { fulfillment_status, payment_status, status } = order;

    if (status === 'canceled') {
      return { 
        label: 'Cancelado', 
        icon: <Clock size={10} />, 
        colorClass: 'bg-red-50 text-red-600 border-red-200' 
      };
    }
    if (payment_status !== 'captured') {
      return { 
        label: 'Verificando Pago', 
        icon: <Clock size={10} />, 
        colorClass: 'bg-amber-50 text-amber-600 border-amber-200' 
      };
    }
    switch (fulfillment_status) {
      case 'not_fulfilled':
        return { 
          label: 'Alistando', 
          icon: <Package size={10} />, 
          colorClass: 'bg-amber-50 text-amber-600 border-amber-200' 
        };
      case 'fulfilled':
        return { 
          label: 'Empacado', 
          icon: <Package size={10} />, 
          colorClass: 'bg-blue-50 text-blue-600 border-blue-200' 
        };
      case 'shipped':
        return { 
          label: 'En Camino', 
          icon: <Truck size={10} />, 
          colorClass: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200' 
        };
      case 'delivered':
        return { 
          label: 'Entregado', 
          icon: <Truck size={10} />, 
          colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-200' 
        };
      default:
        return { 
          label: 'Procesando', 
          icon: <Package size={10} />, 
          colorClass: 'bg-gray-100 text-gray-500 border-gray-200' 
        };
    }
  };

  const filteredOrders = orders.filter(
    (order: Order) => order.display_id?.toString().includes(searchTerm)
  );

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header with Search (Standard White Theme) */}
      <div className="bg-white border border-gray-200 p-8 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <Typography variant="h2" className="text-3xl font-black uppercase tracking-tighter">
            Mis Pedidos
          </Typography>
          <Typography variant="detail" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {orders.length} pedidos en tu historial
          </Typography>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por código..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-black pl-12 pr-4 py-3 placeholder:text-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all text-sm font-medium rounded-none"
          />
        </div>
      </div>

      {/* Orders Grid (1 Column Mobile, 2 Columns Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        {isOrdersLoading ? (
          <div className="col-span-full bg-white border border-gray-100 p-24 text-center space-y-4 rounded-none">
            <div className="w-10 h-10 border-4 border-black border-t-transparent animate-spin mx-auto rounded-full"></div>
            <Typography variant="detail" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              Cargando Historial...
            </Typography>
          </div>
        ) : isError ? (
          <div className="col-span-full bg-white border border-red-100 p-24 text-center space-y-6 rounded-none">
            <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto border border-red-100">
               <AlertCircle size={24} className="text-red-500" />
            </div>
            <div className="space-y-2">
              <Typography variant="h4" className="text-sm sm:text-base font-black uppercase tracking-tight text-red-600">
                Error al cargar pedidos
              </Typography>
              <Typography variant="body" className="text-[10px] sm:text-xs text-red-400 font-medium max-w-sm mx-auto">
                No pudimos conectar con el servidor para obtener tu historial.
              </Typography>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-block px-8 py-3 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-md"
            >
              Reintentar
            </button>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order: Order) => {
            const { label, icon, colorClass } = getOrderDisplayStatus(order);
            const firstItem = order.items?.[0];
            const extraCount = order.items ? order.items.length - 1 : 0;

            return (
              <Link 
                href={`/account/orders/${order.id}`}
                key={order.id} 
                className="flex flex-col h-full bg-white border border-gray-200 hover:border-black hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
              >
                {/* Header Strip - Premium Black Identity */}
                <div className="bg-black p-4 sm:p-5 flex justify-between items-center text-white relative z-10 transition-colors group-hover:bg-black">
                  <div className="space-y-0.5">
                    <Typography variant="detail" className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em]">
                      Código de Tracking
                    </Typography>
                    <Typography variant="h4" className="text-sm sm:text-base font-black tracking-tighter">
                      #{order.display_id}
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography variant="detail" className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em] block mb-0.5">
                      Fecha
                    </Typography>
                    <Typography variant="detail" className="text-[10px] text-white font-black">
                      {new Date(order.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }).toUpperCase()}
                    </Typography>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-6">
                  {/* Status High-contrast Badge */}
                  <div>
                    <Typography variant="detail" className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] block mb-2">
                       Estado de Entrega
                    </Typography>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-[9px] font-black uppercase tracking-widest shadow-sm transition-transform group-hover:scale-105 origin-left ${colorClass}`}>
                      {icon}
                      <span className="mt-px">{label}</span>
                    </div>
                  </div>

                  {/* Items Display - Minimalist Box style */}
                  <div className="flex items-center gap-5 p-3 bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-black transition-all">
                    <div className="relative w-16 h-16 bg-white border border-gray-200 shrink-0 group-hover:border-neutral-200 transition-colors p-1">
                      {firstItem?.thumbnail ? (
                        <Image src={firstItem.thumbnail} alt={firstItem.title} fill className="object-cover" />
                      ) : (
                        <Package size={20} className="text-gray-300 absolute inset-0 m-auto" />
                      )}
                      {extraCount > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-lg z-10 ring-2 ring-white group-hover:scale-110 transition-transform">
                          +{extraCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography variant="body" className="text-[10px] sm:text-[11px] font-black text-black uppercase leading-tight line-clamp-1 tracking-tight">
                        {firstItem?.title || 'Pedido de Suministros'}
                      </Typography>
                      <Typography variant="detail" className="text-[9px] text-gray-500 font-medium uppercase tracking-widest mt-1.5 block">
                        {extraCount > 0 ? `Y ${extraCount} artículos adicionales` : 'Detalle de un solo producto'}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Footer - Price Focus */}
                <div className="mt-auto border-t border-neutral-100 bg-white p-5 sm:p-6 flex items-center justify-between group-hover:bg-gray-50 transition-colors">
                  <div className="space-y-1">
                    <Typography variant="detail" className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em] block">
                      Inversión Total
                    </Typography>
                    <Typography variant="h4" className="text-lg sm:text-2xl font-black text-black leading-none tracking-tighter">
                      ${order.total?.toLocaleString()}
                    </Typography>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 text-neutral-400 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-500">
                    <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full bg-white border border-gray-200 border-dashed p-16 sm:p-24 text-center space-y-6 rounded-none">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 flex items-center justify-center mx-auto border border-gray-100">
              <Search size={24} className={searchTerm ? "text-gray-400" : "text-gray-200"} />
            </div>
            <div className="space-y-2">
              <Typography variant="h4" className="text-sm sm:text-base font-black uppercase tracking-tight text-black">
                {searchTerm ? 'Sin coincidencias' : 'Aún no hay compras'}
              </Typography>
              <Typography variant="body" className="text-[10px] sm:text-xs text-gray-500 font-medium max-w-sm mx-auto">
                {searchTerm 
                  ? `No hay códigos "#${searchTerm}". Revisa el número e intenta nuevamente.`
                  : 'Tus pedidos aparecerán como tarjetas en este catálogo muy pronto.'}
              </Typography>
            </div>
            {!searchTerm && (
              <Link href="/shop" className="inline-block px-8 py-3 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-gray-900 transition-all shadow-md">
                Ver Catálogo
              </Link>
            )}
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="inline-block px-8 py-3 bg-white text-black border border-gray-200 text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                Borrar filtro
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
