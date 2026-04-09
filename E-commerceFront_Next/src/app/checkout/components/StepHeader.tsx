import React from 'react';
import { Typography } from '@/components/atoms/Typography';
import { CheckCircle2 } from 'lucide-react';

interface StepHeaderProps {
  number: string | number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  onEdit?: () => void;
  onBack?: () => void;
  subtitle?: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  number,
  title,
  isCompleted,
  isActive,
  onEdit,
  onBack,
  subtitle
}) => {
  return (
    <div className={`flex items-center justify-between ${isActive ? 'border-b border-slate-100 pb-6 mb-10' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-black ${
          isActive || isCompleted ? 'bg-slate-900 text-white' : 'bg-slate-200 text-white'
        }`}>
          {isCompleted ? <CheckCircle2 size={18} /> : number}
        </div>
        <Typography variant="h3" className="text-2xl uppercase font-black tracking-tighter">
          {title}
        </Typography>
      </div>

      {isActive && onBack && (
        <button
          onClick={onBack}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-4"
        >
          ← Volver
        </button>
      )}

      {isCompleted && !isActive && (
        <div className="flex items-center gap-4">
          {subtitle && (
            <Typography variant="detail" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-400">
              {subtitle}
            </Typography>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors underline underline-offset-4"
            >
              Editar
            </button>
          )}
        </div>
      )}
    </div>
  );
};
