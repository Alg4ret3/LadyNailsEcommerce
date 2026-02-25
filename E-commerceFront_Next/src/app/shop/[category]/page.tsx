'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ShopLayout } from '@/components/templates/ShopLayout';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  // Format title for display
  const title = categorySlug.replace(/-/g, ' ').toUpperCase();

  return (
    <ShopLayout 
      title={title}
      subtitle="Categoría Seleccionada"
      initialCategory={categorySlug}
    />
  );
}
