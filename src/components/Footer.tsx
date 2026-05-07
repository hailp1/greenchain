'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, Cpu, Github, Twitter, Linkedin, ArrowRight, Sprout } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-natural-900 text-white pt-24 pb-12 px-6 md:px-12 relative overflow-hidden print:hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                 <Sprout size={28} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                   <span className="font-serif text-2xl font-light text-emerald-400 italic lowercase">fwd</span>
                   <span className="font-sans text-3xl font-black text-white uppercase">LIFE</span>
                   <span className="font-serif text-xl font-light text-slate-400 lowercase">chain</span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 mt-2">Farm · Worth · Driven</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm md:text-lg font-light leading-relaxed max-w-md">
              Hệ sinh thái minh bạch hóa giá trị nông sản từ gốc rễ bằng Blockchain & AI. Đề án nghiên cứu của Nghiên cứu sinh Lê Phúc Hải.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Hệ sinh thái</h4>
              <ul className="space-y-4">
                {[
                  { name: "Trang chủ", href: "/" },
                  { name: "Triết lý FWD", href: "/about" },
                  { name: "Blockchain Explorer", href: "/explorer" },
                  { name: "Cổng nhà sản xuất", href: "/portal" },
                  { name: "Xác thực nhanh", href: "/verify/YEN-001" },
                  { name: "Mạng lưới Node", href: "/explorer/nodes" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Tài nguyên</h4>
              <ul className="space-y-4">
                {[
                  { name: "Tài liệu kỹ thuật", href: "/explorer/resources" },
                  { name: "Smart Contracts", href: "/explorer/smart-contracts" },
                  { name: "API Docs", href: "/explorer/apis" },
                  { name: "Governance", href: "/explorer/governance" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Trạng thái</h4>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Network Live</span>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Latest Block</p>
                   <p className="text-[11px] font-mono text-emerald-400">#19482412</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <Link href="/legal/terms" className="hover:text-white">Điều khoản</Link>
             <Link href="/legal/privacy" className="hover:text-white">Bảo mật</Link>
             <Link href="/legal/cookies" className="hover:text-white">Cookies</Link>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
            © 2026 FWD LIFECHAIN. BY NCS LÊ PHÚC HẢI. ALL RIGHTS RESERVED. 
            <span className="hidden md:inline ml-2">• SECURED BY FARM WORTH DRIVEN PROTOCOL</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
