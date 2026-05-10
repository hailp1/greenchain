'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Menu, X, Globe, ArrowRight, User, ShieldCheck, Terminal, HardDrive, Info, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWeb3 } from '@/lib/web3';
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
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  useEffect(() => {
    const fetchTokenBalance = async (walletAddress: string) => {
      if (!walletAddress || walletAddress.startsWith('pending_')) return;
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        const tokenAddress = "0xbE85Cf9DDB93d9ea677e95599779B400437899E8";
        const abi = ["function balanceOf(address) view returns (uint256)"];
        const contract = new ethers.Contract(tokenAddress, abi, provider);
        const bal = await contract.balanceOf(walletAddress);
        setFwdBalance(ethers.formatEther(bal));
      } catch (e) {
        console.error("Error fetching header token balance:", e);
      }
    };

    // 1. Priority: Web3 Wallet Address
    if (web3.isConnected && web3.address) {
      fetchTokenBalance(web3.address);
    } 
    // 2. Secondary: Supabase User linked wallet
    else {
      const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase.from('entities').select('wallet_address').eq('id', session.user.id).maybeSingle();
          if (data?.wallet_address) fetchTokenBalance(data.wallet_address);
        }
      };
      checkUser();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('entities').select('wallet_address').eq('id', session.user.id).maybeSingle();
        if (data?.wallet_address) fetchTokenBalance(data.wallet_address);
      } else {
        setUser(null);
        if (!web3.isConnected) setFwdBalance("0.00");
      }
    });

    return () => subscription.unsubscribe();
  }, [web3.isConnected, web3.address]);

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
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-emerald-600/20 transition-transform group-hover:scale-110">
              AGRI
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                 <span className="font-serif text-lg font-light text-emerald-600 italic lowercase">fwd</span>
                 <span className="font-sans text-xl font-black text-slate-900 uppercase tracking-tighter">LIFE</span>
                 <span className="font-serif text-sm font-light text-slate-400 lowercase">chain</span>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-600 ${
                  pathname === link.href ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {mounted && user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600">
                  {Number(fwdBalance).toLocaleString(undefined, {minimumFractionDigits: 2})} <span className="text-[8px] opacity-60">AGRI</span>
                </span>
              </div>
            )}

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
                   <span className="text-[10px] font-black text-slate-900 uppercase leading-none">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Researcher'}
                   </span>
                   <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Control Panel</span>
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

            <button 
              onClick={() => setShowNetworkModal(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full group hover:bg-emerald-100 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Mainnet Live</span>
              <ShieldCheck size={12} className="text-emerald-400 group-hover:text-emerald-600 transition-colors" />
            </button>

            <button className="lg:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
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
                   <Link href="/signin" onClick={() => setIsOpen(false)} className="w-full py-4 bg-emerald-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest text-center">Sign In</Link>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Modal */}
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
               className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
             >
                <div className="p-8 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Globe size={20} />
                         </div>
                         <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Network Verification</h3>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Mainnet Live</p>
                         </div>
                      </div>
                      <button onClick={() => setShowNetworkModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                         <X size={20} className="text-slate-400" />
                      </button>
                   </div>

                   <div className="space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed">
                         To ensure absolute transparency, you can independently verify all blockchain data by adding the fwd LIFEchain network to your wallet.
                      </p>
                      
                      <div className="space-y-3">
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">RPC URL</p>
                            <p className="text-xs font-mono text-slate-900 break-all select-all">https://rpc.fwdlife.vn</p>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Chain ID</p>
                               <p className="text-xs font-mono text-slate-900">1186</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Symbol</p>
                               <p className="text-xs font-mono text-slate-900">AGRI</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                      <div className="flex items-center gap-2">
                         <Terminal size={14} className="text-blue-400" />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">Independent Test</span>
                      </div>
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[9px] text-emerald-500 break-all select-all">
                         curl -X POST --data '&#123;"jsonrpc":"2.0","method":"eth_blockNumber","id":1&#125;' https://rpc.fwdlife.vn
                      </div>
                      <p className="text-[9px] text-slate-400 italic">Run this command in your terminal to verify current block height directly.</p>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
