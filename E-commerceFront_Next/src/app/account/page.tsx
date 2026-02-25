'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { User, Package, MapPin, LogOut, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, updateProfile, addAddress, deleteAddress, logout } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('perfil'); // 'perfil' or 'direcciones'
  
  const [profileForm, setProfileForm] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

  const [addressForm, setAddressForm] = React.useState({
    name: '',
    address: '',
    city: '',
    isDefault: false
  });
  const [isAddingAddress, setIsAddingAddress] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || ''
      });
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const MENU_ITEMS = [
    { id: 'perfil', icon: <User size={20} />, label: 'Datos del Perfil' },
    { id: 'pedidos', icon: <Package size={20} />, label: 'Mis Pedidos', href: '/account/orders' },
    { id: 'direcciones', icon: <MapPin size={20} />, label: 'Libreta de Direcciones' },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profileForm);
    alert('Perfil actualizado con éxito');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAddress(addressForm);
    setAddressForm({ name: '', address: '', city: '', isDefault: false });
    setIsAddingAddress(false);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <Typography variant="h1" className="text-5xl mb-16 border-b-4 border-slate-900 pb-8 inline-block uppercase font-black">Mi Perfil</Typography>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Sidebar */}
           <div className="lg:col-span-3 space-y-1">
              {MENU_ITEMS.map((item) => (
                item.href ? (
                  <Link key={item.id} href={item.href} className="flex items-center gap-4 px-6 py-5 border border-transparent transition-all hover:bg-white hover:border-slate-100 text-slate-500">
                    {item.icon}
                    <Typography variant="h4" className="text-[10px] tracking-widest">{item.label}</Typography>
                  </Link>
                ) : (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-5 border border-transparent transition-all hover:bg-white hover:border-slate-100 ${activeTab === item.id ? 'bg-white border-slate-100 font-black' : 'text-slate-500'}`}
                  >
                    {item.icon}
                    <Typography variant="h4" className="text-[10px] tracking-widest">{item.label}</Typography>
                  </button>
                )
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-5 text-red-400 hover:bg-white transition-all mt-8 border border-transparent hover:border-red-100">
                 <LogOut size={20} />
                 <Typography variant="h4" className="text-[10px] tracking-widest text-red-500">Cerrar Sesión</Typography>
              </button>
           </div>

           {/* Content */}
           <div className="lg:col-span-9 space-y-8">
              {activeTab === 'perfil' && (
                <div className="bg-white border border-slate-200 p-8 sm:p-12 space-y-12 shadow-sm">
                   <div className="space-y-8">
                      <Typography variant="h3" className="text-2xl border-b border-slate-100 pb-4">INFORMACIÓN BÁSICA</Typography>
                      <form onSubmit={handleUpdateProfile} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <Typography variant="detail" className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Nombres</Typography>
                              <input 
                                type="text" 
                                value={profileForm.firstName} 
                                onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                                className="w-full border border-slate-100 px-4 py-3 bg-slate-50 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium text-sm" 
                              />
                           </div>
                           <div className="space-y-2">
                              <Typography variant="detail" className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Apellidos</Typography>
                              <input 
                                type="text" 
                                value={profileForm.lastName} 
                                onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
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
                                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                className="w-full border border-slate-100 px-4 py-3 bg-slate-50 outline-none focus:bg-white focus:border-slate-900 transition-all font-medium text-sm" 
                              />
                           </div>
                        </div>
                        <Button type="submit" label="Actualizar Perfil" className="px-12 py-4" />
                      </form>
                   </div>
                </div>
              )}

              {activeTab === 'direcciones' && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center bg-white p-8 border border-slate-200">
                      <Typography variant="h3" className="text-2xl">MIS DIRECCIONES</Typography>
                      {!isAddingAddress && (
                        <button 
                          onClick={() => setIsAddingAddress(true)}
                          className="text-xs font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-3 hover:bg-slate-700 transition-all"
                        >
                          Agregar Nueva +
                        </button>
                      )}
                   </div>

                   {isAddingAddress && (
                     <div className="bg-white border-2 border-slate-900 p-8 space-y-8 animate-in fade-in slide-in-from-top-4">
                        <Typography variant="h4" className="text-sm font-black uppercase">Nueva Dirección de Envío</Typography>
                        <form onSubmit={handleAddAddress} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2 md:col-span-2">
                                 <Typography variant="detail" className="text-[10px]">Nombre (Ej: Casa, Oficina)</Typography>
                                 <input type="text" required value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="pro-input" />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                 <Typography variant="detail" className="text-[10px]">Dirección Completa</Typography>
                                 <input type="text" required value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="pro-input" />
                              </div>
                              <div className="space-y-2">
                                 <Typography variant="detail" className="text-[10px]">Ciudad / Municipio</Typography>
                                 <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="pro-input" />
                              </div>
                              <div className="flex items-center gap-3 pt-6">
                                 <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-5 h-5 accent-slate-900" />
                                 <label htmlFor="isDefault" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Marcar como predeterminada</label>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <Button type="submit" label="Guardar Dirección" className="py-4" />
                              <button type="button" onClick={() => setIsAddingAddress(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 px-6">Cancelar</button>
                           </div>
                        </form>
                     </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.addresses?.map((addr) => (
                        <div key={addr.id} className="bg-white border border-slate-200 p-8 space-y-4 group hover:border-slate-900 transition-all">
                           <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                 <Typography variant="h4" className="text-xs font-black uppercase tracking-tight">{addr.name}</Typography>
                                 {addr.isDefault && <span className="bg-slate-900 text-white text-[8px] px-2 py-0.5 font-black uppercase tracking-widest">Favorita</span>}
                              </div>
                              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                 <button onClick={() => deleteAddress(addr.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                              </div>
                           </div>
                           <div className="space-y-1">
                              <Typography variant="body" className="text-xs text-slate-500 font-medium">{addr.address}</Typography>
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
      <Footer />
    </main>
  );
}
