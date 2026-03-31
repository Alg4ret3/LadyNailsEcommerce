import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@/components/atoms/Typography';
import { MapPin, Phone, Mail, Instagram, Facebook, TikTok } from '@/components/icons';
import { COMPANY_INFO, ROUTES } from '@/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 mb-16 sm:mb-32">
        {/* Column 1: Identity */}
        <div className="space-y-8">
           <div className="flex items-center mb-4">
             <div className="relative w-32 h-32 flex items-center justify-center">
               <Image 
                 src={COMPANY_INFO.logo.src} 
                 alt={COMPANY_INFO.logo.alt} 
                 fill
                 className="object-contain brightness-0 invert"
               />
             </div>
           </div>
           <Typography variant="body" className="max-w-xs text-slate-400">
             {COMPANY_INFO.description}
           </Typography>
           <div className="flex gap-4">
             <Link href={COMPANY_INFO.social.instagram.url} target="_blank" className="p-2 border border-white/10 text-white hover:bg-white hover:text-slate-950 transition-all"><Instagram size={18} /></Link>
             <Link href={COMPANY_INFO.social.facebook.url} target="_blank" className="p-2 border border-white/10 text-white hover:bg-white hover:text-slate-950 transition-all"><Facebook size={18} /></Link>
             <Link href={COMPANY_INFO.social.tiktok.url} target="_blank" className="p-2 border border-white/10 text-white hover:bg-white hover:text-slate-950 transition-all"><TikTok size={18} /></Link>
           </div>
        </div>


        {/* Column 2: Corporativo / Soporte */}
        <div className="space-y-8">
          <Typography variant="h4" className="text-white">Corporativo</Typography>
          <div className="flex flex-col gap-4">
             <Link href={ROUTES.about} className="text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white hover:pl-2 transition-all">Sobre Nosotros</Link>
             <Link href={ROUTES.contact} className="text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white hover:pl-2 transition-all">Contacto</Link>
             <Link href={ROUTES.faq} className="text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white hover:pl-2 transition-all">FAQ / Ayuda</Link>
             <Link href={ROUTES.shipping} className="text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white hover:pl-2 transition-all">Política Envíos</Link>
             <Link href={ROUTES.returns} className="text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white hover:pl-2 transition-all">Devoluciones</Link>
             <Link href={ROUTES.reviews} className="text-sm font-bold uppercase tracking-widest text-white/80 hover:text-white hover:pl-2 transition-all">Reseñas</Link>
          </div>
        </div>

        {/* Column 3: Contact */}
        <div className="space-y-8">
          <Typography variant="h4" className="text-white">Central</Typography>
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-white">
               <MapPin size={20} className="mt-1 text-white" />
               <Typography variant="body" className="text-xs text-white/90 whitespace-pre-line">{COMPANY_INFO.contact.address}</Typography>
            </div>
            <div className="flex items-center gap-4 text-white">
               <Phone size={20} className="text-white" />
               <Typography variant="body" className="text-xs text-white/90">{COMPANY_INFO.contact.phone}</Typography>
            </div>
            <div className="flex items-center gap-4 text-white">
               <Mail size={20} className="text-white" />
               <Typography variant="body" className="text-xs text-white/90">{COMPANY_INFO.contact.email}</Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto border-t border-white/5 pt-8 sm:pt-12 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
        <Typography variant="detail" className="text-center md:text-left text-white/30">© 2026 Professional Beauty Dist. All Rights Reserved.</Typography>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
           <Link href={ROUTES.privacy} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white">Privacidad</Link>
           <Link href={ROUTES.terms} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white">Términos</Link>
           <Link href={ROUTES.cookies} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};
