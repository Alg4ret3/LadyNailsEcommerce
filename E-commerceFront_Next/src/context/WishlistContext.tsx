'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  tags?: string[];
  vendor?: string;
  description?: string;
  category?: string;
  categories?: { id: string; name: string; handle: string }[];
  brand?: { id: string; name: string };
  warranty?: { id: string; name: string };
  usage?: { id: string; name: string };
  shipping?: { id: string; name: string };
}

interface WishlistContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string) => boolean;
  totalFavorites: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

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


  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) {
        return prev.filter(f => f.id !== item.id);
      } else {
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
    }}>
      {children}
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
