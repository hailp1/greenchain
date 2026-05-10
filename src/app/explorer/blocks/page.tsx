'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, Search, Box, Clock, ChevronRight, 
  ShieldCheck, ArrowLeft, Filter, Cpu, Pickaxe, Activity,
  Zap, Layers, Server, Database
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { ethers } from 'ethers';

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [liveBlocks, setLiveBlocks] = useState<any[]>([]);
  const [latestBlockNum, setLatestBlockNum] = useState<number>(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnchoredData = async () => {
      try {
        setLoading(true);
        const { data, count, error } = await supabase
          .from('blockchain_ledger')
          .select('*', { count: 'exact' })
          .order('block_height', { ascending: false })
          .limit(15);
        
        if (error) throw error;
        
        setBlocks(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Fetch blocks error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnchoredData();
  }, []);

  // Web3 Live Blocks Polling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchLiveBlocks = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        const currentBlock = await provider.getBlockNumber();
        
        if (currentBlock === latestBlockNum) return;
        
        setLatestBlockNum(currentBlock);
        
        const blockPromises = [];
        for (let i = 0; i < 6; i++) {
          if (currentBlock - i >= 0) {
            blockPromises.push(provider.getBlock(currentBlock - i));
          }
        }
        
        const fetchedBlocks = await Promise.all(blockPromises);
        setLiveBlocks(fetchedBlocks.filter(b => b !== null));
      } catch (err) {
        console.error("Live Web3 blocks error:", err);
      }
    };

    fetchLiveBlocks();
    interval = setInterval(fetchLiveBlocks, 3000);
    return () => clearInterval(interval);
  }, [latestBlockNum]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Header />
      
      {/* Institutional Header Section */}
      <section className="pt-40 pb-20 bg-[#020617] text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 0.5px, transparent 0)', backgroundSize: '48px 48px' }}></div>
         </div>
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                     <Box size={12} className="text-blue-400" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Blockchain Ledger Feed</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">Verified <span className="text-blue-500">Blocks</span></h1>
                  <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl italic">
                     Real-time monitoring of fwd LIFEchain blocks, PoA consensus, and finality status.
                  </p>
               </div>
               <div className="flex gap-4">
                  <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Height</p>
                     <p className="text-2xl font-black text-white italic">#{latestBlockNum.toLocaleString()}</p>
                  </div>
                  <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg. Block Time</p>
                     <p className="text-2xl font-black text-emerald-400 italic">3.0s</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20 space-y-12 pb-24">
         
         {/* Live Visual Feed */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
               {liveBlocks.slice(0, 3).map((blk, idx) => (
                 <motion.div 
                   key={blk.hash}
                   layout
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: -20 }}
                   className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 relative overflow-hidden group"
                 >
                    {idx === 0 && (
                       <div className="absolute inset-0 bg-blue-500/[0.02] animate-pulse"></div>
                    )}
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-8">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${idx === 0 ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-100 text-slate-400'}`}>
                             <Layers size={22} />
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transactions</p>
                             <p className="text-xl font-black text-slate-900">{blk.transactions?.length || 0}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Block Height</p>
                             <Link href={`/explorer/blocks/${blk.number}`} className="text-2xl font-black text-blue-600 hover:underline">#{blk.number}</Link>
                          </div>
                          
                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Server size={12} className="text-slate-400" />
                                <span className="text-[10px] font-mono font-bold text-slate-500">{blk.miner.substring(0, 14)}...</span>
                             </div>
                             <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">PoA SECURE</span>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </AnimatePresence>
         </div>

         {/* Historical Ledger Table */}
         <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Ledger <span className="text-blue-600">History</span></h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Permanent cryptographic record of network activity</p>
               </div>
               <div className="flex gap-3">
                  <div className="relative">
                     <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Filter block height..." 
                       className="bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-full md:w-64"
                     />
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Height</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transactions</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Validator / Miner</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reward Type</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading ? (
                       <tr><td colSpan={6} className="px-8 py-24 text-center text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing with mainnet ledger...</td></tr>
                     ) : blocks.map((block, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                   #{block.block_height.toString().slice(-2)}
                                </div>
                                <span className="text-sm font-black text-slate-900">#{block.block_height}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 text-slate-500">
                                <Clock size={12} />
                                <span className="text-[11px] font-bold uppercase">{new Date(block.anchored_at).toLocaleString()}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                1 Internal
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-[11px] font-mono font-bold text-blue-600">PoA Authority Node</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protocol Reward</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <Link href={`/explorer/blocks/${block.block_height}`} className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                                Details <ChevronRight size={14} />
                             </Link>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Verified: {totalCount.toLocaleString()} Blocks</p>
               <div className="flex gap-2">
                  <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-all" disabled>Previous</button>
                  <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100 transition-all shadow-sm">Next Page</button>
               </div>
            </div>
         </div>
      </main>
      
      <Footer />
    </div>
  );
}
