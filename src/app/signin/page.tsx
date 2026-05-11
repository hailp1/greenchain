'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, ArrowRight, Wallet, Chrome } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWeb3 } from '@/lib/web3';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { address, isConnected, isConnecting, connect, error: web3Error } = useWeb3();
  const router = useRouter();

  // ─── Check existing auth on mount ──────────────────────────
  useEffect(() => {
    let cancelled = false;

    // Safety timeout: If auth check takes > 3s, just show the login page
    const timeout = setTimeout(() => {
      if (!cancelled) setCheckingAuth(false);
    }, 3000);

    const checkExistingAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && !cancelled) {
          router.replace('/portal');
          return;
        }
      } catch (e) {
        console.warn("[SignIn] Session check error:", e);
      }

      if (isConnected && address && !cancelled) {
        router.replace('/portal');
        return;
      }

      if (!cancelled) setCheckingAuth(false);
      clearTimeout(timeout);
    };

    checkExistingAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && !cancelled) {
        router.replace('/portal');
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [isConnected, address, router]);

  // ─── Web3 Login Handler ────────────────────────────────────
  const handleWalletLogin = async () => {
    await connect();
    // The useEffect above will detect isConnected and redirect
  };

  // Show loading while checking existing auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-emerald-500 font-black text-xs uppercase tracking-widest animate-pulse">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-12 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden"
        >
          {/* Logo Section */}
          <div className="text-center space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-xs border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                AGRI
              </div>
              <div className="text-left">
                 <div className="flex items-baseline gap-1">
                    <span className="font-serif text-base font-light text-emerald-400 italic lowercase">fwd</span>
                    <span className="font-sans text-xl font-black text-white uppercase ml-1">LIFE</span>
                    <span className="font-serif text-base font-light text-slate-400 lowercase">chain</span>
                 </div>
              </div>
            </Link>
            <div className="space-y-2">
               <h2 className="text-3xl font-black tracking-tight uppercase italic">Welcome <span className="text-emerald-500">Back</span></h2>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Connect your Web3 identity to access the portal</p>
            </div>
          </div>

          {/* Web3 Error Display */}
          {web3Error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-400 text-center">
              {web3Error}
            </div>
          )}

          {/* Login Buttons */}
          <div className="space-y-4">
             {/* MetaMask / Trust Wallet */}
             <button 
               onClick={handleWalletLogin}
               disabled={isConnecting}
               className="w-full py-6 bg-emerald-600 text-white rounded-2xl text-[10px] font-black hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95"
             >
                {isConnecting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Wallet size={18} />
                )}
                CONNECT METAMASK / TRUST WALLET
             </button>

             <p className="text-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
               Secure Web3 Authentication Required
             </p>
          </div>

          {/* Features Info */}
          <div className="pt-6 border-t border-white/5 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={16} className="text-emerald-500" />
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
                <div className="flex items-center gap-3">
                   <Globe size={16} className="text-blue-500" />
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Mainnet</span>
                </div>
             </div>

             {/* Institutional Network Pulse */}
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                   <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Current Block</span>
                   <span className="text-[10px] font-mono font-bold text-emerald-500">#19,450,300</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Active Nodes</span>
                   <span className="text-[10px] font-mono font-bold text-blue-500">1,204</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">TVL (AGRI)</span>
                   <span className="text-[10px] font-mono font-bold text-amber-500">84.2M</span>
                </div>
             </div>
          </div>

          <p className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            By continuing, you agree to fwd LIFEchain's Terms of Service
          </p>
        </motion.div>
      </div>
    </div>
  );
}
