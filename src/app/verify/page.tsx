'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, Search, ShieldCheck, ArrowRight, 
  Fingerprint, Layers, Activity, Sparkles 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QRScanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Verify() {
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) return;
    setLoading(true);
    // Redirect to the dynamic verification page
    router.push(`/verify/${batchId}`);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a2f1a]">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Header Section */}
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
              <ShieldCheck size={14} />
              <span>Trust Verification Protocol</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-natural-950 tracking-tighter mb-6 italic uppercase">
              Xác thực <span className="text-emerald-500">Nguồn gốc</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Truy xuất nguồn gốc sản phẩm thông qua mã định danh chuỗi khối (Batch ID) để đảm bảo tính minh bạch và an toàn thực phẩm.
            </p>
          </motion.div>
        </header>

        {/* Search Input Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-24"
        >
          <div className="absolute -inset-4 bg-emerald-500/5 blur-2xl rounded-[3rem] -z-10"></div>
          <form 
            onSubmit={handleVerify}
            className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-2xl shadow-natural-900/5 border border-slate-100 flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                <Fingerprint size={24} />
              </div>
              <input 
                type="text" 
                placeholder="Nhập mã Batch ID (ví dụ: b8f4...)" 
                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-16 pr-6 text-sm font-bold text-natural-900 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="px-10 py-5 bg-natural-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-natural-900/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search size={18} />
                  Xác thực ngay
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              Bảo mật 256-bit
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              Xác thực thời gian thực
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              Immutable Ledger
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             {
               title: "QR Scanning",
               desc: "Sử dụng camera để quét mã QR in trên bao bì sản phẩm để truy xuất nhanh.",
               icon: QrCode,
               color: "text-emerald-500",
               bg: "bg-emerald-50",
               action: () => setShowScanner(true)
             },
             {
               title: "Global Ledger",
               desc: "Mọi dữ liệu được lưu trữ trên sổ cái phi tập trung, không thể thay đổi.",
               icon: Layers,
               color: "text-blue-500",
               bg: "bg-blue-50"
             },
             {
               title: "AI Analysis",
               desc: "Hệ thống AI đối soát tính nhất quán của dữ liệu từ nông trại đến người dùng.",
               icon: Sparkles,
               color: "text-amber-500",
               bg: "bg-amber-50"
             }
           ].map((feature, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 + i * 0.1 }}
               onClick={feature.action}
               className={`p-8 rounded-[2rem] bg-white border border-slate-50 shadow-xl shadow-slate-900/5 group hover:border-emerald-500/20 transition-all ${feature.action ? 'cursor-pointer' : ''}`}
             >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   <feature.icon size={28} />
                </div>
                <h3 className="text-lg font-black text-natural-900 mb-3 tracking-tight uppercase italic">{feature.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-light">
                   {feature.desc}
                </p>
             </motion.div>
           ))}
        </div>

        <AnimatePresence>
          {showScanner && (
            <QRScanner onClose={() => setShowScanner(false)} />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
