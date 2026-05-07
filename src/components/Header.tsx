'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Menu, X, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { useWeb3 } from '@/lib/web3';
import { Wallet } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { account, balance, loading: web3Loading, connectWallet } = useWeb3();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [user, setUser] = useState<any>(null);
  const [fwdBalance, setFwdBalance] = useState("0.00");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch real balance from entities table
        const { data } = await supabase
          .from('entities')
          .select('fwd_balance')
          .single();
        if (data) setFwdBalance(Number(data.fwd_balance).toLocaleString('en-US', { minimumFractionDigits: 2 }));
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Triết lý fwd', href: '/about' },
    { name: 'Blockchain Explorer', href: '/explorer' },
    { name: 'Bảng xếp hạng', href: '/reputation' },
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
        <nav className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.15em] transition-all relative group/link ${
                  pathname === link.href ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-emerald-500 transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
              </Link>
            ))}
          </div>
          
          <div className="h-6 w-px bg-slate-100 mx-2"></div>

          <div className="flex items-center gap-3">
             {/* Web3 Wallet Section */}
             {account ? (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm">
                  <Wallet size={12} className="text-blue-500" />
                  <span className="text-[9px] font-bold text-blue-700 tracking-tight">
                    {account.slice(0, 4)}...{account.slice(-4)}
                  </span>
               </div>
             ) : (
               <button 
                 onClick={connectWallet}
                 className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm"
               >
                  <Wallet size={12} />
                  Connect
               </button>
             )}

             {user ? (
               <div className="flex items-center gap-3">
                  {/* Token Balance Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 backdrop-blur-sm rounded-full border border-emerald-100 shadow-sm">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                     <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">{fwdBalance} fwd</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 group relative cursor-pointer hover:bg-black transition-all">
                     <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                        <img src={user.user_metadata?.avatar_url} alt="User" className="w-full h-full object-cover" />
                     </div>
                     <span className="text-[9px] font-black uppercase text-white tracking-widest">{user.user_metadata?.full_name?.split(' ').pop()}</span>
                     
                     {/* Dropdown Simple */}
                     <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-1.5 z-50">
                        <Link href="/portal" className="block w-full text-left p-2.5 text-[9px] font-black uppercase text-slate-600 hover:bg-slate-50 rounded-xl">Portal Dashboard</Link>
                        <div className="h-px bg-slate-50 my-1"></div>
                        <button onClick={handleSignOut} className="block w-full text-left p-2.5 text-[9px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl">Sign Out</button>
                     </div>
                  </div>
               </div>
             ) : (
               <Link 
                 href="/signin" 
                 className="px-5 py-2 bg-slate-900 text-white text-[9px] font-black rounded-full hover:bg-black transition-all shadow-lg shadow-slate-900/10 uppercase tracking-widest"
               >
                 Login
               </Link>
             )}
             
             <Link 
               href="/verify" 
               className="px-5 py-2 bg-emerald-500 text-white text-[9px] font-black rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-[0.15em] ml-2"
             >
               Verify
             </Link>
          </div>
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
              <div className="pt-4 border-t border-slate-50 flex flex-col gap-4">
                 {user ? (
                   <button onClick={handleSignOut} className="w-full py-4 bg-red-50 text-red-500 text-[10px] font-black rounded-xl uppercase tracking-widest">Sign Out</button>
                 ) : (
                   <Link href="/signin" onClick={() => setIsOpen(false)} className="w-full py-4 bg-slate-100 text-slate-900 text-[10px] font-black rounded-xl text-center uppercase tracking-widest">Login</Link>
                 )}
                 <Link 
                   href="/verify" 
                   onClick={() => setIsOpen(false)}
                   className="w-full py-4 bg-emerald-600 text-white text-xs font-black rounded-xl text-center uppercase tracking-widest"
                 >
                   Xác thực ngay
                 </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
