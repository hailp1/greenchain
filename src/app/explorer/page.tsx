'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/store/nosql-sim';
import { 
  Globe, Search, Cpu, Activity, ShieldCheck, 
  ArrowRight, Box, Zap, Layers, Menu, X, TrendingUp, BarChart3, Clock, Lock
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { API_URL } from '@/lib/config';
import { supabase } from '@/lib/supabase';

export default function ExplorerHome() {
  const [stats, setStats] = useState<any>(null);
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [latestTxns, setLatestTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Batches with Ledger info
        const { data: batches, error: bError } = await supabase
          .from('batches')
          .select('*, blockchain_ledger(tx_hash, block_height, anchored_at)')
          .order('timestamp', { ascending: false })
          .limit(10);

        if (bError) throw bError;

        // 2. Fetch Entities count for stats
        const { count: entityCount } = await supabase
          .from('entities')
          .select('*', { count: 'exact', head: true });

        setStats({
          price: '$1.42',
          price_change: '+2.4%',
          market_cap: 'Verified',
          tps: '14.2',
          gas_price: '1.2 fwd',
          activeNodes: (entityCount || 0) + 12 // Real entities + seed validators
        });
        
        // Real blocks from ledger
        setLatestBlocks((batches || []).filter(b => b.blockchain_ledger?.[0]).map((batch: any, i: number) => ({
          number: batch.blockchain_ledger?.[0]?.block_height,
          timestamp: batch.blockchain_ledger?.[0]?.anchored_at,
          validator: "fwd-node-" + batch.id.slice(0, 4),
          transactionCount: 1,
          reward: "0.50 fwd"
        })));
        
        setLatestTxns((batches || []).filter((batch: any) => batch.blockchain_ledger?.[0]?.tx_hash).map((batch: any) => ({
          hash: batch.blockchain_ledger?.[0]?.tx_hash,
          timestamp: batch.blockchain_ledger?.[0]?.anchored_at || batch.timestamp,
          from: batch.id.slice(0, 8),
          to: "0xLedger",
          value: "GAS: 1.2 fwd"
        })));
      } catch (err: any) {
        console.error('Explorer fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      <Header />
      
      {/* Search Header for Explorer */}
      <div className="pt-24 bg-[#111b11] border-b border-white/5">
         <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-500">
               <Globe size={14} />
               <span>Explorer Protocol v2.0</span>
            </div>
            <div className="relative max-w-md w-full hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
               <input 
                 type="text" 
                 placeholder="Search by Address / Txn Hash / Block..." 
                 className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
               />
            </div>
         </div>
      </div>

      {/* Main Stats Bar - Dashboard Style */}
      <section className="bg-[#111b11] text-white py-16 md:py-24 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #34d399 0.5px, transparent 0)', backgroundSize: '48px 48px' }}></div>
         </div>
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
         
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
               <div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-2">Network <span className="text-emerald-500">Command Center</span></h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Real-time Blockchain Intelligence & Global Audit</p>
               </div>
               <div className="flex gap-4">
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Sync Status: 100%</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {[
                 { label: "AGRI Price", value: stats?.price || "$1.42", change: stats?.price_change || "+2.4%", icon: TrendingUp },
                 { label: "Network Cap", value: stats?.market_cap || "$2.5B", change: "Locked", icon: ShieldCheck },
                 { label: "Throughput", value: stats?.tps || "14.2", unit: "TPS", icon: Activity },
                 { label: "Avg. Gas", value: stats?.gas_price || "12 Gwei", unit: "", icon: Zap }
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group"
                 >
                    <div className="text-slate-500 group-hover:text-emerald-500 transition-colors mb-6"><stat.icon size={20} /></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <div className="flex items-end gap-2">
                       <span className="text-2xl md:text-3xl font-black tracking-tighter">{stat.value}</span>
                       {stat.unit && <span className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase">{stat.unit}</span>}
                       {stat.change && !stat.unit && <span className="text-[9px] font-bold text-emerald-400 mb-1.5">{stat.change}</span>}
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Latest Blocks */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/5 border border-slate-100 overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <Box size={14} className="text-emerald-500" /> Latest Blocks
                  </h3>
                  <Link href="/explorer/blocks" className="px-4 py-1.5 bg-natural-900 text-white rounded-full text-[9px] font-black hover:bg-black transition-all">VIEW ALL</Link>
               </div>
               <div className="divide-y divide-slate-50">
                  {latestBlocks.map((block, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 5 }}
                      className="p-6 flex items-center justify-between group cursor-pointer"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                             <Layers size={18} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-blue-600 hover:underline">{block.number}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(block.timestamp).toLocaleTimeString()}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[11px] font-bold text-slate-900">Validated by <span className="text-blue-600 hover:underline">{block.validator}</span></p>
                          <p className="text-[10px] font-mono text-slate-400">{block.transactionCount} txns in 12s</p>
                       </div>
                       <div className="hidden sm:block px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-black text-slate-500">
                          {block.reward}
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* Latest Transactions */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/5 border border-slate-100 overflow-hidden">
               <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <Zap size={14} className="text-amber-500" /> Latest Transactions
                  </h3>
                  <Link href="/explorer/transactions" className="px-4 py-1.5 bg-natural-900 text-white rounded-full text-[9px] font-black hover:bg-black transition-all">VIEW ALL</Link>
               </div>
               <div className="divide-y divide-slate-50">
                  {latestTxns.map((tx, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 5 }}
                      className="p-6 flex items-center justify-between group cursor-pointer"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                             <Cpu size={18} />
                          </div>
                          <div className="min-w-0">
                             <p className="text-sm font-black text-blue-600 hover:underline truncate max-w-[120px]">{tx.hash.substring(0, 16)}...</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                          </div>
                       </div>
                       <div className="flex-1 px-8 hidden md:block">
                          <div className="flex items-center gap-2 text-[11px] font-bold">
                             <span className="text-slate-400">From</span>
                             <span className="text-blue-600 hover:underline truncate max-w-[80px]">{tx.from}</span>
                             <span className="text-slate-400">To</span>
                             <span className="text-blue-600 hover:underline truncate max-w-[80px]">{tx.to}</span>
                          </div>
                       </div>
                       <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100 text-[10px] font-black text-emerald-600">
                          {tx.value === "0 ETH" ? "METHOD" : tx.value}
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

         </div>
      </main>
    </div>
  );
}
