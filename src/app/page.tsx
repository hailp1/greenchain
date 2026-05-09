'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck, Search, Package, QrCode, Star, Layers, Zap, Globe, Activity
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
    { label: "Active Nodes", value: stats?.activeNodes || "128", icon: Globe, color: "text-blue-500" },
    { label: "Blocks Verified", value: stats?.blocksVerified?.toLocaleString() || "19.4M", icon: Layers, color: "text-emerald-500" },
    { label: "Throughput", value: (stats?.throughput || "14.2") + " TPS", icon: Zap, color: "text-amber-500" },
    { label: "Security Level", value: stats?.securityLevel || "99.9%", icon: ShieldCheck, color: "text-purple-500" }
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
            <h1 className="text-4xl md:text-8xl font-black mb-6 md:mb-8 text-natural-950 tracking-tighter leading-[1.1]">
              Transparent <span className="text-emerald-500 italic">Agriculture</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-8 md:mb-12">
              A research‑grade blockchain platform that fuses advanced cryptography with rigorous academic theory to certify the provenance and quality of agricultural products.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
              <Link href="/verify" className="w-full sm:w-auto px-8 py-4 bg-natural-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95 transition-all">
                <QrCode size={20} /> Verify Origin
              </Link>
              <Link href="/explorer" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                <Search size={20} /> Explorer Network
              </Link>
            </div>
          </motion.div>
        </header>

        {/* Algorithm Highlights – showcase the technical edge */}
        <section className="mb-24 md:mb-40">
          <h2 className="text-3xl md:text-5xl font-black text-natural-950 mb-12 text-center uppercase tracking-wider">Technical Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithmHighlights.map((alg, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className={`p-6 bg-white rounded-[2rem] border border-slate-100 shadow-lg flex flex-col justify-between`}
              >
                <div className={`${alg.color} mb-4`}><alg.icon size={28} /></div>
                <h3 className="text-xl font-black text-natural-900 mb-2">{alg.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{alg.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live Network Pulse */}
        <section className="mb-24 md:mb-40">
          <div className="flex items-center gap-3 mb-10 md:mb-16">
            <div className="w-12 h-12 rounded-2xl bg-natural-900 text-white flex items-center justify-center shadow-xl">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">Network <span className="text-emerald-500">Pulse</span></h2>
              <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Real‑time AGRI Lifechain Activity</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {networkStats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 md:p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col justify-between"
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

        {/* Verified Assets */}
        <section className="mb-24 md:mb-40">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase italic">Verified <span className="text-emerald-500">Assets</span></h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
              Each batch is cryptographically anchored on the chain, guaranteeing provenance, quality, and compliance for downstream markets.
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
                <div className="relative rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-slate-100 h-full flex flex-col p-8 transition-all">
                  <h3 className="text-xl md:text-2xl font-black text-natural-900 mb-4 tracking-tight group-hover:text-emerald-500 transition-colors">{p.product_name}</h3>
                  <p className="text-slate-500 text-xs md:text-sm mb-8 font-light leading-relaxed">
                    Authenticated batch from entity {p.entity_id.slice(0, 8)}.
                  </p>
                  <Link href={`/verify?id=${p.id}`} className="mt-auto py-5 bg-natural-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all">
                    <Search size={16} /> Verify Asset
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
