'use client';

import React from 'react';
import { Typography } from '@/components/atoms/Typography';

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, className = '' }) => {
  return (
    <div className={`p-10 sm:p-14 bg-white border border-slate-100 group hover:bg-black transition-all duration-700 ${className}`}>
      <Typography variant="h3" className="text-6xl sm:text-8xl mb-2 group-hover:text-white transition-colors uppercase font-black tracking-tighter">
        {value}
      </Typography>
      <Typography variant="detail" className="text-slate-400 group-hover:text-white/40 transition-colors tracking-[0.2em]">
        {label}
      </Typography>
    </div>
  );
};
