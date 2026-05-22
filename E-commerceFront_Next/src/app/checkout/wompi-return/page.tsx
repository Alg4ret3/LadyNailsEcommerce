'use client';

import React, { Suspense } from 'react';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { WompiReturnContent } from './WompiReturnContent';

export default function WompiReturnPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-white relative">
        <ProcessingOverlay />
      </main>
    }>
      <WompiReturnContent />
    </Suspense>
  );
}
