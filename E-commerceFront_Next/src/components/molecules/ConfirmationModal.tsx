'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Overlay } from '@/components/atoms/Overlay';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'primary',
    isLoading = false,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <Overlay isOpen={isOpen} onClose={onClose} className="z-[100]" />
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white max-w-md w-full shadow-2xl overflow-hidden pointer-events-auto border border-slate-100"
                        >
                            <div className="p-8 sm:p-10 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 ${variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-900'}`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <Typography variant="h3" className="text-2xl uppercase tracking-tighter">
                                        {title}
                                    </Typography>
                                    <Typography variant="body" className="text-slate-400 text-sm leading-relaxed">
                                        {message}
                                    </Typography>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        variant={variant === 'danger' ? 'primary' : 'primary'}
                                        className={`flex-1 py-4 ${variant === 'danger' ? 'bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700' : ''}`}
                                    >
                                        {isLoading ? 'Cargando...' : confirmLabel}
                                    </Button>
                                    <button
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-100"
                                    >
                                        {cancelLabel}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
