import { ShopLayout } from '@/components/templates/ShopLayout';
import { getProductsByCategoryHandle } from '@/services/medusa/products';

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const categorySlug = decodeURIComponent(category); // 🔥 FIX

  const products = await getProductsByCategoryHandle(categorySlug);

  const title = categorySlug.replace(/-/g, ' ').toUpperCase();

  return (
    <ShopLayout
      title={title}
      subtitle="Categoría Seleccionada"
      initialCategory={categorySlug}
      products={products}
    />
  );
}
