import { ShopLayout } from '@/components/templates/ShopLayout';
import { getAllProducts } from '@/services/medusa/products';


interface Props {
  products: any[];
}

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <ShopLayout
      title="CATÁLOGO PRODUCTOS"
      subtitle="Tendencias en Belleza & Cuidado"
      products={products}
    />
  );
}
