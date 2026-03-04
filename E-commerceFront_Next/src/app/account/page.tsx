'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { User, Package, MapPin, LogOut, Trash2, Truck, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, updateProfile, createAddress, updateAddress, deleteAddress, logout, isLoading } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState('perfil');
  const [profileForm, setProfileForm] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

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

  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(null);
  const [addressToDelete, setAddressToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        setProfileForm({
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone || ''
        });
      }
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const MENU_ITEMS = [
    { id: 'perfil', icon: <User size={20} />, label: 'Datos del Perfil' },
    { id: 'pedidos', icon: <Package size={20} />, label: 'Mis Pedidos' },
    { id: 'direcciones', icon: <MapPin size={20} />, label: 'Libreta de Direcciones' },
  ];

  const ORDERS = [
    { id: 'GA-2026-X991', date: '24 Feb, 2026', total: 450000, status: 'En Bodega', icon: <Package size={18} className="text-slate-400" /> },
    { id: 'GA-2026-X884', date: '12 Feb, 2026', total: 1250000, status: 'Entregado', icon: <Truck size={18} className="text-emerald-500" /> },
    { id: 'GA-2026-X772', date: '05 Feb, 2026', total: 320000, status: 'Cancelado', icon: <Clock size={18} className="text-red-400" /> },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      showToast('Perfil actualizado con éxito');
    } catch (error: any) {
      showToast(error.message || 'Error al actualizar perfil', 'error');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
        showToast('Dirección actualizada con éxito');
      } else {
        await createAddress(addressForm);
        showToast('Dirección agregada con éxito');
      }
      resetAddressForm();
    } catch (error: any) {
      showToast(error.message || 'Error al guardar dirección', 'error');
    }
  };

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
      addressName: addr.label,
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      street: addr.street,
      city: addr.city,
      country: addr.country || 'CO',
      phone: addr.phone || '',
      province: addr.province || '',
      postalCode: addr.postalCode || ''
    });
    setIsAddingAddress(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAddress(addressToDelete);
      showToast('Dirección eliminada con éxito');
      setAddressToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Error al eliminar dirección', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Navbar />
        <div className="text-center space-y-4 pt-44">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent animate-spin mx-auto rounded-full"></div>
          <Typography variant="detail" className="block font-black uppercase tracking-widest text-slate-400">Verificando Cuenta...</Typography>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <Typography variant="h1" className="text-5xl mb-16 border-b-4 border-slate-900 pb-8 inline-block uppercase font-black">Mi Perfil</Typography>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-1">
            {MENU_ITEMS.map((item: any) => (
              item.href ? (
                <Link key={item.id} href={item.href} className="flex items-center gap-4 px-6 py-5 border border-transparent transition-all hover:bg-white hover:border-slate-100 text-slate-500">
                  {item.icon}
                  <Typography variant="h4" className="text-[10px] tracking-widest text-left">{item.label}</Typography>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-5 border border-transparent transition-all hover:bg-white hover:border-slate-100 ${activeTab === item.id ? 'bg-white border-slate-100 font-black' : 'text-slate-500'}`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  <Typography variant="h4" className="text-[10px] tracking-widest text-left flex-1">{item.label}</Typography>
                </button>
              )
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-5 text-red-400 hover:bg-white transition-all mt-8 border border-transparent hover:border-red-100 group">
              <div className="shrink-0 group-hover:scale-110 transition-transform"><LogOut size={20} /></div>
              <Typography variant="h4" className="text-[10px] tracking-widest text-red-500 text-left flex-1">Cerrar Sesión</Typography>
            </button>
          </div>

          {/* Content */}
          <div className="lg:col-span-9 space-y-8">
            {activeTab === 'perfil' && (
              <div className="bg-white border border-slate-200 p-8 sm:p-12 space-y-12 shadow-sm">
                <div className="space-y-8">
                  <Typography variant="h3" className="text-2xl border-b border-slate-100 pb-4 uppercase font-black tracking-tighter">Información del Perfil</Typography>
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Typography variant="detail" className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Nombres</Typography>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="w-full border border-slate-100 px-4 py-3 bg-slate-50 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Typography variant="detail" className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Apellidos</Typography>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="w-full border border-slate-100 px-4 py-3 bg-slate-50 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Typography variant="detail" className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Correo Electrónico</Typography>
                        <input type="email" value={user.email} disabled className="w-full border border-slate-100 px-4 py-3 bg-slate-100 text-slate-400 outline-none font-medium text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Typography variant="detail" className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Número de Teléfono</Typography>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full border border-slate-100 px-4 py-3 bg-slate-50 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium text-sm"
                        />
                      </div>
                    </div>
                    <Button type="submit" label="Actualizar Perfil" className="px-12 py-4" />
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'pedidos' && (
              <div className="space-y-6">
                <div className="bg-white p-8 border border-slate-200">
                  <Typography variant="h3" className="text-2xl border-b border-slate-100 pb-4 uppercase font-black tracking-tighter">Historial de Logística</Typography>
                </div>
                
                <div className="space-y-4">
                  {ORDERS.map((order) => (
                    <div key={order.id} className="bg-white border border-slate-200 p-8 flex flex-col sm:flex-row items-center gap-8 hover:border-slate-950 transition-all group">
                      <div className="w-16 h-16 bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        {order.icon}
                      </div>
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                        <div className="space-y-1">
                          <Typography variant="detail" className="text-[10px] text-slate-400">ID Orden</Typography>
                          <Typography variant="h4" className="text-xs font-black">{order.id}</Typography>
                        </div>
                        <div className="space-y-1">
                          <Typography variant="detail" className="text-[10px] text-slate-400">Fecha</Typography>
                          <Typography variant="h4" className="text-xs font-black">{order.date}</Typography>
                        </div>
                        <div className="space-y-1">
                          <Typography variant="detail" className="text-[10px] text-slate-400">Total</Typography>
                          <Typography variant="h4" className="text-xs font-black">${order.total.toLocaleString()}</Typography>
                        </div>
                        <div className="space-y-1">
                          <Typography variant="detail" className="text-[10px] text-slate-400">Estado</Typography>
                          <Typography variant="h4" className="text-[10px] font-black uppercase tracking-widest">{order.status}</Typography>
                        </div>
                      </div>
                      <button className="p-4 hover:bg-slate-900 hover:text-white transition-all border border-slate-100">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'direcciones' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end bg-white p-8 border border-slate-200">
                  <Typography variant="h3" className="text-2xl border-b border-slate-100 pb-4 uppercase font-black tracking-tighter flex-1 text-left">Mis Direcciones</Typography>
                  {!isAddingAddress && (
                    <button
                      onClick={() => {
                        resetAddressForm();
                        setIsAddingAddress(true);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-3 hover:bg-slate-700 transition-all ml-4 mb-4"
                    >
                      Agregar Nueva +
                    </button>
                  )}
                </div>

                {isAddingAddress && (
                  <div className="bg-white border-2 border-slate-900 p-8 space-y-8 animate-in fade-in slide-in-from-top-4">
                    <Typography variant="h4" className="text-sm font-black uppercase">
                      {editingAddressId ? 'Editar Dirección' : 'Nueva Dirección de Envío'}
                    </Typography>
                    <form onSubmit={handleAddAddress} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <Typography variant="detail" className="text-[10px]">Nombre de la Dirección (Ej: Casa, Oficina)</Typography>
                          <input type="text" required value={addressForm.addressName} onChange={e => setAddressForm({ ...addressForm, addressName: e.target.value })} className="pro-input" placeholder="Mi Casa" />
                        </div>
                        <div className="space-y-2">
                          <Typography variant="detail" className="text-[10px]">Nombre</Typography>
                          <input type="text" required value={addressForm.firstName} onChange={e => setAddressForm({ ...addressForm, firstName: e.target.value })} className="pro-input" />
                        </div>
                        <div className="space-y-2">
                          <Typography variant="detail" className="text-[10px]">Apellido</Typography>
                          <input type="text" required value={addressForm.lastName} onChange={e => setAddressForm({ ...addressForm, lastName: e.target.value })} className="pro-input" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Typography variant="detail" className="text-[10px]">Dirección Calle/Carrera</Typography>
                          <input type="text" required value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} className="pro-input" placeholder="Calle 123 #45-67" />
                        </div>
                        <div className="space-y-2">
                          <Typography variant="detail" className="text-[10px]">Ciudad / Municipio</Typography>
                          <input type="text" required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} className="pro-input" />
                        </div>
                        <div className="space-y-2">
                          <Typography variant="detail" className="text-[10px]">Teléfono</Typography>
                          <input type="text" required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} className="pro-input" />
                        </div>
                        <div className="space-y-2">
                          <Typography variant="detail" className="text-[10px]">Departamento / Provincia</Typography>
                          <input type="text" value={addressForm.province} onChange={e => setAddressForm({ ...addressForm, province: e.target.value })} className="pro-input" />
                        </div>
                        <div className="space-y-2">
                          <Typography variant="detail" className="text-[10px]">Código Postal (opcional)</Typography>
                          <input type="text" value={addressForm.postalCode} onChange={e => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="pro-input" placeholder="(Opcional)" />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button type="submit" label={isLoading ? 'Guardando...' : (editingAddressId ? 'Actualizar Dirección' : 'Guardar Dirección')} className="py-4" disabled={isLoading} />
                        <button type="button" onClick={resetAddressForm} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 px-6">Cancelar</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.addresses?.map((addr: any) => (
                    <div key={addr.id} className="bg-white border border-slate-200 p-8 space-y-4 group hover:border-slate-900 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Typography variant="h4" className="text-xs font-black uppercase tracking-tight">{addr.label}</Typography>
                          {addr.isDefault && <span className="bg-slate-900 text-white text-[8px] px-2 py-0.5 font-black uppercase tracking-widest">Favorita</span>}
                        </div>
                        <div className="flex gap-4 sm:opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleEditClick(addr)} className="text-slate-400 hover:text-slate-900 transition-colors uppercase text-[9px] font-black tracking-widest">Editar</button>
                          <button onClick={() => setAddressToDelete(addr.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Typography variant="body" className="text-xs text-slate-500 font-medium">{addr.street}</Typography>
                        {addr.firstName && (
                          <Typography variant="body" className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {addr.firstName} {addr.lastName} • {addr.phone}
                          </Typography>
                        )}
                        <Typography variant="body" className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{addr.city}</Typography>
                      </div>
                    </div>
                  ))}
                  {(!user.addresses || user.addresses.length === 0) && (
                    <div className="md:col-span-2 bg-slate-50 border border-slate-100 p-20 text-center space-y-4">
                      <MapPin size={48} className="mx-auto text-slate-200" />
                      <Typography variant="body" className="text-slate-400 font-medium">No tiene direcciones guardadas aún.</Typography>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ConfirmationModal
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Dirección"
        message="¿Está seguro de que desea eliminar esta dirección? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={isDeleting}
      />

      <Footer />
    </main>
  );
}
