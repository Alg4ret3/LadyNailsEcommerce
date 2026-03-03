'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import { getCategories } from "@/services/medusa/categories"

export interface Category {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
}

interface CategoriesContextType {
  categories: Category[]
  loading: boolean
}

const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
  loading: true,
})

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { product_categories } = await getCategories({
          parent_category_id: "null", // solo categorías raíz
        })

        setCategories(product_categories)
      } catch (error) {
        console.error("Error cargando categorías", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <CategoriesContext.Provider value={{ categories, loading }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategories = () => useContext(CategoriesContext)