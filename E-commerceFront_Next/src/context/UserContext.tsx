'use client';

import React, { createContext, useContext, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser, useCustomerAddresses, CURRENT_USER_QUERY_KEY } from '@/hooks/useCurrentUser';
import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
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
  const queryClient = useQueryClient();

  // ── Sesión actual via TanStack Query ──
  const { data: currentCustomer, isLoading: isSessionLoading } = useCurrentUser();

  // ── Direcciones via TanStack Query Mutations ──
  const { 
    createAddress: createAddressMutation, 
    updateAddress: updateAddressMutation, 
    deleteAddress: deleteAddressMutation,
    isPending: isAddressPending 
  } = useCustomerAddresses();

  // Derivamos el user desde la query — sin estado local duplicado
  const user: User | null = currentCustomer ? customerToUser(currentCustomer) : null;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // isLoading combina: sesión inicial cargando O mutaciones en curso
  const combinedLoading = isSessionLoading || isLoading || isAddressPending;


  const login = React.useCallback(async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { token } = await loginCustomer(data);

      localStorage.setItem("auth_token", token);

      // Invalida la query para que TanStack refetchee el customer actualizado
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    } catch (err: Error | any) {
      setError(err.message || "Error desconocido");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);


  const register = React.useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      await registerCustomer(data);

      // After registration, login automatically
      await login({ email: data.email, password: data.password });
    } catch (err: Error | any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const sendOtp = React.useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await sendOtpService(email);
    } catch (err: Error | any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = React.useCallback(async (email: string, code: string) => {
    try {
      setIsLoading(true);
      setError(null);
      return await verifyOtpService(email, code);
    } catch (err: Error | any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);


  const logout = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      localStorage.removeItem("auth_token");
      // Limpiamos el caché del usuario — la UI reacciona automáticamente
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const updateProfile = React.useCallback(async (data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) => {
    try {
      setIsLoading(true);
      setError(null);

      const updateData: any = {};
      if (data.firstName) updateData.first_name = data.firstName;
      if (data.lastName) updateData.last_name = data.lastName;
      if (data.phone !== undefined) updateData.phone = data.phone;

      await updateCustomerService(updateData);
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    } catch (err: Error | any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const createAddress = React.useCallback(async (data: CreateAddressInput) => {
    try {
      setError(null);

      // Restriction: Only allow up to 3 addresses
      if (user && (user.addresses?.length || 0) >= 3) {
        throw new Error('Solo se permiten hasta 3 direcciones guardadas.');
      }

      await createAddressMutation({
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
      // La invalidación en el hook se encarga de refrescar el usuario automaticamente
    } catch (err: Error | any) {
      setError(err.message);
      throw err;
    }
  }, [createAddressMutation, user]);

  const updateAddress = React.useCallback(async (
    id: string,
    data: CreateAddressInput
  ) => {
    try {
      setError(null);

      await updateAddressMutation({
        id,
        data: {
          address_name: data.addressName,
          first_name: data.firstName,
          last_name: data.lastName,
          address_1: data.street,
          city: data.city,
          country_code: data.country.toLowerCase(),
          province: data.province,
          postal_code: data.postalCode,
          phone: data.phone,
        }
      });
    } catch (err: Error | any) {
      setError(err.message);
      throw err;
    }
  }, [updateAddressMutation]);

  const deleteAddress = React.useCallback(async (addressId: string) => {
    try {
      setError(null);
      await deleteAddressMutation(addressId);
    } catch (err: Error | any) {
      setError(err.message);
      throw err;
    }
  }, [deleteAddressMutation]);

  // listAddresses stays for legacy compatibility if called, but now it just invalidates
  const listAddresses = React.useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
  }, [queryClient]);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const requestPasswordReset = React.useCallback(async (email: string) => {
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
  }, []);

  const resetPassword = React.useCallback(async (email: string, token: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await updatePasswordWithTokenService({
        email,
        token,
        password,
      });

    } catch (err: Error | any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      isLoading: combinedLoading,
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
