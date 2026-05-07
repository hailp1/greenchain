'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Menu, X, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Triết lý fwd', href: '/about' },
    { name: 'Blockchain Explorer', href: '/explorer' },
    { name: 'Cổng Portal', href: '/portal' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
            <Sprout size={24} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-sm font-light text-emerald-600 italic lowercase px-1">fwd</span>
              <div className="flex items-baseline">
                <span className="font-sans text-base font-black text-natural-950 uppercase">LIFE</span>
                <span className="font-serif text-sm font-light text-natural-900 lowercase">chain</span>
              </div>
            </div>
            <p className="text-[7px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Farm · Worth · Driven</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                pathname === link.href ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/verify/YEN-001" 
            className="px-5 py-2.5 bg-emerald-600 text-white text-[10px] font-black rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-[0.2em]"
          >
            Xác thực ngay
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-bold uppercase tracking-widest ${
                    pathname === link.href ? 'text-emerald-600' : 'text-slate-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/verify/YEN-001" 
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-emerald-600 text-white text-xs font-black rounded-xl text-center uppercase tracking-widest"
              >
                Xác thực ngay
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
