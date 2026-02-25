'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Typography } from '@/components/atoms/Typography';

interface PolicyProps {
  title: string;
  lastUpdated: string;
  sections: { title: string; content: string }[];
}

const PolicyLayout: React.FC<PolicyProps> = ({ title, lastUpdated, sections }) => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-48 pb-32 px-6 sm:px-12 max-w-4xl mx-auto">
      <header className="mb-24 text-center">
        <Typography variant="small" className="text-primary font-bold mb-6 block">Legales</Typography>
        <Typography variant="h1" className="text-4xl sm:text-6xl mb-8">{title}</Typography>
        <Typography variant="small" className="text-neutral-400">Última actualización: {lastUpdated}</Typography>
      </header>

      <div className="space-y-16">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <Typography variant="h4" className="text-sm font-bold tracking-widest">{section.title}</Typography>
            <Typography variant="body" className="text-secondary leading-relaxed font-light">
              {section.content}
            </Typography>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </main>
);

export default PolicyLayout;
