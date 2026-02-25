'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses?: Address[];
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
  signupStep1: (email: string) => Promise<void>;
  signupStep2: (code: string) => Promise<boolean>;
  signupStep3: (data: Partial<User> & { password?: string }) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ladynail-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const saveUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('ladynail-user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('ladynail-user');
    }
  };

  const login = async (credentials: Record<string, unknown>) => {
    const mockUser: User = {
      id: '1',
      firstName: 'Invitado',
      lastName: 'Premium',
      email: (credentials.email as string) || 'invitado@example.com',
      phone: '+57 321 000 0000',
      addresses: [
        { id: 'addr1', name: 'Oficina Principal', address: 'Parque Industrial Sur, Bloque C-12', city: 'Pasto', isDefault: true }
      ],
      isLoggedIn: true,
    };
    saveUser(mockUser);
  };

  const logout = async () => {
    saveUser(null);
  };

  const signupStep1 = async (email: string) => {
    setTempEmail(email);
    console.log(`Sending code to ${email}... (Mock: 123456)`);
  };

  const signupStep2 = async (code: string) => {
    return code === '123456';
  };

  const signupStep3 = async (data: Partial<User> & { password?: string }) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: tempEmail || '',
      phone: data.phone || '',
      addresses: [],
      isLoggedIn: true,
    };
    saveUser(newUser);
    setTempEmail(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      saveUser({ ...user, ...data });
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress = { ...address, id: Math.random().toString(36).substr(2, 9) };
      saveUser({ ...user, addresses: [...(user.addresses || []), newAddress] });
    }
  };

  const updateAddress = async (id: string, address: Partial<Address>) => {
    if (user && user.addresses) {
      const updated = user.addresses.map(a => a.id === id ? { ...a, ...address } : a);
      saveUser({ ...user, addresses: updated });
    }
  };

  const deleteAddress = async (id: string) => {
    if (user && user.addresses) {
      saveUser({ ...user, addresses: user.addresses.filter(a => a.id !== id) });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      signupStep1, 
      signupStep2, 
      signupStep3,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};
