'use client'

import React, { createContext, useContext } from "react"
import { useCategories as useCategoriesQuery, type Category } from "@/hooks/useCategories"

export type { Category }

interface CategoriesContextType {
  categories: Category[]
  loading: boolean
  getCategoryByHandle: (handle: string) => Category | undefined
  getRootCategories: () => Category[]
}

const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
  loading: true,
  getCategoryByHandle: () => undefined,
  getRootCategories: () => [],
})

export const CategoriesProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { categories, isLoading, getCategoryByHandle, getRootCategories } =
    useCategoriesQuery()

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading: isLoading,
        getCategoryByHandle,
        getRootCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategories = () => useContext(CategoriesContext)

