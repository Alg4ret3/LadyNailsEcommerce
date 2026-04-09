'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Suspense } from 'react';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const { resetPassword, isLoading, error: contextError, clearError } = useUser();

    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [localError, setLocalError] = React.useState('');

    // Password Validations
    const validations = {
        length: password.length >= 6,
        hasNumber: /\d/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        match: password === confirmPassword && password !== ''
    };

    const isFormValid = Object.values(validations).every(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || !email || !token) {
            if (!email || !token) setLocalError('Falta información de recuperación (email/token).');
            return;
        }

        try {
            setLocalError('');
            clearError();
            await resetPassword(email, token, password);
            setIsSubmitted(true);
        } catch (err) {
            console.error('Reset password error:', err);
        }
    };

    if (!email || !token) {
        return (
            <section className="pt-44 pb-32 px-6 flex items-center justify-center text-center">
                <div className="max-w-md w-full bg-white border border-slate-200 p-12 space-y-6 shadow-xl">
                    <XCircle size={48} className="mx-auto text-red-500" />
                    <Typography variant="h3">Enlace Inválido</Typography>
                    <Typography variant="body" className="text-slate-400">
                        El enlace de recuperación parece estar incompleto o es inválido.
                    </Typography>
                    <Link href="/auth/forgot-password">
                        <Button label="Solicitar Nuevo Enlace" className="w-full" />
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="pt-44 pb-32 px-6 flex items-center justify-center">
            <div className="max-w-md w-full bg-white border border-slate-200 p-8 sm:p-12 space-y-12 shadow-xl">
                {!isSubmitted ? (
                    <>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-100 mx-auto flex items-center justify-center text-slate-900 border border-slate-200">
                                <ShieldCheck size={24} />
                            </div>
                            <Typography variant="h2" className="text-3xl uppercase tracking-tighter sm:text-4xl">
                                Nueva Contraseña
                            </Typography>
                            <Typography variant="body" className="text-slate-400 text-sm">
                                Establezca su nueva clave de acceso para <b>{email}</b>.
                            </Typography>
                        </div>

                        {(contextError || localError) && (
                            <div className="bg-red-50 text-red-500 p-4 border border-red-100 text-xs font-bold uppercase tracking-wider text-center">
                                {contextError || localError}
                            </div>
                        )}

                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Typography variant="detail">Nueva Contraseña</Typography>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white border border-slate-200 px-4 py-4 outline-none focus:border-slate-900 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="space-y-2 text-[10px] uppercase font-bold tracking-widest grid grid-cols-2 gap-2">
                                    <div className={`flex items-center gap-2 ${validations.length ? 'text-green-600' : 'text-slate-300'}`}>
                                        <CheckCircle2 size={12} /> 6+ Caracteres
                                    </div>
                                    <div className={`flex items-center gap-2 ${validations.hasNumber ? 'text-green-600' : 'text-slate-300'}`}>
                                        <CheckCircle2 size={12} /> Un Número
                                    </div>
                                    <div className={`flex items-center gap-2 ${validations.hasUpper ? 'text-green-600' : 'text-slate-300'}`}>
                                        <CheckCircle2 size={12} /> Mayúscula
                                    </div>
                                    <div className={`flex items-center gap-2 ${validations.hasLower ? 'text-green-600' : 'text-slate-300'}`}>
                                        <CheckCircle2 size={12} /> Minúscula
                                    </div>
                                    <div className={`flex items-center gap-2 ${validations.hasSymbol ? 'text-green-600' : 'text-slate-300'}`}>
                                        <CheckCircle2 size={12} /> Símbolo
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Typography variant="detail">Confirmar Contraseña</Typography>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white border border-slate-200 px-4 py-4 outline-none focus:border-slate-900 transition-colors"
                                        placeholder="••••••••"
                                    />
                                    {confirmPassword && !validations.match && (
                                        <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">Las contraseñas no coinciden</span>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                label={isLoading ? "Actualizando..." : "Cambiar Contraseña"}
                                className="w-full py-5"
                                disabled={isLoading || !isFormValid}
                            />
                        </form>
                    </>
                ) : (
                    <div className="text-center space-y-8 py-4">
                        <div className="w-20 h-20 bg-green-50 text-green-600 mx-auto flex items-center justify-center rounded-full border border-green-100 shadow-sm">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="space-y-4">
                            <Typography variant="h3" className="text-2xl uppercase tracking-tighter">¡Contraseña Cambiada!</Typography>
                            <Typography variant="body" className="text-slate-600 text-sm leading-relaxed">
                                Su acceso ha sido actualizado correctamente. Ya puede iniciar sesión con su nueva contraseña.
                            </Typography>
                        </div>
                        <div className="pt-4">
                            <Link href="/auth/login">
                                <Button label="Ir al Login" className="w-full" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Suspense fallback={
                <div className="min-h-[60vh] flex items-center justify-center pt-44">
                    <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent animate-spin rounded-full"></div>
                </div>
            }>
                <ResetPasswordContent />
            </Suspense>
            <Footer />
        </main>
    );
}
