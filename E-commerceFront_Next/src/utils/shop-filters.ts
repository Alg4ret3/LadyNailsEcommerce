import { MedusaProduct } from "@/services/medusa/products";

export interface FilterState {
  query: string;
  priceRange: number;
  selectedCategories: string[];
  selectedBrands: string[];
}

export const filterProducts = (products: MedusaProduct[], state: FilterState): MedusaProduct[] => {
  const { query, priceRange, selectedCategories, selectedBrands } = state;

  return products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(query.toLowerCase());

    const matchesPrice =
      (p.variants?.[0]?.prices?.[0]?.amount ?? 0) <= priceRange;

    const matchesCategory = 
      selectedCategories.length === 0 || 
      p.categories?.some((c) => selectedCategories.includes(c.id));

    const matchesBrand = 
      selectedBrands.length === 0 || 
      selectedBrands.includes(p.brand?.name || '') ||
      p.tags?.some((t) => t.value.startsWith('marca:') && selectedBrands.includes(t.value.replace('marca:', '')));

    return matchesSearch && matchesPrice && matchesCategory && matchesBrand;
  });
};
