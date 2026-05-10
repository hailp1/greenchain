'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Menu, X, Globe, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import { useWeb3 } from '@/lib/web3';
import { Wallet } from 'lucide-react';
import { ethers } from 'ethers';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const web3 = useWeb3();
  const { address, balance, isConnecting, connect } = web3;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [user, setUser] = useState<any>(null);
  const [fwdBalance, setFwdBalance] = useState("0.00");

  useEffect(() => {
    const fetchTokenBalance = async (walletAddress: string) => {
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        const tokenAddress = process.env.NEXT_PUBLIC_FWD_TOKEN_ADDRESS || "0xbE85Cf9DDB93d9ea677e95599779B400437899E8";
        const abi = ["function balanceOf(address) view returns (uint256)"];
        const contract = new ethers.Contract(tokenAddress, abi, provider);
        const bal = await contract.balanceOf(walletAddress);
        setFwdBalance(ethers.formatEther(bal));
      } catch (e) {
        console.error("Error fetching header token balance:", e);
      }
    };

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('entities').select('wallet_address').eq('id', session.user.id).maybeSingle();
        if (data?.wallet_address) fetchTokenBalance(data.wallet_address);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Header] Auth Event:", event);
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('entities').select('wallet_address').eq('id', session.user.id).maybeSingle();
        if (data?.wallet_address) fetchTokenBalance(data.wallet_address);
      } else {
        setUser(null);
        setFwdBalance("0.00");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Triết lý fwd', href: '/about' },
    { name: 'Blockchain Explorer', href: '/explorer' },
    { name: 'Network Validators', href: '/explorer/nodes' },
    { name: 'Bảng xếp hạng', href: '/reputation' },
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
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-[10px] transition-transform group-hover:scale-110">
            AGRI
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
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-all relative group/link ${
                  pathname === link.href ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-900'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1.5 left-0 h-[1.5px] bg-emerald-500 transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Action Area (Wallet & Profile) - Visible on all screens */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Wallet & Balance - Condensed on Mobile */}
          {user && (
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full p-1 pl-3 md:pl-4 gap-2 md:gap-3 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col items-end">
                  <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">AGRI Assets</span>
                  <span className="text-[10px] md:text-xs font-black text-emerald-600">
                    {mounted ? (
                      address && web3.fwdBalance !== "0.00" 
                        ? Number(web3.fwdBalance).toLocaleString(undefined, {minimumFractionDigits: 2}) 
                        : Number(fwdBalance).toLocaleString(undefined, {minimumFractionDigits: 2})
                    ) : '0.00'} <span className="text-[8px] opacity-60">AGRI</span>
                  </span>
                  {mounted && address && (
                    <span className="text-[6px] md:text-[7px] font-bold text-slate-400 uppercase tracking-tighter leading-none mt-0.5">Gas: {Number(web3.balance).toFixed(4)}</span>
                  )}
              </div>
              <button 
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-white border border-slate-100 rounded-full text-[9px] md:text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all shrink-0 active:scale-95"
              >
                <Wallet size={12} className="text-emerald-500" />
                <span className="hidden sm:inline-block">
                  {mounted ? (address ? `${address.slice(0, 4)}...${address.slice(-4)}` : (isConnecting ? '...' : 'CONNECT')) : '...'}
                </span>
              </button>
            </div>
          )}

          {/* Profile/Auth Area */}
          {user ? (
            <Link href="/portal" className="flex items-center gap-2 group/profile shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                 {user?.user_metadata?.avatar_url ? (
                   <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   <User size={16} className="text-emerald-600" />
                 )}
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-[10px] font-black text-slate-900 uppercase leading-none">{user.user_metadata?.full_name?.split(' ').pop()}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Portal</span>
              </div>
            </Link>
          ) : (
            <Link href="/signin" className="hidden sm:block text-[10px] font-black text-slate-500 hover:text-emerald-600 uppercase tracking-widest px-2 transition-colors">Sign In</Link>
          )}

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
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
                   href="/explorer/nodes" 
                   onClick={() => setIsOpen(false)}
                   className="w-full py-4 bg-emerald-600 text-white text-xs font-black rounded-xl text-center uppercase tracking-widest"
                 >
                   Network Validators
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
