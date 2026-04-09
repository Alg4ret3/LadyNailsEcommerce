import { getAllProducts } from '@/services/medusa/products';
import { ProductGrid } from '@/components/organisms/ProductGrid';
import { Suspense } from 'react';

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <Suspense fallback={<div>Cargando catálogo...</div>}>
      <ProductGrid
        title="CATÁLOGO PRODUCTOS"
        subtitle="Tendencias en Belleza & Cuidado"
        initialProducts={products}
      />
    </Suspense>
  );
}
