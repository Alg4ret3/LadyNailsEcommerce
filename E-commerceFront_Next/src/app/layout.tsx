import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { CompareProvider } from "@/context/CompareContext";
import { CompareDrawer } from "@/components/organisms/CompareDrawer";
import { WhatsAppButton } from "@/components/atoms/WhatsAppButton";

import { WishlistProvider } from "@/context/WishlistContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ladynail Shop | Distribuidora Profesional de Belleza",
  description: "Especialistas en insumos para uñas, barbería y cosmética profesional. Ladynail Shop es tu socio logístico para el crecimiento de tu salón.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased font-sans`}>
        <ThemeProvider>
          <UserProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  {children}
                  <CompareDrawer />
                  <WhatsAppButton />
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
