import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
  const baseStyles = 'inline-flex items-center justify-center px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] border shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:translate-y-0 relative overflow-hidden focus:outline-none';

  const variants = {
    primary: 'bg-slate-900 text-white border-slate-900',
    secondary: 'bg-white text-slate-900 border-slate-900',
    outline: 'bg-transparent text-slate-900 border-slate-200',
    ghost: 'bg-transparent text-slate-900 border-transparent shadow-none',
  };

  // Hover/Tap animations
  const motionProps = {
    whileHover: disabled ? {} : { 
      scale: 1.02, 
      backgroundColor: variant === 'primary' ? 'rgba(0,0,0,1)' : 'rgba(248,250,252,1)', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' 
    },
    whileTap: disabled ? {} : { scale: 0.98, y: 1 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  };

  const content = label || children;

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');
    
    if (isExternal) {
      return (
        <motion.a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`${baseStyles} ${variants[variant]} ${className}`}
          {...motionProps}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <Link href={href} passHref legacyBehavior>
        <motion.a 
          className={`${baseStyles} ${variants[variant]} ${className}`}
          {...motionProps}
        >
          {content}
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={disabled}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default Button;
