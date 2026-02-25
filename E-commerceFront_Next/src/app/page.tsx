'use client';

import React from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { HeroSection } from '@/components/organisms/HeroSection';
import { CategoryGrid } from '@/components/organisms/CategoryGrid';
import { FeaturedProducts } from '@/components/organisms/FeaturedProducts';
import { AcademySection } from '@/components/organisms/AcademySection';
import { TrustSection } from '@/components/organisms/TrustSection';
import { LogoCarousel } from '@/components/molecules/LogoCarousel';

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <AcademySection />
      <LogoCarousel />
      <TrustSection />
    </MainLayout>
  );
}
