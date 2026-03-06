'use client';

import React from 'react';
import { getDepartamentos, getCiudadesByDepartamento } from '@/lib/colombiaLocation';
import { Typography } from '@/components/atoms/Typography';

interface Props {
  departamento: string;
  ciudad: string;
  onDepartamentoChange: (value: string) => void;
  onCiudadChange: (value: string) => void;
  errorDepartamento?: string;
  errorCiudad?: string;
}

export function ColombiaLocationSelect({
  departamento,
  ciudad,
  onDepartamentoChange,
  onCiudadChange,
  errorDepartamento,
  errorCiudad,
}: Props) {
  const departamentos = getDepartamentos();
  const ciudades = departamento ? getCiudadesByDepartamento(departamento) : [];

  const handleDepartamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDepartamentoChange(e.target.value);
    onCiudadChange('');
  };

  return (
    <>
      <div className="space-y-2">
        <Typography variant="detail" className="text-[10px]">Departamento / Provincia *</Typography>
        <select
          value={departamento}
          onChange={handleDepartamentoChange}
          className={`pro-input ${errorDepartamento ? 'border-red-500' : ''}`}
        >
          <option value="" disabled>Seleccionar departamento…</option>
          {departamentos.map((dep) => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
        {errorDepartamento && (
          <p className="text-[10px] text-red-500 mt-1">{errorDepartamento}</p>
        )}
      </div>

      <div className="space-y-2">
        <Typography variant="detail" className="text-[10px]">Ciudad / Municipio *</Typography>
        <select
          value={ciudad}
          onChange={(e) => onCiudadChange(e.target.value)}
          disabled={!departamento}
          className={`pro-input ${errorCiudad ? 'border-red-500' : ''} disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
        >
          <option value="">
            {departamento ? 'Seleccionar ciudad…' : 'Primero elige departamento'}
          </option>
          {ciudades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errorCiudad && (
          <p className="text-[10px] text-red-500 mt-1">{errorCiudad}</p>
        )}
      </div>
    </>
  );
}
