"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft, X, Instagram, Facebook } from "lucide-react";
import { TikTok } from "@/components/icons";
import { COMPANY_INFO } from "@/constants";

interface SubCategory {
  id: string;
  name: string;
  handle: string;
}

interface Category {
  id: string;
  name: string;
  handle: string;
  category_children?: SubCategory[];
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

type Screen =
  | {
      id: "main";
      title: "Menu";
    }
  | {
      id: string;
      title: string;
      items: SubCategory[];
    };

const drawerTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
};

const screenTransition = {
  duration: 0.18,
  ease: "easeOut",
};

const staticLinks = [
  { name: "Inicio", href: "/" },
  { name: "Favoritos", href: "/favorites" },
  { name: "Sobre Nosotros", href: "/nosotros" },
  { name: "Contacto", href: "/contact" },
];

/* -------------------------------------------------------------------------- */
/*                                   ROW                                      */
/* -------------------------------------------------------------------------- */

const Row = memo(function Row({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-between
        border-b
        border-neutral-100
        py-5
        text-left
        active:opacity-60
      "
    >
      {children}
    </button>
  );
});

/* -------------------------------------------------------------------------- */
/*                               MAIN SCREEN                                  */
/* -------------------------------------------------------------------------- */

const MainScreen = memo(function MainScreen({
  categories,
  onClose,
  onOpenCategory,
}: {
  categories: Category[];
  onClose: () => void;
  onOpenCategory: (category: Category) => void;
}) {
  return (
    <div
      className="
        absolute
        inset-0
        overflow-y-auto
        overscroll-contain
        px-6
        pb-10
        pt-4
      "
    >
      {/* STATIC */}
      <div className="flex flex-col">
        {staticLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="
              border-b
              border-neutral-100
              py-5
              active:opacity-60
            "
          >
            <span className="text-[15px] font-medium tracking-tight text-black">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* CATALOG */}
      <div className="pb-2 pt-10">
        <span
          className="
            text-[11px]
            font-bold
            uppercase
            tracking-[0.25em]
            text-neutral-400
          "
        >
          Catálogo
        </span>
      </div>

      <div className="flex flex-col">
        {categories.map((category) => {
          const hasChildren = !!category.category_children?.length;

          if (hasChildren) {
            return (
              <Row key={category.id} onClick={() => onOpenCategory(category)}>
                <span className="text-[15px] font-medium tracking-tight text-black">
                  {category.name}
                </span>

                <ChevronRight size={18} className="text-neutral-300" />
              </Row>
            );
          }

          return (
            <Link
              key={category.id}
              href={`/shop/${category.handle}`}
              onClick={onClose}
              className="
                flex
                items-center
                justify-between
                border-b
                border-neutral-100
                py-5
                active:opacity-60
              "
            >
              <span className="text-[15px] font-medium tracking-tight text-black">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                              CATEGORY SCREEN                               */
/* -------------------------------------------------------------------------- */

const CategoryScreen = memo(function CategoryScreen({
  title,
  items,
  onBack,
  onClose,
}: {
  title: string;
  items: SubCategory[];
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="
        absolute
        inset-0
        overflow-y-auto
        overscroll-contain
        bg-white
      "
    >
      {/* HEADER */}
      <div
        className="
    sticky
    top-0
    z-10
    flex
    items-center
    gap-3
    border-b
    border-neutral-100
    bg-white
    px-6
    py-5
  "
      >
        <button
          onClick={onBack}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            active:opacity-60
          "
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-[15px] font-semibold tracking-tight text-black">
          {title}
        </span>
      </div>

      {/* ITEMS */}
      <div className="px-6">
        <Link
          href="/shop"
          onClick={onClose}
          className="
            flex
            border-b
            border-neutral-100
            py-5
            active:opacity-60
          "
        >
          <span className="text-[14px] text-neutral-500">Ver todo</span>
        </Link>

        {items.map((item) => (
          <Link
            key={item.id}
            href={`/shop/${item.handle}`}
            onClick={onClose}
            className="
              flex
              items-center
              justify-between
              border-b
              border-neutral-100
              py-5
              active:opacity-60
            "
          >
            <span className="text-[15px] font-medium tracking-tight text-black">
              {item.name}
            </span>

            <ChevronRight size={17} className="text-neutral-300" />
          </Link>
        ))}
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                              MOBILE DRAWER                                 */
/* -------------------------------------------------------------------------- */

export const MobileDrawer = memo(function MobileDrawer({
  isOpen,
  onClose,
  categories,
}: MobileDrawerProps) {
  const [screen, setScreen] = useState<Screen>({
    id: "main",
    title: "Menu",
  });

  const openCategory = useCallback((category: Category) => {
    setScreen({
      id: category.id,
      title: category.name,
      items: category.category_children || [],
    });
  }, []);

  const goBack = useCallback(() => {
    setScreen({
      id: "main",
      title: "Menu",
    });
  }, []);

  const isMain = screen.id === "main";

  const memoizedCategories = useMemo(() => categories, [categories]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={onClose}
              className="
                fixed
                inset-0
                z-40
                bg-black/25
                lg:hidden
              "
            />

            {/* DRAWER */}
            <m.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={drawerTransition}
              className="
                fixed
                inset-y-0
                left-0
                z-50
                w-full
                max-w-sm
                overflow-hidden
                bg-white
                will-change-transform
                lg:hidden
              "
              style={{
                contain: "layout paint size",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            >
              {/* HEADER */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-neutral-100
                  px-6
                  py-5
                "
              >
                <span
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.3em]
                    text-black
                  "
                >
                  MENU
                </span>

                <button
                  onClick={onClose}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    active:opacity-60
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* SCREENS */}
              <div className="relative h-[calc(100dvh-150px)] overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {isMain ? (
                    <m.div
                      key="main"
                      initial={{ x: -16, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -16, opacity: 0 }}
                      transition={screenTransition}
                      className="absolute inset-0"
                      style={{
                        willChange: "transform, opacity",
                        transform: "translateZ(0)",
                      }}
                    >
                      <MainScreen
                        categories={memoizedCategories}
                        onClose={onClose}
                        onOpenCategory={openCategory}
                      />
                    </m.div>
                  ) : (
                    <m.div
                      key={screen.id}
                      initial={{ x: "8%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: "8%", opacity: 0 }}
                      transition={screenTransition}
                      className="absolute inset-0"
                      style={{
                        willChange: "transform, opacity",
                        transform: "translateZ(0)",
                      }}
                    >
                      <CategoryScreen
                        title={screen.title}
                        items={screen.items}
                        onBack={goBack}
                        onClose={onClose}
                      />
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SOCIAL ICONS FOOTER */}
              <div className="border-t border-neutral-100 px-6 py-5">
                <div className="flex justify-center gap-6">
                  <Link 
                    href={COMPANY_INFO.social.instagram.url} 
                    target="_blank" 
                    className="text-neutral-400 hover:text-black transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </Link>
                  <Link 
                    href={COMPANY_INFO.social.facebook.url} 
                    target="_blank" 
                    className="text-neutral-400 hover:text-black transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </Link>
                  <Link 
                    href={COMPANY_INFO.social.tiktok.url} 
                    target="_blank" 
                    className="text-neutral-400 hover:text-black transition-colors"
                    aria-label="TikTok"
                  >
                    <TikTok size={18} />
                  </Link>
                </div>
              </div>

              

            </m.aside>
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
});
