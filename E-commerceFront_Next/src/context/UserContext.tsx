'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCurrentCustomer,
  createCustomerAddress,
  listCustomerAddresses,
  deleteCustomerAddress,
  updateCustomerAddress,
  updateCustomer as updateCustomerService,
  sendOtp as sendOtpService,
  verifyOtp as verifyOtpService,
  requestPasswordReset as requestPasswordResetService,
  updatePasswordWithToken as updatePasswordWithTokenService,
  type RegisterData,
  type LoginData,
  type CustomerData
} from '@/services/medusa';

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  country: string;
  province?: string;
  postalCode?: string;
  apartment?: string;
  isDefault: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  isLoggedIn: boolean;
  addresses: Address[];
  createdAt?: string;
  updatedAt?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<{ verified: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) => Promise<void>;
  clearError: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (email: string, token: string, password: string) => Promise<void>;
  createAddress: (data: CreateAddressInput) => Promise<void>;
  listAddresses: () => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  updateAddress: (
    id: string,
    data: CreateAddressInput
  ) => Promise<void>;
}

interface CreateAddressInput {
  addressName: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  province?: string;
  postalCode?: string;
  phone?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);


/**
 * Convert Medusa CustomerData to User format
 */
function customerToUser(customer: CustomerData): User {
  const addresses: Address[] = (customer.addresses || []).map(addr => ({
    id: addr.id,
    label:
      (addr as any).address_name ||
      (addr.metadata?.label as string) ||
      "Dirección",
    street: addr.address_1 || "",
    city: addr.city || "",
    country: addr.country_code || "",
    province: addr.province || "",
    postalCode: addr.postal_code || "",
    apartment: addr.address_2 || "",
    isDefault: false, // opcional: mejorar luego
    firstName: addr.first_name || "",
    lastName: addr.last_name || "",
    phone: addr.phone || "",
  }));

  return {
    id: customer.id,
    name: `${customer.first_name} ${customer.last_name}`,
    email: customer.email,
    phone: customer.phone || "",
    firstName: customer.first_name,
    lastName: customer.last_name,
    isLoggedIn: true,
    addresses,
    createdAt: customer.created_at,
    updatedAt: customer.updated_at,
  };
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const customer = await getCurrentCustomer();

        if (customer) {
          setUser(customerToUser(customer));
        }
      } catch (err) {
        console.error('Session check failed:', err);
        // Don't set error for session check failures
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { customer, token } = await loginCustomer(data);


      localStorage.setItem("auth_token", token);

      setUser(customerToUser(customer));
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      const customer = await registerCustomer(data);

      // After registration, login automatically
      await login({ email: data.email, password: data.password });
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await sendOtpService(email);
    } catch (err: any) {
      setError(err.message || 'Error al enviar código');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      setError(null);
      return await verifyOtpService(email, code);
    } catch (err: any) {
      setError(err.message || 'Código inválido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) => {
    try {
      setIsLoading(true);
      setError(null);

      const updateData: any = {};
      if (data.firstName) updateData.first_name = data.firstName;
      if (data.lastName) updateData.last_name = data.lastName;
      if (data.phone !== undefined) updateData.phone = data.phone;

      const customer = await updateCustomerService(updateData);
      setUser(customerToUser(customer));
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createAddress = async (data: CreateAddressInput) => {
    try {
      setIsLoading(true);
      setError(null);

      await createCustomerAddress({
        address_name: data.addressName,
        first_name: data.firstName,
        last_name: data.lastName,
        address_1: data.street,
        city: data.city,
        country_code: data.country.toLowerCase(),
        province: data.province,
        postal_code: data.postalCode,
        phone: data.phone,
      });

      await listAddresses(); // 🔥 sincronización real

    } catch (err: any) {
      setError(err.message || "Error al crear dirección");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const listAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await listCustomerAddresses();
      if (response.customer) {
        setUser(customerToUser(response.customer));
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar direcciones");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (
    id: string,
    data: CreateAddressInput
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      await updateCustomerAddress(id, {
        address_name: data.addressName,
        first_name: data.firstName,
        last_name: data.lastName,
        address_1: data.street,
        city: data.city,
        country_code: data.country.toLowerCase(),
        province: data.province,
        postal_code: data.postalCode,
        phone: data.phone,
      });

      // 🔥 sincronizamos
      await listAddresses();

    } catch (err: any) {
      setError(err.message || "Error al actualizar dirección");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const deleteAddress = async (addressId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await deleteCustomerAddress(addressId);

      // 🔥 Opción profesional: refrescar desde backend
      await listAddresses();

      // ⚡ Alternativa rápida (optimista):
      // setUser(prev =>
      //   prev
      //     ? { ...prev, addresses: prev.addresses.filter(a => a.id !== addressId) }
      //     : prev
      // );

    } catch (err: any) {
      setError(err.message || "Error al eliminar dirección");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await requestPasswordResetService(email);

    } catch (err: any) {
      // 🔒 Nunca exponemos si el correo existe
      setError("Si el correo existe, recibirás instrucciones para restablecer tu contraseña");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, token: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await updatePasswordWithTokenService({
        email,
        token,
        password,
      });

    } catch (err: any) {
      setError(err.message || "No se pudo actualizar la contraseña");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      register,
      sendOtp,
      verifyOtp,
      logout,
      updateProfile,
      createAddress,
      listAddresses,
      deleteAddress,
      updateAddress,
      clearError,
      requestPasswordReset,
      resetPassword
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

