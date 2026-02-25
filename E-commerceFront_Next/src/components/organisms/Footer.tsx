import React from 'react';
import Link from 'next/link';
import { Typography } from '@/components/atoms/Typography';
import { Instagram, Mail, MapPin, Phone, Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t-4 border-slate-900 pt-16 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-32">
        {/* Column 1: Identity */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black text-2xl">LN</div>
             <Typography variant="h3" className="text-2xl tracking-tighter">Ladynail <br /> Shop</Typography>
           </div>
           <Typography variant="body" className="max-w-xs">
             Suministros de alta gama para profesionales de la belleza. Ladynail Shop es el centro de distribución líder para el mercado estético moderno.
           </Typography>
           <div className="flex gap-4">
             <Link href="#" className="p-2 border border-slate-200 hover:border-slate-900 transition-all"><Instagram size={18} /></Link>
             <Link href="#" className="p-2 border border-slate-200 hover:border-slate-900 transition-all"><Linkedin size={18} /></Link>
             <Link href="#" className="p-2 border border-slate-200 hover:border-slate-900 transition-all"><Github size={18} /></Link>
           </div>
        </div>

        {/* Column 2: Categories */}
        <div className="space-y-8">
          <Typography variant="h4" className="text-slate-400">Distribución</Typography>
          <div className="flex flex-col gap-4">
             <Link href="/shop/nails" className="text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Suministros Uñas</Link>
             <Link href="/shop/barber" className="text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Equipo Barbería</Link>
             <Link href="/shop/makeup" className="text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Cosmética Pro</Link>
             <Link href="/shop/furniture" className="text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Mobiliario Studio</Link>
          </div>
        </div>

        {/* Column 3: Corporativo / Soporte */}
        <div className="space-y-8">
          <Typography variant="h4" className="text-slate-400">Corporativo</Typography>
          <div className="flex flex-col gap-4">
             <Link href="/nosotros" className="text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Sobre Nosotros</Link>
             <Link href="/contact" className="text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Contacto</Link>
             <Link href="/faq" className="text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">FAQ / Ayuda</Link>
             <Link href="/shipping" className="text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Política Envíos</Link>
             <Link href="/returns" className="text-sm font-bold uppercase tracking-widest hover:pl-2 transition-all">Devoluciones</Link>
          </div>
        </div>

        {/* Column 4: Contact */}
        <div className="space-y-8">
          <Typography variant="h4" className="text-slate-400">Central</Typography>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
               <MapPin size={20} className="mt-1" />
               <Typography variant="body" className="text-xs">Parque Industrial Sur, Bloque C-12, <br /> Pasto, Nariño</Typography>
            </div>
            <div className="flex items-center gap-4">
               <Phone size={20} />
               <Typography variant="body" className="text-xs">+57 (602) 000 0000</Typography>
            </div>
            <div className="flex items-center gap-4">
               <Mail size={20} />
               <Typography variant="body" className="text-xs">hola@ladynailshop.com</Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto border-t border-slate-100 pt-8 sm:pt-12 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
        <Typography variant="detail" className="text-center md:text-left">© 2026 Ladynail Shop Beauty Dist. All Rights Reserved.</Typography>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
           <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest hover:text-slate-500">Privacidad</Link>
           <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest hover:text-slate-500">Términos</Link>
           <Link href="/cookies" className="text-[10px] font-black uppercase tracking-widest hover:text-slate-500">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};
