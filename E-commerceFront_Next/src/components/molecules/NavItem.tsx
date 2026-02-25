'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface NavItemProps {
  name: string;
  href: string;
  hasSubcategories?: boolean;
  active?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  type?: 'desktop' | 'mobile';
  icon?: React.ReactNode;
}

export const NavItem: React.FC<NavItemProps> = ({ 
  name, 
  href, 
  hasSubcategories, 
  active, 
  onMouseEnter, 
  onMouseLeave, 
  className = '',
  type = 'desktop',
  icon
}) => {
  if (type === 'mobile') {
    return (
      <Link 
        href={href} 
        className={`flex items-center gap-4 py-4 px-4 hover:bg-slate-50 rounded-2xl transition-all group ${className}`}
      >
        <div className={`w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all`}>
          {icon}
        </div>
        <span className="text-sm font-black uppercase tracking-widest text-slate-900">{name}</span>
      </Link>
    );
  }

  return (
    <div 
      className={`relative py-8 ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link 
        href={href} 
        className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5 ${active ? 'text-slate-950' : 'text-slate-400 hover:text-slate-950'}`}
      >
        {name}
        {hasSubcategories && (
          <ChevronDown 
            size={10} 
            className={`transition-transform duration-300 ${active ? 'rotate-180' : ''}`} 
          />
        )}
      </Link>
    </div>
  );
};
