'use client';

import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { Edit2, Check } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useUser();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

  React.useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      showToast('Perfil actualizado con éxito');
      setIsEditing(false);
    } catch (error: any) {
      showToast(error.message || 'Error al actualizar perfil', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="bg-white border border-neutral-200 p-8 sm:p-12 shadow-sm relative overflow-hidden group">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110" />
        
        <div className="relative z-10 space-y-10">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Typography variant="h2" className="text-3xl font-black uppercase tracking-tighter">
                Mi Perfil
              </Typography>
              <div className={`h-1 bg-black transition-all duration-500 ${isEditing ? 'w-full' : 'w-20'}`} />
            </div>
            
            <button
              onClick={() => {
                if (isEditing) {
                  // Reset form to current user values on cancel
                  setProfileForm({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phone: user.phone || ''
                  });
                }
                setIsEditing(!isEditing);
              }}
              className={`w-12 h-12 transition-all duration-300 border flex items-center justify-center group ${
                isEditing 
                ? 'bg-neutral-100 border-neutral-200 text-black hover:bg-black hover:text-white' 
                : 'bg-white border-neutral-200 text-black hover:bg-black hover:text-white shadow-sm'
              }`}
            >
              {isEditing ? (
                <Check size={20} className="transition-transform group-hover:scale-110" />
              ) : (
                <Edit2 size={20} className="group-hover:rotate-12 transition-transform" />
              )}
            </button>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-3 group/field relative">
                <Typography variant="detail" className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover/field:text-black transition-colors">
                  Nombres
                </Typography>
                <div className="relative">
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full border-b-2 px-0 py-3 bg-transparent outline-none transition-all font-bold text-base placeholder:text-neutral-200 ${
                      isEditing ? 'border-black focus:border-neutral-400' : 'border-transparent text-neutral-500 cursor-default'
                    }`}
                    placeholder="Tu nombre"
                  />
                  {!isEditing && (
                    <Edit2 size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-200 opacity-0 group-hover/field:opacity-100 transition-all duration-300" />
                  )}
                </div>
              </div>
              
              <div className="space-y-3 group/field relative">
                <Typography variant="detail" className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover/field:text-black transition-colors">
                  Apellidos
                </Typography>
                <div className="relative">
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full border-b-2 px-0 py-3 bg-transparent outline-none transition-all font-bold text-base placeholder:text-neutral-200 ${
                      isEditing ? 'border-black focus:border-neutral-400' : 'border-transparent text-neutral-500 cursor-default'
                    }`}
                    placeholder="Tu apellido"
                  />
                  {!isEditing && (
                    <Edit2 size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-200 opacity-0 group-hover/field:opacity-100 transition-all duration-300" />
                  )}
                </div>
              </div>

              <div className="space-y-3 opacity-60">
                <Typography variant="detail" className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  Correo Electrónico
                </Typography>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled 
                  className="w-full border-b-2 border-neutral-100 px-0 py-3 bg-transparent text-neutral-400 outline-none font-bold text-base cursor-not-allowed" 
                />
              </div>

              <div className="space-y-3 group/field relative">
                <Typography variant="detail" className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover/field:text-black transition-colors">
                  Número de Teléfono
                </Typography>
                <div className="relative">
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    readOnly={!isEditing}
                    className={`w-full border-b-2 px-0 py-3 bg-transparent outline-none transition-all font-bold text-base placeholder:text-neutral-200 ${
                      isEditing ? 'border-black focus:border-neutral-400' : 'border-transparent text-neutral-500 cursor-default'
                    }`}
                    placeholder="Ej: +57 300 000 0000"
                  />
                  {!isEditing && (
                    <Edit2 size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-200 opacity-0 group-hover/field:opacity-100 transition-all duration-300" />
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="pt-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <Button 
                  type="submit" 
                  label="Guardar Todo" 
                  className="px-12 py-4 shadow-xl shadow-black/10 hover:shadow-black/20 active:scale-95 transition-all bg-black text-white" 
                />
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors px-4"
                >
                  Descartar
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="bg-black text-white p-8 border border-black flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <Typography variant="h4" className="text-white text-sm font-black uppercase tracking-widest">
            Seguridad de la Cuenta
          </Typography>
          <Typography variant="body" className="text-neutral-400 text-xs">
            Tu información está protegida bajo estándares de encriptación bancaria.
          </Typography>
        </div>
        <div className="px-6 py-2 border border-neutral-700 text-[10px] font-bold uppercase tracking-widest">
          Estado: Verificado
        </div>
      </div>
    </div>
  );
}
