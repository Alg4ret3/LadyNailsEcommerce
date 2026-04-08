'use client';

import React from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { ColombiaLocationSelect } from '@/components/molecules/ColombiaLocationSelect';

export default function AddressesPage() {
  const { user, createAddress, updateAddress, deleteAddress, isLoading: isUserLoading } = useUser();
  const { showToast } = useToast();

  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(null);
  const [addressToDelete, setAddressToDelete] = React.useState<string | null>(null);
  const [isActionPending, setIsActionPending] = React.useState(false);

  const [addressForm, setAddressForm] = React.useState({
    addressName: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    city: '',
    country: 'CO',
    phone: user?.phone || '',
    province: '',
    postalCode: ''
  });

  const resetAddressForm = () => {
    setAddressForm({
      addressName: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      street: '',
      city: '',
      country: 'CO',
      phone: user?.phone || '',
      province: '',
      postalCode: ''
    });
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  const handleEditClick = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      addressName: addr.label || '',
      firstName: addr.first_name || user?.firstName || '',
      lastName: addr.last_name || user?.lastName || '',
      street: addr.address_1 || '',
      city: addr.city || '',
      country: addr.country_code || 'CO',
      phone: addr.phone || '',
      province: addr.province || '',
      postalCode: addr.postal_code || ''
    });
    setIsAddingAddress(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionPending(true);
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
        showToast('Dirección actualizada con éxito');
      } else {
        if ((user?.addresses?.length || 0) >= 3) {
          showToast('Límite de 3 direcciones alcanzado', 'error');
          return;
        }
        await createAddress(addressForm);
        showToast('Dirección guardada con éxito');
      }
      resetAddressForm();
    } catch (error: any) {
      showToast(error.message || 'Error al procesar dirección', 'error');
    } finally {
      setIsActionPending(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    setIsActionPending(true);
    try {
      await deleteAddress(addressToDelete);
      showToast('Dirección eliminada');
      setAddressToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Error al eliminar', 'error');
    } finally {
      setIsActionPending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white border border-neutral-200 p-8 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <Typography variant="h2" className="text-3xl font-black uppercase tracking-tighter">Libreta de Direcciones</Typography>
          <Typography variant="detail" className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
            Tienes {user.addresses?.length || 0} de 3 direcciones permitidas
          </Typography>
        </div>
        {!isAddingAddress && (
          <button
            onClick={() => setIsAddingAddress(true)}
            disabled={(user.addresses?.length || 0) >= 3}
            className={`group flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
              (user.addresses?.length || 0) >= 3 
                ? 'bg-neutral-50 text-neutral-300 border border-neutral-100 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-neutral-800 active:scale-95'
            }`}
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            Nueva Dirección
          </button>
        )}
      </div>

      {isAddingAddress && (
        <div className="bg-white border-4 border-black p-8 sm:p-12 space-y-10 shadow-2xl animate-in fade-in slide-in-from-top-8 duration-500">
          <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
             <Typography variant="h3" className="text-xl font-black uppercase tracking-tight">
               {editingAddressId ? 'Editar Ubicación' : 'Registrar Nueva Dirección'}
             </Typography>
             <button onClick={resetAddressForm} className="text-neutral-400 hover:text-black transition-colors uppercase text-[9px] font-black tracking-widest">Cancelar</button>
          </div>

          <form onSubmit={handleSaveAddress} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 md:col-span-2">
                <Typography variant="detail" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Etiqueta de Identificación (Ej: Hogar, Oficina)</Typography>
                <input required value={addressForm.addressName} onChange={e => setAddressForm({...addressForm, addressName: e.target.value})} className="pro-input" placeholder="Nombre para esta dirección" />
              </div>

              <div className="space-y-3">
                <Typography variant="detail" className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nombres</Typography>
                <input required value={addressForm.firstName} onChange={e => setAddressForm({...addressForm, firstName: e.target.value})} className="pro-input" />
              </div>
              <div className="space-y-3">
                <Typography variant="detail" className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Apellidos</Typography>
                <input required value={addressForm.lastName} onChange={e => setAddressForm({...addressForm, lastName: e.target.value})} className="pro-input" />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Typography variant="detail" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dirección de Envío (Calle / Carrera / Nomenclatura)</Typography>
                <input required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="pro-input" placeholder="Ej: Calle 45 # 12-34 Torre 1 Apto 502" />
              </div>

              <ColombiaLocationSelect
                departamento={addressForm.province}
                ciudad={addressForm.city}
                onDepartamentoChange={(val) => setAddressForm(prev => ({ ...prev, province: val }))}
                onCiudadChange={(val) => setAddressForm(prev => ({ ...prev, city: val }))}
              />

              <div className="space-y-3">
                <Typography variant="detail" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teléfono de contacto</Typography>
                <input required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="pro-input" />
              </div>
              <div className="space-y-3">
                <Typography variant="detail" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Código Postal (Opcional)</Typography>
                <input value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} className="pro-input" />
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 flex items-center gap-6">
              <Button type="submit" label={isActionPending ? 'Procesando...' : (editingAddressId ? 'Actualizar Información' : 'Registrar Dirección')} disabled={isActionPending} className="px-12" />
              <button type="button" onClick={resetAddressForm} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Descartar</button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.addresses?.map((addr: any) => (
          <div key={addr.id} className="bg-white border border-neutral-200 p-8 sm:p-10 space-y-6 group hover:border-black transition-all shadow-sm">
             <div className="flex justify-between items-start">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-black" />
                      <Typography variant="h4" className="text-sm font-black uppercase tracking-tighter">{addr.label || 'Referencia'}</Typography>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-600 text-[8px] px-2 py-0.5 font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                        <CheckCircle2 size={10} /> Registrada
                      </span>
                   </div>
                </div>
                <div className="flex gap-3 md:gap-4 md:opacity-0 md:group-hover:opacity-100 transition-all md:scale-90 md:group-hover:scale-100 duration-300">
                   <button onClick={() => handleEditClick(addr)} className="w-9 h-9 sm:w-10 sm:h-10 bg-neutral-50 text-neutral-400 hover:bg-black hover:text-white flex items-center justify-center transition-all border border-neutral-100">
                      <Edit2 size={14} />
                   </button>
                   <button onClick={() => setAddressToDelete(addr.id)} className="w-9 h-9 sm:w-10 sm:h-10 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all border border-red-100/50">
                      <Trash2 size={14} />
                   </button>
                </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-neutral-50">
               <div className="space-y-1">
                 <Typography variant="body" className="text-sm font-bold text-black leading-tight">{addr.address_1}</Typography>
                 <Typography variant="body" className="text-xs text-neutral-400 uppercase tracking-widest font-bold">{addr.city}, {addr.province}</Typography>
               </div>
               
               <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-neutral-300 font-bold uppercase tracking-widest">
                  <span>{addr.first_name} {addr.last_name}</span>
                  <span className="w-1 h-1 bg-neutral-200 rounded-full mt-1.5" />
                  <span>{addr.phone}</span>
               </div>
             </div>
          </div>
        ))}

        {(!user.addresses || user.addresses.length === 0) && !isAddingAddress && (
          <div className="md:col-span-2 bg-neutral-50 border border-neutral-100 border-dashed p-24 text-center space-y-6">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <MapPin size={32} className="text-neutral-200" />
             </div>
             <div className="space-y-2">
                <Typography variant="h4" className="text-base font-black uppercase tracking-tight">No tienes direcciones registradas</Typography>
                <Typography variant="body" className="text-xs text-neutral-400 max-w-xs mx-auto">Agrega una dirección para que tus próximas compras sean más rápidas y seguras.</Typography>
             </div>
             <button onClick={() => setIsAddingAddress(true)} className="px-8 py-3 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all">Empezar Ahora +</button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Ubicación"
        message="¿Estás seguro de que deseas eliminar esta dirección de tu perfil? Deberás ingresarla manualmente en tu próximo pedido."
        confirmLabel="Confirmar Eliminación"
        variant="danger"
        isLoading={isActionPending}
      />
    </div>
  );
}
