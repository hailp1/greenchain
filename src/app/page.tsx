'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck, Search, Package, QrCode, Star, Layers, Zap, Globe, Activity, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Initialise component
  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        // Recent verified batches
        const { data: batches } = await supabase
          .from('batches')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(3);
        setProducts(batches || []);

        // Network‑level statistics (synthetic for demo)
        const { count: batchCount } = await supabase
          .from('batches')
          .select('*', { count: 'exact', head: true });
        const { count: entityCount } = await supabase
          .from('entities')
          .select('*', { count: 'exact', head: true });

        setStats({
          activeNodes: (entityCount || 0) + 120,
          blocksVerified: (batchCount || 0) * 15 + 19400,
          throughput: "14.2",
          securityLevel: "99.9%"
        });
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  if (!mounted) return null;

  // Highlight the core cryptographic innovations that power fwd LIFEchain
  const algorithmHighlights = [
    {
      title: "Zero‑Knowledge Rollups",
      description: "Batch‑execute transactions off‑chain while preserving full public verifiability, boosting Ethereum TPS by an order of magnitude.",
      icon: ShieldCheck,
      color: "text-blue-600"
    },
    {
      title: "BLS Multi‑Signature Aggregation",
      description: "Compress thousands of signatures into a single constant‑size proof, reducing bandwidth for both Ethereum and BSC.",
      icon: Globe,
      color: "text-emerald-600"
    },
    {
      title: "DAG‑Based Ordering",
      description: "A directed‑acyclic‑graph consensus layer mitigates transaction bottlenecks and improves finality speed.",
      icon: Activity,
      color: "text-amber-600"
    },
    {
      title: "AI‑Driven Anomaly Detection",
      description: "Machine‑learning models flag suspicious patterns in real‑time, strengthening security across chains.",
      icon: Zap,
      color: "text-purple-600"
    }
  ];

  const networkStats = [
    { label: "Current Block", value: stats?.blocksVerified?.toLocaleString() || "#19,450,300", icon: Layers, color: "text-emerald-500" },
    { label: "Network TPS", value: "12.3 / 1.5k", icon: Zap, color: "text-blue-500" },
    { label: "Active Nodes", value: "1,204", icon: Globe, color: "text-amber-500" },
    { label: "Total Value Locked", value: "84.2M AGRI", icon: ShieldCheck, color: "text-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a2f1a] overflow-x-hidden">
      <Header />
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-12">
        {/* Hero Section – premium, research‑centric */}
        <header className="mb-20 md:mb-32 text-center relative px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 text-[10px] md:text-xs font-bold mb-6 md:mb-8 uppercase tracking-widest">
              <Star size={14} className="text-slate-400" />
              <span>fwd LIFEchain – Trust‑Engineered Agritech</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 text-natural-950 tracking-tighter leading-[1.1]">
              Transparent <span className="text-emerald-500 italic">Agriculture</span>
            </h1>
            <p className="text-slate-500 text-xs md:text-base lg:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-8 md:mb-12 px-4">
              A research‑grade blockchain platform that fuses advanced cryptography with rigorous academic theory to certify the provenance and quality of agricultural products.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 max-w-lg mx-auto">
              <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-natural-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95 transition-all text-sm">
                <QrCode size={18} /> Verify Origin
              </Link>
              <Link href="/explorer" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-sm">
                <Search size={18} /> Explorer Network
              </Link>
            </div>
          </motion.div>
        </header>

        {/* Algorithm Highlights – showcase the technical edge */}
        <section className="mb-24 md:mb-40">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-natural-950 mb-12 text-center uppercase tracking-wider italic">Technical <span className="text-emerald-500">Pillars</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithmHighlights.map((alg, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className={`p-6 bg-white rounded-[2rem] border border-slate-100 shadow-lg flex flex-col justify-between h-full`}
              >
                <div>
                   <div className={`${alg.color} mb-4`}><alg.icon size={24} /></div>
                   <h3 className="text-lg md:text-xl font-black text-natural-900 mb-2">{alg.title}</h3>
                   <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{alg.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live Network Pulse */}
        <section className="mb-24 md:mb-40">
          <div className="flex items-center gap-3 mb-10 md:mb-16">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-natural-900 text-white flex items-center justify-center shadow-xl shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tighter uppercase italic">Network <span className="text-emerald-500">Pulse</span></h2>
              <p className="text-slate-400 text-[8px] md:text-xs font-bold uppercase tracking-widest">Real‑time AGRI Lifechain Activity</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {networkStats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 md:p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col justify-between"
              >
                <div className={`${stat.color} mb-6`}><stat.icon size={20} /></div>
                <div>
                  <p className="text-xl md:text-3xl lg:text-4xl font-black text-natural-900 tracking-tighter mb-1 truncate">{stat.value}</p>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Latest Insights Section */}
        <section className="mb-24 md:mb-40">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Campaign & Research
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                    Latest <span className="text-emerald-500">Insights</span>
                 </h2>
              </div>
              <Link href="/news" className="group flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                 View all articles <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Featured Post */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                 <Link href="/news/so-hoa-niem-tin-nong-san-viet">
                    <div className="space-y-8">
                       <div className="relative aspect-[16/9] overflow-hidden rounded-[3rem] shadow-2xl bg-slate-100">
                          <img 
                            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt="Campaign"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent"></div>
                       </div>
                       <div className="space-y-4 px-2">
                          <div className="flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                             <Zap size={12} fill="currentColor" /> Trending Now
                          </div>
                          <h3 className="text-3xl md:text-4xl font-black text-natural-950 group-hover:text-emerald-500 transition-colors leading-tight">
                             Số hóa niềm tin: Miễn phí 100% giải pháp Blockchain cho nông dân Việt Nam
                          </h3>
                          <p className="text-slate-500 font-light text-lg leading-relaxed line-clamp-2">
                             Chiến dịch 'Nâng tầm nông sản Việt' chính thức khởi động, mang công nghệ ST-PoO đến với các HTX và hộ nông dân tiên phong...
                          </p>
                       </div>
                    </div>
                 </Link>
              </motion.div>

              {/* Smaller Posts Column */}
              <div className="space-y-12">
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="group flex gap-8 items-start cursor-pointer"
                 >
                    <div className="w-1/3 aspect-square rounded-[2rem] overflow-hidden bg-slate-100 shrink-0">
                       <img src="https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Article" />
                    </div>
                    <div className="space-y-3 pt-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">May 08, 2026</span>
                       <h4 className="text-xl font-black text-natural-950 group-hover:text-emerald-500 transition-colors leading-tight">Giao thức ST-PoO: Bước đột phá trong xác thực nguồn gốc nông sản</h4>
                       <p className="text-slate-500 text-sm font-light line-clamp-2">Nghiên cứu mới về sự kết hợp giữa IoT và Blockchain giúp giải quyết bài toán minh bạch.</p>
                    </div>
                 </motion.div>

                 <div className="h-px bg-slate-100"></div>

                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.1 }}
                   viewport={{ once: true }}
                   className="group flex gap-8 items-start cursor-pointer"
                 >
                    <div className="w-1/3 aspect-square rounded-[2rem] overflow-hidden bg-slate-100 shrink-0">
                       <img src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Article" />
                    </div>
                    <div className="space-y-3 pt-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">April 24, 2026</span>
                       <h4 className="text-xl font-black text-natural-950 group-hover:text-emerald-500 transition-colors leading-tight">Blockchain vs Truy xuất truyền thống: Sự khác biệt nằm ở đâu?</h4>
                       <p className="text-slate-500 text-sm font-light line-clamp-2">Phân tích chuyên sâu về tính bất biến và khả năng chống gian lận của hệ thống phi tập trung.</p>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
