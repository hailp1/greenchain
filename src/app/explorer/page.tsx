'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, Search, Cpu, Activity, ShieldCheck, 
  ArrowRight, Box, Zap, Layers, Menu, X, TrendingUp, BarChart3, Clock, Lock
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Explorer() {
  const [stats, setStats] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statRes, batchRes] = await Promise.all([
          fetch('http://localhost:3000/stats'),
          fetch('http://localhost:3000/batches')
        ]);
        const s = await statRes.json();
        const b = await batchRes.json();
        
        setStats({
          tps: s.throughput,
          nodes: s.activeNodes,
          blocks: s.blocksVerified
        });
        setBatches(b);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      {/* Search Header */}
      <div className="pt-24 bg-[#111b11] border-b border-white/5">
         <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-500">
               <Globe size={14} />
               <span>fwd LIFEchain Explorer v2.0</span>
            </div>
         </div>
      </div>

      {/* Main Stats Bar */}
      <section className="bg-[#111b11] text-white py-16 md:py-24 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {[
                 { label: "Active Nodes", value: stats?.nodes || "128", icon: Globe },
                 { label: "Blocks Verified", value: stats?.blocks?.toLocaleString() || "19.4M", icon: ShieldCheck },
                 { label: "Throughput", value: stats?.tps || "14.2", unit: "TPS", icon: Activity },
                 { label: "Network Security", value: "99.9%", unit: "", icon: Zap }
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md"
                 >
                    <div className="text-slate-500 mb-6"><stat.icon size={20} /></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <div className="flex items-end gap-2">
                       <span className="text-2xl md:text-3xl font-black tracking-tighter">{stat.value}</span>
                       {stat.unit && <span className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase">{stat.unit}</span>}
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-20 pb-20">
         <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/5 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Box size={14} className="text-emerald-500" /> Latest Transactions
               </h3>
            </div>
            <div className="divide-y divide-slate-50">
               {loading ? (
                 <div className="p-20 text-center text-slate-400">Loading ledger...</div>
               ) : batches.map((batch, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ x: 5 }}
                   className="p-6 flex items-center justify-between group cursor-pointer"
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          <Cpu size={18} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-blue-600 hover:underline">{batch.tx_hash ? batch.tx_hash.substring(0, 16) : 'Anchoring...'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(batch.timestamp).toLocaleTimeString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[11px] font-bold text-slate-900">{batch.product_name}</p>
                       <p className="text-[10px] font-mono text-slate-400">Status: {batch.status}</p>
                    </div>
                    <div className="hidden sm:block px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-black text-slate-500 uppercase">
                       {batch.quantity} KG
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
         <div className="mt-8">
            <Link href="/" className="text-xs font-bold uppercase text-slate-400 hover:text-emerald-600">← Back to Dashboard</Link>
         </div>
      </main>
    </div>
  );
}
