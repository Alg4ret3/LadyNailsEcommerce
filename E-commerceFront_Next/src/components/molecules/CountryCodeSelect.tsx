'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

const COUNTRIES: CountryCode[] = [
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+1', flag: '🇺🇸', name: 'EE.UU.' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
}

export const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCountry = COUNTRIES.find(c => c.code === value) || COUNTRIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest hover:border-slate-900 transition-colors group"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{selectedCountry.flag}</span>
          <span>{selectedCountry.code}</span>
        </span>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 group-hover:text-slate-900 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 shadow-2xl max-h-60 overflow-y-auto no-scrollbar"
          >
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${value === country.code ? 'text-slate-950 bg-slate-50' : 'text-slate-500'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg leading-none">{country.flag}</span>
                  <div className="flex flex-col items-start leading-tight">
                    <span>{country.name}</span>
                    <span className="text-[8px] text-slate-400">{country.code}</span>
                  </div>
                </div>
                {value === country.code && <Check size={12} className="text-slate-900" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
