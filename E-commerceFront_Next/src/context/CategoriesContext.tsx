'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import { getCategories } from "@/services/medusa/categories"

export interface Category {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
  category_children?: Category[]
}

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
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { product_categories } = await getCategories()

        // La API devuelve raíces (con children) Y los hijos sueltos
        // Solo necesitamos las raíces — ya traen sus hijos en category_children
        const onlyRoots = product_categories.filter(
          c => c.parent_category_id === null
        )

        setCategories(onlyRoots)
      } catch (error) {
        console.error("Error cargando categorías", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getCategoryByHandle = (handle: string) =>
    categories.find((c) => c.handle === handle)

  const getRootCategories = () => categories

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        getCategoryByHandle,
        getRootCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategories = () => useContext(CategoriesContext)
