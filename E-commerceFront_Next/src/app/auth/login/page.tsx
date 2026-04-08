"use client";

import React from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, user, isLoading, error, clearError } = useUser();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const [redirectPath, setRedirectPath] = React.useState("/account");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
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
      console.error("Login failed", error);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-32 sm:pt-44">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white border border-slate-100 shadow-[0_40px_80px_rgba(0,0,0,0.05)] overflow-hidden rounded-3xl">
          {/* Visual Brand Side */}
          <div className="hidden lg:block relative bg-slate-950 p-16 text-white space-y-12">
            <div className="absolute inset-0 opacity-40 transition-all">
              <Image
                src="https://res.cloudinary.com/dqky6oqrd/image/upload/w_1600,h_900,c_fill,f_auto,q_auto/v1775582390/rdohll6ztxp9bgcykhjq.jpg"
                fill
                className="object-cover saturate-80 grayscale-[20%]"
                alt="Login Visual"
              />
            </div>
            <div className="relative z-10 space-y-8 drop-shadow-md">
              <Typography
                variant="detail"
                className="text-white/80 font-bold tracking-widest"
              >
                Acceso
              </Typography>
              <Typography
                variant="h2"
                className="text-5xl text-white font-black tracking-tighter leading-none"
              >
                TU ESPACIO <br /> PROFESIONAL
              </Typography>
              <div className="pt-24 space-y-6">
                <div className="flex items-center gap-4 text-white/90">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                    Seguridad Garantizada
                  </span>
                </div>
                <Typography
                  variant="body"
                  className="text-white/80 text-xs font-light max-w-xs leading-relaxed"
                >
                  Bienvenido a Ladynail Shop. Gestione sus pedidos, direcciones
                  y perfil en un solo lugar.
                </Typography>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 sm:p-12 md:p-16 space-y-12 bg-white flex flex-col justify-center">
            <div className="space-y-3">
              <Typography variant="h3" className="text-3xl text-black font-black uppercase tracking-tighter">
                BIENVENIDO
              </Typography>
              <Typography variant="body" className="text-neutral-400 text-sm font-medium">
                Ingrese sus credenciales para continuar.
              </Typography>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100">
                  <Typography
                    variant="small"
                    className="text-red-600 text-[10px] font-black uppercase tracking-widest"
                  >
                    {error}
                  </Typography>
                </div>
              )}
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Typography
                    variant="detail"
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400"
                  >
                    Email Corporativo
                  </Typography>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-100 px-6 py-5 outline-none focus:bg-white focus:border-black transition-all text-sm font-bold uppercase tracking-tight placeholder:text-neutral-200"
                    placeholder="admin@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <Typography
                      variant="detail"
                      className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400"
                    >
                      Contraseña
                    </Typography>
                    <Link
                      href="/auth/forgot-password"
                      className="text-[9px] font-black uppercase tracking-widest text-neutral-300 hover:text-black transition-colors"
                    >
                      ¿Olvidó su clave?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-100 px-6 py-5 outline-none focus:bg-white focus:border-black transition-all text-sm font-bold pr-14 placeholder:text-neutral-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-neutral-400 hover:text-black transition-colors z-10"
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-6">
                <Button
                  type="submit"
                  label={isLoading ? "AUTENTICANDO..." : "INICIAR SESIÓN"}
                  className="w-full py-6 bg-black text-white hover:bg-neutral-800 transition-all font-black text-[10px] tracking-[0.3em]"
                  disabled={isLoading}
                />
                <div className="pt-10 border-t border-neutral-100 text-center space-y-6">
                  <Typography
                    variant="small"
                    className="text-neutral-400 text-[9px] font-black uppercase tracking-widest"
                  >
                    ¿AÚN NO TIENE UNA CUENTA?
                  </Typography>
                  <Link
                    href="/auth/signup"
                    className="inline-block text-center text-[10px] font-black uppercase tracking-[0.2em] text-black border-b-2 border-black pb-1 hover:opacity-50 transition-opacity"
                  >
                    CREAR CUENTA PROFESIONAL
                  </Link>
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
