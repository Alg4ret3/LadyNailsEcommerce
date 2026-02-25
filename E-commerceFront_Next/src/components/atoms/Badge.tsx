'use client';

import React from 'react';
interface BadgeProps {
  label?: string;
  variant?: 'default' | 'outline' | 'accent' | 'success' | 'danger';
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', className = '', children }) => {
  const variants = {
    default: 'bg-slate-50 text-slate-400 border-slate-100',
    outline: 'bg-transparent text-slate-400 border-slate-200',
    accent: 'bg-slate-900 text-white border-slate-900',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    danger: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className={`inline-block px-3 py-1 border text-[9px] font-bold uppercase tracking-[0.2em] rounded-full sm:rounded-none ${variants[variant]} ${className}`}>
      {children || label}
    </div>
  );
};
