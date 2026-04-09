'use client';

import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { AccountSidebar } from '@/components/organisms/AccountSidebar';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { Typography } from '@/components/atoms/Typography';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-center space-y-4 pt-44">
          <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mx-auto rounded-full"></div>
          <Typography variant="detail" className="block font-black uppercase tracking-widest text-neutral-400">
            Verificando Cuenta...
          </Typography>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-44 pb-32 px-6 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Persistent Sidebar */}
          <AccountSidebar />

          {/* Dynamic Content Area */}
          <div className="flex-1 w-full min-h-[600px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={typeof window !== 'undefined' ? window.location.pathname : 'server'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
