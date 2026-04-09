import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { CheckCircle2, Plus, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepHeader } from './StepHeader';
import { CountryCodeSelect } from '@/components/molecules/CountryCodeSelect';
import { ColombiaLocationSelect } from '@/components/molecules/ColombiaLocationSelect';
import { PasswordStrength } from '@/components/molecules/PasswordStrength';
import { formatNameInput, formatPhoneInput } from '@/utils/validations';
import { CheckoutStep } from '../hooks/useCheckoutFlow';

interface DeliveryAddressSectionProps {
  user: any;
  checkoutStep: CheckoutStep;
  setCheckoutStep: (step: CheckoutStep) => void;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  isAddingAddress: boolean;
  setIsAddingAddress: (val: boolean) => void;
  newAddressFormData: any;
  setNewAddressFormData: (data: any) => void;
  guestFormData: any;
  setGuestFormData: (data: any) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  isUpdatingCart: boolean;
  isUserLoading: boolean;
  isNewAddressValid: boolean;
  isGuestFormValid: boolean;
  handleSaveNewAddress: (e: React.FormEvent) => void;
  handleLoggedContinue: () => void;
  handleGuestStep3: (e: React.FormEvent) => void;
  localError: string;
  setLocalError: (err: string) => void;
}

export const DeliveryAddressSection: React.FC<DeliveryAddressSectionProps> = ({
  user,
  checkoutStep,
  setCheckoutStep,
  selectedAddressId,
  setSelectedAddressId,
  isAddingAddress,
  setIsAddingAddress,
  newAddressFormData,
  setNewAddressFormData,
  guestFormData,
  setGuestFormData,
  countryCode,
  setCountryCode,
  isUpdatingCart,
  isUserLoading,
  isNewAddressValid,
  isGuestFormValid,
  handleSaveNewAddress,
  handleLoggedContinue,
  handleGuestStep3,
  localError,
  setLocalError
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const isActive = checkoutStep === 'SHIP_INFO';
  const isCompleted = ['SHIPPING', 'PAYMENT'].includes(checkoutStep);
  const isLocked = ['AUTH_CHOICE', 'EMAIL_VERIFY'].includes(checkoutStep);

  return (
    <div className={`bg-white border ${isActive ? 'border-slate-900 shadow-lg' : 'border-slate-200'} p-8 sm:p-12 space-y-12 shadow-sm transition-all ${isLocked ? 'opacity-40 pointer-events-none' : ''}`}>
      <StepHeader
        number={user ? '2' : '3'}
        title="Dirección de Entrega"
        isActive={isActive}
        isCompleted={isCompleted}
        onBack={() => setCheckoutStep(user ? 'AUTH_CHOICE' : 'EMAIL_VERIFY')}
        onEdit={() => setCheckoutStep('SHIP_INFO')}
      />

      {isActive && (
        <AnimatePresence mode="wait">
          {user ? (
            <motion.div key="logged-in" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr: any) => (
                  <button
                    key={addr.id}
                    onClick={() => { setSelectedAddressId(addr.id); setLocalError(''); }}
                    className={`p-6 border-2 text-left transition-all space-y-2 group outline-none ${selectedAddressId === addr.id ? 'border-slate-900 bg-white ring-1 ring-slate-900/5' : 'border-slate-100 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-start">
                      <Typography variant="h4" className="text-[10px] uppercase font-black tracking-widest">{addr.label}</Typography>
                      {selectedAddressId === addr.id && <CheckCircle2 size={16} className="text-slate-900" />}
                    </div>
                    <Typography variant="body" className="text-xs text-slate-500 line-clamp-1">{addr.street}</Typography>
                    <Typography variant="body" className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{addr.city}, {addr.province}</Typography>
                  </button>
                ))}

                {user.addresses.length < 3 ? (
                  <button
                    onClick={() => {
                      setIsAddingAddress(true);
                      setNewAddressFormData({
                        ...newAddressFormData,
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        phone: user?.phone?.replace('+57', '') || ''
                      });
                    }}
                    className="p-6 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"
                  >
                    <Plus size={20} />
                    <Typography variant="h4" className="text-[10px] uppercase font-black tracking-widest">Agregar Nueva Dirección</Typography>
                  </button>
                ) : (
                  <div className="p-6 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300 cursor-not-allowed">
                    <Lock size={20} className="opacity-50" />
                    <Typography variant="h4" className="text-[10px] uppercase font-black tracking-widest text-center">Límite de 3 direcciones alcanzado</Typography>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {isAddingAddress && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white p-8 border border-slate-900 space-y-8 rounded-lg"
                  >
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                      <Typography variant="h4" className="text-sm font-black uppercase tracking-widest">Nueva Dirección de Entrega</Typography>
                      <button onClick={() => setIsAddingAddress(false)} className="text-slate-400 hover:text-slate-900">
                        <Plus className="rotate-45" size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveNewAddress} className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Etiqueta (Ej: Casa, Oficina) *</Typography>
                          <input type="text" className="pro-input" required value={newAddressFormData.label} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, label: e.target.value })} placeholder="Casa" />
                        </div>
                        <div className="space-y-2">
                          <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nombres *</Typography>
                          <input type="text" className="pro-input" required value={newAddressFormData.firstName} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, firstName: formatNameInput(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                          <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Apellidos *</Typography>
                          <input type="text" className="pro-input" required value={newAddressFormData.lastName} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, lastName: formatNameInput(e.target.value) })} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Teléfono Móvil *</Typography>
                          <div className="flex flex-col md:flex-row gap-0">
                            <div className="w-full md:w-32"><CountryCodeSelect value={countryCode} onChange={setCountryCode} /></div>
                            <input type="text" className="pro-input flex-1" required value={newAddressFormData.phone} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, phone: formatPhoneInput(e.target.value) })} placeholder="300 000 0000" />
                          </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Dirección de Entrega *</Typography>
                          <input type="text" className="pro-input" required minLength={10} value={newAddressFormData.street} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, street: e.target.value })} placeholder="Calle 123 #45-67" />
                        </div>
                        <ColombiaLocationSelect
                          departamento={newAddressFormData.province}
                          ciudad={newAddressFormData.city}
                          onDepartamentoChange={(val) => setNewAddressFormData({ ...newAddressFormData, province: val })}
                          onCiudadChange={(val) => setNewAddressFormData({ ...newAddressFormData, city: val })}
                        />
                         <div className="space-y-2 md:col-span-2">
                          <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Código Postal (opcional)</Typography>
                          <input type="text" className="pro-input" value={newAddressFormData.postalCode} onChange={(e) => setNewAddressFormData({ ...newAddressFormData, postalCode: e.target.value })} placeholder="(Opcional)" />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <Button type="submit" label={isUpdatingCart ? "Guardando..." : "Guardar Dirección"} className="flex-1 py-5" disabled={isUpdatingCart || !isNewAddressValid} />
                        <button type="button" onClick={() => setIsAddingAddress(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 border border-slate-200 hover:border-slate-900 transition-all">Cancelar</button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isAddingAddress && (
                <Button
                  label={isUpdatingCart ? "Sincronizando..." : "Continuar al Envío"}
                  onClick={handleLoggedContinue}
                  className="w-full py-5"
                  disabled={isUpdatingCart}
                />
              )}
            </motion.div>
          ) : (
            <motion.div key="guest" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
              <form onSubmit={handleGuestStep3} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Nombres</Typography>
                    <input type="text" className="pro-input" required value={guestFormData.firstName} onChange={(e) => setGuestFormData({ ...guestFormData, firstName: formatNameInput(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Apellidos</Typography>
                    <input type="text" className="pro-input" required value={guestFormData.lastName} onChange={(e) => setGuestFormData({ ...guestFormData, lastName: formatNameInput(e.target.value) })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Teléfono Móvil</Typography>
                    <div className="flex flex-col md:flex-row gap-0">
                      <div className="w-full md:w-32"><CountryCodeSelect value={countryCode} onChange={setCountryCode} /></div>
                      <input type="text" className="pro-input flex-1" required value={guestFormData.phone} onChange={(e) => setGuestFormData({ ...guestFormData, phone: formatPhoneInput(e.target.value) })} placeholder="300 000 0000" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Dirección de Entrega Principal</Typography>
                    <input type="text" className="pro-input" required minLength={10} value={guestFormData.street} onChange={(e) => setGuestFormData({ ...guestFormData, street: e.target.value })} placeholder="Calle 123 #45-67" />
                  </div>
                  <ColombiaLocationSelect
                    departamento={guestFormData.province}
                    ciudad={guestFormData.city}
                    onDepartamentoChange={(val) => setGuestFormData({ ...guestFormData, province: val })}
                    onCiudadChange={(val) => setGuestFormData({ ...guestFormData, city: val })}
                  />
                  <div className="space-y-2 md:col-span-2">
                    <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Código Postal (opcional)</Typography>
                    <input type="text" className="pro-input" value={guestFormData.postalCode} onChange={(e) => setGuestFormData({ ...guestFormData, postalCode: e.target.value })} placeholder="(Opcional)" />
                  </div>
                  <div className="space-y-2 md:col-span-2 border-t border-slate-100 pt-8 mt-4">
                    <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Cree una Contraseña para sus futuros pedidos</Typography>
                    <div className="relative group">
                      <input type={showPassword ? "text" : "password"} className="pro-input pr-12 group-focus-within:border-slate-900" required value={guestFormData.password} onChange={(e) => setGuestFormData({ ...guestFormData, password: e.target.value })} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors z-10 p-1">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <PasswordStrength password={guestFormData.password} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Typography variant="detail" className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Confirmar Contraseña</Typography>
                    <div className="relative group">
                      <input type={showConfirmPassword ? "text" : "password"} className="pro-input pr-12 group-focus-within:border-slate-900" required value={guestFormData.confirmPassword} onChange={(e) => setGuestFormData({ ...guestFormData, confirmPassword: e.target.value })} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors z-10 p-1">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-6">
                  <Button type="submit" label={isUpdatingCart ? "Creando Cuenta..." : "Registrar y Continuar al Envío"} className="w-full py-5" disabled={isUserLoading || isUpdatingCart || !isGuestFormValid} />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
