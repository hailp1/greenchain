'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, Search, Box, Clock, ChevronRight, 
  ShieldCheck, ArrowLeft, Filter, Cpu
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, count, error } = await supabase
          .from('blockchain_ledger')
          .select('*', { count: 'exact' })
          .order('block_height', { ascending: false })
          .limit(25);
        
        if (error) throw error;
        
        setBlocks(data || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Fetch blocks error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-20">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-24">
           <div>
             <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Blockchain <span className="text-emerald-500">Blocks</span></h1>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <Box size={12} className="text-emerald-500" />
                Network Height: {totalCount > 0 ? blocks[0]?.block_height.toLocaleString() : 'Loading...'}
             </p>
           </div>
           <div className="flex gap-4">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
                 <Filter size={12} /> FILTER
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Block Height</th>
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Anchored At</th>
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tx Hash</th>
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Validator</th>
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reward</th>
                    </tr>
                 </thead>
                 <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="px-6 py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Synchronizing Ledger...</td></tr>
                    ) : blocks.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">No blocks found on mainnet</td></tr>
                    ) : blocks.map((block, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors group">
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                  <Box size={14} />
                               </div>
                               <span className="text-xs font-black text-blue-600 cursor-pointer hover:underline">#{block.block_height}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{new Date(block.anchored_at).toLocaleString()}</span>
                         </td>
                         <td className="px-6 py-5">
                            <Link href={`/explorer/${block.tx_hash}`} className="text-[11px] font-mono text-slate-400 group-hover:text-blue-600 transition-colors cursor-pointer hover:underline">{block.tx_hash.slice(0, 20)}...</Link>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                               <Cpu size={12} className="text-emerald-500" />
                               <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">fwd-node-{block.block_height % 100}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                               0.50 FWD
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: {totalCount.toLocaleString()} Blocks Verified</p>
              <div className="flex gap-2">
                 <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
                    <ChevronRight size={16} className="rotate-180" />
                 </button>
                 <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
                    <ChevronRight size={16} />
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
