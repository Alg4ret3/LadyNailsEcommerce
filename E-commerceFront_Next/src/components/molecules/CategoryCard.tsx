'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';

interface CategoryCardProps {
  name: string;
  img: string;
  count: string;
  href?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, img, count, href = '/shop' }) => {
  return (
    <Link href={href} className="group relative h-[500px] overflow-hidden border-r last:border-0 border-slate-200 block">
      <Image 
        src={img} 
        fill 
        alt={name} 
        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-slate-900/60 transition-opacity" />
      <div className="absolute inset-0 p-12 flex flex-col justify-between">
        <Typography variant="detail" className="text-white/60">{count}</Typography>
        <div>
          <Typography variant="h3" className="text-white text-4xl mb-4">{name}</Typography>
          <div className="inline-flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest border-b border-white pb-1 group-hover:gap-4 transition-all">
            Ver Línea <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};
