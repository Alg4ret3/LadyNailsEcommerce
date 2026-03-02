import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  label?: string;
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-200 active:scale-[0.98] border shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';

  const variants = {
    primary: 'bg-primary text-white border-primary hover:bg-slate-950 hover:shadow-md',
    secondary: 'bg-white text-primary border-primary hover:bg-slate-50',
    outline: 'bg-transparent text-foreground border-border hover:border-foreground hover:bg-slate-50',
    ghost: 'bg-transparent text-foreground border-transparent hover:bg-muted shadow-none',
  };

  const content = label || children;

  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`} disabled={disabled}>
      {content}
    </button>
  );
};

export default Button;
