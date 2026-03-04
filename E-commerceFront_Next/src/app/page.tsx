'use client';

import React from 'react';
import { MainLayout } from '@/components/templates/MainLayout';
import { HeroSection } from '@/components/organisms/HeroSection';
import { SocialBanner } from '@/components/molecules/SocialBanner';
import { CategoryGrid } from '@/components/organisms/CategoryGrid';
import { FeaturedProducts } from '@/components/organisms/FeaturedProducts';
import { AcademySection, LocationInfo } from '@/components/organisms/AcademySection';
import { TrustSection } from '@/components/organisms/TrustSection';
import { LogoCarousel } from '@/components/molecules/LogoCarousel';

const ACADEMY_LOCATIONS: LocationInfo[] = [
  {
    id: 'pasto-nails',
    name: 'Sede Pasto - Nails Academy',
    title: 'CERTIFICACIÓN PROFESIONAL\nEN UÑAS',
    description: 'Domina las técnicas más avanzadas en uñas (acrílico, gel, nail art) en nuestra sede principal de Pasto, Nariño.',
    features: [
      "Técnicas de Nail Art Internacional",
      "Certificación Profesional Avalada",
      "Clases 100% Prácticas y Personalizadas"
    ],
    mainImage: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1000",
    detailImages: [
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1000",
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=1000"
    ],
    whatsappNumber: "573000000000"
  },
  {
    id: 'pasto-barber',
    name: 'Sede Pasto - Barber Academy',
    title: 'DOMINA EL ARTE\nDE LA BARBERÍA',
    description: 'Conviértete en un barbero profesional con nuestros cursos especializados en cortes modernos, fade y cuidado masculino.',
    features: [
      "Técnicas de Fade y Degradado",
      "Uso de Herramientas de Alta Gama",
      "Práctica Real con Modelos Reales"
    ],
    mainImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000",
    detailImages: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1000"
    ],
    whatsappNumber: "573111111111"
  }
];

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <SocialBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <AcademySection locations={ACADEMY_LOCATIONS} />
      <LogoCarousel />
      <TrustSection />
    </MainLayout>
  );
}
