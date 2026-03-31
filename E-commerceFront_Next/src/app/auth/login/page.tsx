'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, user, isLoading, error, clearError } = useUser();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const [redirectPath, setRedirectPath] = React.useState('/account');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        setRedirectPath(decodeURIComponent(redirect));
      }
    }
  }, []);
  // const [isLoadingState, setIsLoadingState] = React.useState(false); // Eliminado para usar el del contexto

  React.useEffect(() => {
    if (!isLoading && user?.isLoggedIn) {
      router.push(redirectPath);
    }
  }, [user, isLoading, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push(redirectPath);
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Login failed', error);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-32 sm:pt-44">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white border border-slate-100 shadow-[0_40px_80px_rgba(0,0,0,0.05)] overflow-hidden rounded-3xl">
          {/* Visual Brand Side */}
          <div className="hidden lg:block relative bg-slate-950 p-16 text-white space-y-12">
            <div className="absolute inset-0 opacity-40">
              <Image src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1000" fill className="object-cover" alt="Login Visual" />
            </div>
            <div className="relative z-10 space-y-8">
              <Typography variant="detail" className="text-slate-500">Acceso</Typography>
              <Typography variant="h2" className="text-5xl text-white tracking-tighter leading-none">TU ESPACIO <br /> PROFESIONAL</Typography>
              <div className="pt-24 space-y-6">
                <div className="flex items-center gap-4 text-white/40">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Seguridad Garantizada</span>
                </div>
                <Typography variant="body" className="text-white/40 text-xs font-light max-w-xs leading-relaxed">
                  Bienvenido a Ladynail Shop. Gestione sus pedidos, direcciones y perfil en un solo lugar.
                </Typography>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 sm:p-12 md:p-16 space-y-12 bg-white flex flex-col justify-center">
            <div className="space-y-3">
              <Typography variant="h3" className="text-3xl text-slate-950">BIENVENIDO</Typography>
              <Typography variant="body" className="text-slate-400 text-sm">Ingrese sus credenciales para continuar.</Typography>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <Typography variant="small" className="text-red-600 text-[10px] font-bold uppercase tracking-wider">
                    {error}
                  </Typography>
                </div>
              )}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Typography variant="detail" className="text-[10px] text-slate-400">Email</Typography>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 outline-none focus:bg-white focus:border-slate-950 transition-all text-sm font-medium"
                    placeholder="admin@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <Typography variant="detail" className="text-[10px] text-slate-400">Contraseña</Typography>
                    <Link href="/auth/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-950 transition-colors opacity-40">¿Olvidó su clave?</Link>
                  </div>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 px-6 py-4 outline-none focus:bg-white focus:border-slate-950 transition-all text-sm font-medium pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 transition-colors z-10 p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <Link href="/auth/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-950 transition-colors">¿Olvidó su clave?</Link>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <Button type="submit" label={isLoading ? "Ingresando..." : "Iniciar Sesión"} className="w-full py-5" disabled={isLoading} />
                <div className="pt-8 border-t border-slate-50 text-center space-y-4">
                  <Typography variant="small" className="text-slate-400 text-[10px]">¿No tiene una cuenta?</Typography>
                  <Link href="/auth/signup" className="block text-center text-[10px] font-black uppercase tracking-widest text-slate-950 hover:underline">Registrarse Aquí</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
