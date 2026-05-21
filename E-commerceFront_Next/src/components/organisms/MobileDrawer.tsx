'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ROUTES, COMPANY_INFO } from '@/constants';
import { Instagram, Facebook, TikTok } from '@/components/icons';
import type { Category } from '@/context/CategoriesContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  expandedSections: string[];
  onToggleSection: (section: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  expandedSections,
  onToggleSection,
}) => {
  const isCatalogoExpanded = expandedSections.includes('categories_root');
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevExpandedSectionsRef = useRef<string[]>([]);

  useEffect(() => {
    const newlyExpanded = expandedSections.filter(
      (section) => section.startsWith('cat_') && !prevExpandedSectionsRef.current.includes(section),
    );

    if (newlyExpanded.length > 0) {
      const sectionKey = newlyExpanded[0];
      const target = categoryRefs.current[sectionKey];

      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        });
      }
    }

    prevExpandedSectionsRef.current = expandedSections;
  }, [expandedSections]);

  const staticItems = [
    { name: 'Inicio', href: ROUTES.home },
    { name: 'Favoritos', href: ROUTES.favorites },
    { name: 'Pedidos', href: ROUTES.login },
    { name: 'Contacto', href: ROUTES.contact },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[96px] bg-black/5 z-30 lg:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-0 right-0 top-[96px] bg-white z-40 lg:hidden border-b border-slate-100 flex flex-col shadow-xl max-h-[calc(100dvh-96px)] overflow-y-auto"
          >
            {/* Links */}
            <nav className="flex flex-col pt-6 pb-4">
              {/* Inicio */}
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 }}
              >
                <Link
                  href={staticItems[0].href}
                  onClick={onClose}
                  className="flex items-center px-10 py-4 group transition-colors"
                >
                  <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-slate-950 transition-colors">
                    {staticItems[0].name}
                  </span>
                </Link>
              </motion.div>

              {/* Catálogo — expandable section */}
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 }}
              >
                {/* Toggle header */}
                <button
                  onClick={() => onToggleSection('categories_root')}
                  className="w-full flex items-center justify-between px-10 py-4 group transition-colors"
                >
                    <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-slate-950 transition-colors">
                    Catálogo
                  </span>
                  <motion.span
                    animate={{ rotate: isCatalogoExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                  >
                    <ChevronDown size={14} strokeWidth={2.5} className="text-slate-950 transition-colors" />
                  </motion.span>
                </button>

                {/* Category branches */}
                <AnimatePresence>
                  {isCatalogoExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                      className="overflow-hidden"
                    >
                      {/* Scrollable category container */}
                      <div className="max-h-[50vh] overflow-y-auto overscroll-contain relative scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {/* "Ver todo" link */}
                        <Link
                          href={ROUTES.shop}
                          onClick={onClose}
                          className="flex items-center pl-14 pr-10 py-3 group transition-colors sticky top-0 bg-white z-[1] border-b border-slate-50"
                        >
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950 transition-colors">
                            Ver todo el catálogo
                          </span>
                        </Link>

                        {/* Root categories */}
                        {categories.map((cat) => {
                          const sectionKey = `cat_${cat.id}`;
                          const hasChildren = cat.category_children && cat.category_children.length > 0;
                          const isExpanded = expandedSections.includes(sectionKey);

                          return (
                            <div key={cat.id} ref={(el) => { categoryRefs.current[sectionKey] = el; }}>
                              {/* Root category row */}
                              <div className="flex items-center">
                                <Link
                                  href={`/shop/${cat.handle}`}
                                  onClick={onClose}
                                  className="flex-1 flex items-center pl-14 pr-4 py-3 group transition-colors"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 mr-3 shrink-0" />
                                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-950 transition-colors">
                                    {cat.name}
                                  </span>
                                </Link>

                                {hasChildren && (
                                  <button
                                    onClick={() => onToggleSection(`cat_${cat.id}`)}
                                    className="px-4 py-3 mr-6"
                                  >
                                    <motion.span
                                      animate={{ rotate: isExpanded ? 180 : 0 }}
                                      transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
                                      className="block"
                                    >
                                      <ChevronDown size={12} strokeWidth={2.5} className="text-slate-950 transition-colors" />
                                    </motion.span>
                                  </button>
                                )}
                              </div>

                              {/* Subcategories */}
                              <AnimatePresence>
                                {hasChildren && isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
                                    className="overflow-hidden bg-white"
                                  >
                                    {cat.category_children!.map((sub) => (
                                      <Link
                                        key={sub.id}
                                        href={`/shop/${sub.handle}`}
                                        onClick={onClose}
                                        className="flex items-center pl-[4.5rem] pr-10 py-2.5 group transition-colors"
                                      >
                                        <span className="flex gap-1 items-center mr-3 shrink-0">
                                          <span className="w-1 h-1 rounded-full bg-slate-950" />
                                          <span className="w-1 h-1 rounded-full bg-slate-950" />
                                        </span>
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-950 transition-colors">
                                          {sub.name}
                                        </span>
                                      </Link>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                      {/* Fade indicator at bottom of scroll area */}
                      <div className="h-4 bg-gradient-to-t from-white to-transparent pointer-events-none -mt-4 relative z-[2]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Rest of static items */}
              {staticItems.slice(1).map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.09 + 0.03 * idx }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center px-10 py-4 group transition-colors"
                  >
                    <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-slate-950 transition-colors">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Subtle Footer with same networks as Main Footer */}
            <div className="mx-10 mb-8 pt-8 border-t border-slate-50 flex justify-between items-center">
              <div className="flex gap-6">
                <Link href={COMPANY_INFO.social.instagram.url} target="_blank" className="text-slate-950 hover:text-slate-950 transition-colors">
                  <Instagram size={18} />
                </Link>
                <Link href={COMPANY_INFO.social.facebook.url} target="_blank" className="text-slate-950 hover:text-slate-950 transition-colors">
                  <Facebook size={18} />
                </Link>
                <Link href={COMPANY_INFO.social.tiktok.url} target="_blank" className="text-slate-950 hover:text-slate-950 transition-colors">
                  <TikTok size={18} />
                </Link>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-950">
                {COMPANY_INFO.name}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
