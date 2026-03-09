'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Toast } from '@/components/atoms/Toast';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  tags: string[];
  vendor?: string;
}

interface WishlistContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
  totalFavorites: number;
  toast: { message: string, isOpen: boolean };
  hideToast: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [toast, setToast] = useState({ message: '', isOpen: false });

  // Hydrate favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('ladynail-wishlist');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('ladynail-wishlist', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = (message: string) => {
    setToast({ message, isOpen: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) {
        showToast(`${item.name} eliminado de favoritos.`);
        return prev.filter(f => f.id !== item.id);
      } else {
        showToast(`${item.name} añadido a favoritos.`);
        return [...prev, item];
      }
    });
  };

  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  const totalFavorites = favorites.length;

  return (
    <WishlistContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      totalFavorites,
      toast,
      hideToast
    }}>
      {children}
      <Toast 
        message={toast.message} 
        isOpen={toast.isOpen} 
        onClose={hideToast} 
      />
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
