import React from 'react';

export const ProcessingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in">
      <div className="text-center space-y-4 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-[#00C896] rounded-full animate-spin"></div>
        <h3 className="text-xl font-bold tracking-tight text-slate-800">Cifrando y Generando su Orden...</h3>
        <p className="text-sm font-medium text-slate-500">Por favor espere un momento, no cierre la ventana.</p>
      </div>
    </div>
  );
};
