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
  brand?: { id: string; name: string };
  warranty?: { id: string; name: string };
  usage?: { id: string; name: string };
  shipping?: { id: string; name: string };
}


interface CompareContextType {
  compareItems: CompareItem[];
  addToCompare: (item: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);

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


  const addToCompare = (item: CompareItem) => {
    setCompareItems(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (id: string) => compareItems.some(item => item.id === id);

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
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
