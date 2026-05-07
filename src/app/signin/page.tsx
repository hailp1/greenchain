'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWeb3 } from '@/lib/web3';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { account, connectWallet, loading: web3Loading } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      // Simulation: If wallet connected, redirect to portal
      // In a real app, we would verify the signature and check if the wallet is in 'entities' table
      router.push('/portal');
    }
  }, [account, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/portal`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      alert('Lỗi đăng nhập: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-sm border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                fwd
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
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Truy cập cổng quản trị nông sản chuỗi khối</p>
            </div>
          </div>

          {/* Social Login Button */}
          <div className="space-y-4">
             <button 
               onClick={handleGoogleLogin}
               disabled={loading}
               className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm flex items-center justify-center gap-4 hover:bg-slate-100 transition-all active:scale-[0.98] shadow-xl shadow-white/5"
             >
               {loading ? (
                 <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
               ) : (
                 <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
               )}
               TIẾP TỤC VỚI GOOGLE
             </button>
             
             <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Hoặc đăng nhập bằng ví</span>
                <div className="flex-grow border-t border-white/5"></div>
             </div>

             <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={connectWallet}
                  disabled={web3Loading}
                  className="py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95"
                >
                   {web3Loading ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <Globe size={18} />
                   )}
                   KẾT NỐI VÍ METAMASK / TRUST WALLET
                </button>
             </div>
          </div>

          {/* Features Info */}
          <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
             <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
             </div>
             <div className="flex items-center gap-3">
                <ArrowRight size={16} className="text-blue-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Instant Sync</span>
             </div>
          </div>

          <p className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Bằng cách tiếp tục, bạn đồng ý với Điều khoản của fwd LIFEchain
          </p>
        </motion.div>
      </div>
    </div>
  );
}
