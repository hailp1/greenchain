'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, Search, Box, Clock, ChevronRight, 
  ShieldCheck, ArrowLeft, Filter, Cpu, Pickaxe, Activity
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
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
          .limit(10);
        
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
        
        // Prevent unnecessary state updates if no new block
        if (currentBlock === latestBlockNum) return;
        
        setLatestBlockNum(currentBlock);
        
        // Fetch last 6 actual blockchain blocks
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
    // Poll every 3 seconds to catch Geth's PoA block generation
    interval = setInterval(fetchLiveBlocks, 3000);
    return () => clearInterval(interval);
  }, [latestBlockNum]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-20">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-24">
           <div>
             <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Blockchain <span className="text-emerald-500">Live Mining</span></h1>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-emerald-500 animate-pulse" />
                Network Height: {latestBlockNum > 0 ? latestBlockNum.toLocaleString() : 'Connecting to rpc.fwdlife.vn...'}
             </p>
           </div>
        </div>

        {/* Live Web3 Block Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
           {liveBlocks.length === 0 ? (
              <div className="col-span-full p-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 rounded-3xl animate-pulse">
                 Syncing with Validator Nodes...
              </div>
           ) : liveBlocks.map((blk, idx) => (
             <motion.div 
               key={blk.hash}
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-900/5 relative overflow-hidden group"
             >
                {/* Glow effect for the newest block */}
                {idx === 0 && (
                   <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none animate-pulse"></div>
                )}
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${idx === 0 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-400'}`}>
                         <Pickaxe size={18} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Block Mined</p>
                         <p className="text-lg font-black text-slate-900">#{blk.number}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Transactions</p>
                      <p className="text-sm font-black text-emerald-600">{blk.transactions?.length || 0} Txn</p>
                   </div>
                </div>

                <div className="space-y-3 relative z-10">
                   <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-400">Validator</span>
                      <span className="font-mono font-bold text-blue-600">{blk.miner.substring(0, 10)}...</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-400">Gas Used</span>
                      <span className="font-black text-slate-700">{Number(blk.gasUsed).toLocaleString()}</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-400">Timestamp</span>
                      <span className="font-bold text-slate-700">{new Date(blk.timestamp * 1000).toLocaleTimeString('vi-VN')}</span>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
           <div>
             <h2 className="text-xl font-black tracking-tight mb-1">Anchored Data Blocks</h2>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Permanent ledger entries recorded on-chain</p>
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
                               <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Network Consensus</span>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                               Auto-Calculated
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
