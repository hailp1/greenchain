'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Menu, X, Globe, ArrowRight, User, ShieldCheck, Terminal, HardDrive, Info } from 'lucide-react';
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
    { name: 'Philosophy', href: '/about' },
    { name: 'Insights', href: '/news' },
    { name: 'Blockchain Explorer', href: '/explorer' },
    { name: 'Network Validators', href: '/explorer/nodes' },
    { name: 'Leaderboard', href: '/reputation' },
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
          {/* Wallet Balance Pill - shows when wallet is connected */}
          {mounted && web3.isConnected && address && (
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full p-1 pl-3 md:pl-4 gap-2 md:gap-3 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col items-end">
                  <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">AGRI Assets</span>
                  <span className="text-[10px] md:text-xs font-black text-emerald-600">
                    {Number(web3.fwdBalance).toLocaleString(undefined, {minimumFractionDigits: 2})} <span className="text-[8px] opacity-60">AGRI</span>
                  </span>
                  <span className="text-[6px] md:text-[7px] font-bold text-slate-400 uppercase tracking-tighter leading-none mt-0.5">Gas: {Number(web3.balance).toFixed(4)}</span>
              </div>
              <div className="px-2 md:px-3 py-1.5 md:py-2 bg-white border border-slate-100 rounded-full text-[9px] md:text-[10px] font-black text-slate-500">
                <span className="hidden sm:inline">{address.slice(0, 4)}...{address.slice(-4)}</span>
                <Wallet size={12} className="text-emerald-500 sm:hidden" />
              </div>
            </div>
          )}

          {/* Google user balance (no wallet connected) */}
          {user && !web3.isConnected && Number(fwdBalance) > 0 && (
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full px-4 py-2 gap-2 shadow-sm">
              <span className="text-[10px] font-black text-emerald-600">
                {Number(fwdBalance).toLocaleString(undefined, {minimumFractionDigits: 2})} <span className="text-[8px] opacity-60">AGRI</span>
              </span>
            </div>
          )}

          {/* Profile/Auth Area — Google user takes priority */}
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
                <span className="text-[10px] font-black text-slate-900 uppercase leading-none">{user.user_metadata?.full_name?.split(' ').pop() || 'Account'}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Portal</span>
              </div>
            </Link>
          ) : mounted && web3.isConnected ? (
            <Link href="/portal" className="flex items-center gap-2 group/profile shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
                 <Wallet size={16} className="text-emerald-600" />
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-[10px] font-black text-slate-900 uppercase leading-none">Portal</span>
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Connected</span>
              </div>
            </Link>
          ) : (
            <Link href="/signin" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
              <User size={14} />
              Sign In
            </Link>
          )}

          {/* Network Status Indicator */}
          <button 
            onClick={() => setShowNetworkModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full group hover:bg-emerald-100 transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Mainnet Live</span>
            <ShieldCheck size={12} className="text-emerald-400 group-hover:text-emerald-600 transition-colors" />
          </button>

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

      {/* Network Verification Modal */}
      <AnimatePresence>
        {showNetworkModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowNetworkModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Trust & Verification</h2>
                      <p className="text-xs text-slate-500 font-medium">Verify blockchain data independently from this website.</p>
                   </div>
                   <button onClick={() => setShowNetworkModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <X size={20} className="text-slate-400" />
                   </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-600">
                         <Globe size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Network RPC Settings</span>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400 font-bold uppercase">Network Name:</span>
                            <span className="text-slate-900 font-black">fwd LIFEchain</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400 font-bold uppercase">RPC URL:</span>
                            <span className="text-blue-600 font-mono font-bold">https://rpc.fwdlife.vn</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400 font-bold uppercase">Chain ID:</span>
                            <span className="text-slate-900 font-black">1186</span>
                         </div>
                         <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400 font-bold uppercase">Currency:</span>
                            <span className="text-slate-900 font-black">AGRI</span>
                         </div>
                      </div>
                      <div className="pt-2">
                         <p className="text-[9px] text-slate-500 leading-relaxed">
                            <Info size={10} className="inline mr-1 mb-0.5" />
                            Use these settings to add the network to <strong>MetaMask</strong> or <strong>Trust Wallet</strong>.
                         </p>
                      </div>
                   </div>

                   <div className="p-5 bg-slate-900 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-blue-400">
                         <Terminal size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Verify via Terminal</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                         <code className="text-[10px] text-emerald-400 font-mono break-all leading-relaxed">
                            curl -X POST --data '&#123;"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1&#125;' https://rpc.fwdlife.vn
                         </code>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed italic">
                         Run this command on your computer to verify that our blockchain nodes are responding independently.
                      </p>
                   </div>
                </div>

                <button 
                  onClick={() => setShowNetworkModal(false)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
