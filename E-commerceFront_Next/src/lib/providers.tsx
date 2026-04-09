'use client'

import React, { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { makeQueryClient } from '@/lib/query-client'
import { ThemeProvider } from '@/context/ThemeContext'
import { CartProvider } from '@/context/CartContext'
import { UserProvider } from '@/context/UserContext'
import { ToastProvider } from '@/context/ToastContext'
import { CompareProvider } from '@/context/CompareContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { CategoriesProvider } from '@/context/CategoriesContext'

export function Providers({ children }: { children: React.ReactNode }) {
  // useState garantiza que el mismo QueryClient se reutiliza en re-renders
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <CategoriesProvider>
        <ThemeProvider>
          <UserProvider>
            <ToastProvider>
              <CartProvider>
                <WishlistProvider>
                  <CompareProvider>
                    {children}
                  </CompareProvider>
                </WishlistProvider>
              </CartProvider>
            </ToastProvider>
          </UserProvider>
        </ThemeProvider>
      </CategoriesProvider>
      {/* Solo visible en desarrollo */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
