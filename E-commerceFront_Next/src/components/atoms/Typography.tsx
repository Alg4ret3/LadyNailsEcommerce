import React from 'react';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'detail';
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  className = '',
  as,
}) => {
  const variants = {
    h1: 'text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter leading-[1.1]',
    h2: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-snug',
    h3: 'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-snug',
    h4: 'text-base sm:text-lg md:text-xl font-bold tracking-tight',
    body: 'text-[13px] sm:text-[14px] font-normal leading-relaxed text-foreground/70',
    detail: 'text-[9px] font-bold uppercase tracking-[0.25em] text-foreground/40',
    small: 'text-[8px] font-bold uppercase tracking-widest text-foreground/50',
  };

  const Component = (as || (variant.startsWith('h') ? variant : ['small', 'detail'].includes(variant) ? 'span' : 'p')) as React.ElementType;
  const variantClass = variants[variant] || variants.body;

  return (
    <Component className={`${variantClass} ${className}`}>
      {children}
    </Component>
  );
};
