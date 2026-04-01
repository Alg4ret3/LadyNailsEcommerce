import { getProductsByCategoryHandle } from '@/services/medusa/products';
import { ProductGrid } from '@/components/organisms/ProductGrid';
import { Suspense } from 'react';

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  
  // Decoding the category slug because dynamic route params might be encoded
  const categorySlug = decodeURIComponent(category);

  // Server-side fetch of initial products for this category
  const products = await getProductsByCategoryHandle(categorySlug);

  // Dynamic title based on category slug
  const title = categorySlug.replace(/-/g, ' ').toUpperCase();

  return (
    <Suspense fallback={<div>Cargando categoría...</div>}>
      <ProductGrid 
        title={title}
        subtitle="Explora nuestra selección"
        initialProducts={products}
      />
    </Suspense>
  );
}
