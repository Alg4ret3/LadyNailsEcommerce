'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const requirements = [
    { label: 'Mínimo 8 caracteres', regex: /.{8,}/ },
    { label: 'Al menos una mayúscula', regex: /[A-Z]/ },
    { label: 'Al menos un número', regex: /[0-9]/ },
    { label: 'Un carácter especial (@$!%*?&)', regex: /[@$!%*?&#]/ },
  ];

  const metRequirements = requirements.filter(req => req.regex.test(password)).length;
  const strengthPercentage = (metRequirements / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage <= 25) return 'bg-red-500';
    if (strengthPercentage <= 50) return 'bg-orange-500';
    if (strengthPercentage <= 75) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (strengthPercentage <= 25) return 'Muy Débil';
    if (strengthPercentage <= 50) return 'Débil';
    if (strengthPercentage <= 75) return 'Media';
    return 'Fuerte';
  };

  return (
    <div className="space-y-4 mt-2">
      <div className="flex items-center justify-between mb-1">
        <Typography variant="detail" className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
          Seguridad: <span className={metRequirements > 0 ? 'text-slate-900' : ''}>{getStrengthLabel()}</span>
        </Typography>
        <Typography variant="detail" className="text-[10px] font-bold text-slate-400">
          {metRequirements}/{requirements.length}
        </Typography>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${getStrengthColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${strengthPercentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Requirements List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {requirements.map((req, index) => {
          const isMet = req.regex.test(password);
          return (
            <motion.div 
              key={index}
              initial={false}
              animate={{ opacity: isMet ? 1 : 0.5 }}
              className="flex items-center gap-2"
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${isMet ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                {isMet ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isMet ? 'text-slate-900' : 'text-slate-400'}`}>
                {req.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
