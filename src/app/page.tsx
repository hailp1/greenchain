'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, Leaf, Search, Package, QrCode, ArrowRight, Star, Globe, Zap, Menu, X,
  Activity, Layers, Clock, BarChart3, Cpu, Lock, Eye, Truck, Users, Sparkles, Sprout
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Mock components for now, you can add real ones later
const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 py-6 bg-transparent">
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
           <Sprout size={24} />
        </div>
        <div className="flex flex-col">
           <span className="font-serif text-sm font-light text-emerald-600 italic">fwd</span>
           <span className="font-sans text-base font-black text-natural-950 uppercase">LIFEchain</span>
        </div>
      </div>
      <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
        <Link href="/">Trang chủ</Link>
        <Link href="/explorer">Explorer</Link>
        <Link href="/reputation">Reputation</Link>
        <Link href="/verify" className="text-emerald-600">Xác thực</Link>
      </nav>
    </div>
  </header>
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [prodRes, statRes] = await Promise.all([
          fetch('http://localhost:3000/batches'),
          fetch('http://localhost:3000/stats')
        ]);
        const prodData = await prodRes.json();
        const statData = await statRes.json();
        setProducts(prodData.slice(0, 3));
        setStats(statData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  if (!mounted) return null;

  const networkStats = [
    { label: "Active Nodes", value: stats?.activeNodes || "128", icon: Globe, color: "text-blue-500" },
    { label: "Blocks Verified", value: stats?.blocksVerified?.toLocaleString() || "19.4M", icon: Layers, color: "text-emerald-500" },
    { label: "T. Throughput", value: (stats?.throughput || "14.2") + " TPS", icon: Zap, color: "text-amber-500" },
    { label: "Security Level", value: stats?.securityLevel || "99.9%", icon: ShieldCheck, color: "text-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a2f1a] overflow-x-hidden">
      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-12">
        {/* Hero Section */}
        <header className="mb-20 md:mb-32 text-center relative px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 text-[10px] md:text-xs font-bold mb-6 md:mb-8 uppercase tracking-widest">
              <Star size={14} className="text-slate-400" />
              <span>fwd LIFEchain: Future of Trust</span>
            </div>
            <h1 className="text-4xl md:text-8xl font-black mb-6 md:mb-8 text-natural-950 tracking-tighter leading-[1.1]">
              Farm Worth <span className="text-slate-400 font-light italic">Driven</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-8 md:mb-12">
              Bảo chứng minh bạch nông sản từ gốc rễ nông trại bằng công nghệ Blockchain & AI.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
               <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-natural-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-natural-900/20 hover:-translate-y-1 active:scale-95 transition-all">
                 <QrCode size={20} />
                 Xác thực Camera
               </Link>
               <Link href="/explorer" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                 <Search size={20} />
                 Explorer Network
               </Link>
            </div>
          </motion.div>
        </header>

        {/* Section 1: Live Network Pulse */}
        <section className="mb-24 md:mb-40">
           <div className="flex items-center gap-3 mb-10 md:mb-16">
              <div className="w-12 h-12 rounded-2xl bg-natural-900 text-white flex items-center justify-center shadow-xl shadow-natural-900/20">
                 <Activity size={24} />
              </div>
              <div>
                 <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">Network <span className="text-emerald-500">Pulse</span></h2>
                 <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Real-time fwd LIFEchain Activity</p>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {networkStats.map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-6 md:p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col justify-between"
                >
                  <div className={`${stat.color} mb-6`}><stat.icon size={24} /></div>
                  <div>
                    <p className="text-2xl md:text-4xl font-black text-natural-900 tracking-tighter mb-1">{stat.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Section 2: Products */}
        <section className="mb-24 md:mb-40">
          <div className="text-center mb-16 md:mb-24">
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase italic">Verified <span className="text-emerald-500">Assets</span></h2>
             <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
                Các sản phẩm đạt tiêu chuẩn xác thực Blockchain khắt khe nhất trong hệ sinh thái fwd LIFEchain.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-slate-900/5 group-hover:shadow-emerald-500/10 transition-all border border-slate-100 h-full flex flex-col p-8">
                   <h3 className="text-xl md:text-2xl font-black text-natural-900 mb-4 tracking-tight group-hover:text-emerald-500 transition-colors">{p.product_name}</h3>
                   <p className="text-slate-500 text-xs md:text-sm mb-8 font-light leading-relaxed">
                     Lô hàng được xác thực bảo chứng bởi {p.entity_id.slice(0, 8)}.
                   </p>
                   <Link href={`/verify?id=${p.id}`} className="mt-auto py-5 bg-natural-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all">
                      <Search size={16} />
                      Verify Asset
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
