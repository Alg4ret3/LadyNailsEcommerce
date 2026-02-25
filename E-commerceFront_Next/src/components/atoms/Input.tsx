'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ icon, label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors">
            {icon}
          </div>
        )}
        <input 
          className={`w-full bg-slate-50 border border-slate-50 ${icon ? 'pl-12' : 'px-6'} pr-6 py-4 rounded-2xl outline-none focus:bg-white focus:border-slate-200 transition-all text-sm font-medium placeholder:text-slate-300 ${error ? 'border-red-200 bg-red-50/10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter ml-1">{error}</span>}
    </div>
  );
};
