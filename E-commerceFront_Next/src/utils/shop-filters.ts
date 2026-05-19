import { MedusaProduct } from "@/services/medusa/products";

export interface FilterState {
  query: string;
  selectedCategories: string[];
  selectedBrands: string[];
}

export const filterProducts = (products: MedusaProduct[], state: FilterState): MedusaProduct[] => {
  const { query, selectedCategories, selectedBrands } = state;

  return products.filter((p) => {
    const queryLower = query.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(queryLower) ||
      (p.description && p.description.toLowerCase().includes(queryLower));

    const matchesCategory = 
      selectedCategories.length === 0 || 
      p.categories?.some((c) => selectedCategories.includes(c.id) || selectedCategories.includes(c.handle));

    const matchesBrand = 
      selectedBrands.length === 0 || 
      selectedBrands.includes(p.brand?.name || '') ||
      p.tags?.some((t) => t.value.startsWith('marca:') && selectedBrands.includes(t.value.replace('marca:', '')));

    return matchesSearch && matchesCategory && matchesBrand;
  });
};
