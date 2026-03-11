'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CompareItem {
  id: string;
  name: string;
  price: number;
  image: string;
  tags: string[];
  slug: string;
  vendor: string;
  rating?: number;
  specs?: Record<string, string>;
  description?: string;
  category?: string;
  categories?: { id: string; name: string; handle: string }[];
}

import { Toast } from '@/components/atoms/Toast';

interface CompareContextType {
  compareItems: CompareItem[];
  addToCompare: (item: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  toast: { message: string, isOpen: boolean };
  hideToast: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [toast, setToast] = useState({ message: '', isOpen: false });

  useEffect(() => {
    const saved = localStorage.getItem('ladynail-compare');
    if (saved) {
      try {
        setCompareItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load comparison items', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ladynail-compare', JSON.stringify(compareItems));
  }, [compareItems]);

  const showToast = (message: string) => {
    setToast({ message, isOpen: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  const addToCompare = (item: CompareItem) => {
    setCompareItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      if (prev.length >= 4) {
        showToast("Máximo 4 productos para comparar.");
        return prev;
      }
      showToast(`${item.name} añadido a comparar.`);
      return [...prev, item];
    });
  };

  const removeFromCompare = (id: string) => {
    const item = compareItems.find(i => i.id === id);
    setCompareItems(prev => prev.filter(i => i.id !== id));
    if (item) showToast(`${item.name} eliminado de comparar.`);
  };

  const clearCompare = () => {
    setCompareItems([]);
    showToast("Comparación vaciada.");
  };

  const isInCompare = (id: string) => compareItems.some(item => item.id === id);

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare, isInCompare, toast, hideToast }}>
      {children}
      <Toast 
        message={toast.message} 
        isOpen={toast.isOpen} 
        onClose={hideToast} 
      />
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
