'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, Box, Zap, FileText, ArrowRight, Server, Globe, Database, Clock, Activity,
  ShieldCheck, RefreshCw, Layers, Cpu, Globe2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';
import useSWR from 'swr';
import { RPC_URL, RPC_PROXY_URL, TOKEN_SYMBOL } from '@/lib/contracts/config';

// Use proxy URL for client-side to bypass CORS
const getRpcProvider = () => {
  if (typeof window === 'undefined') return new ethers.JsonRpcProvider(RPC_URL, undefined, { staticNetwork: true });
  // In the browser, we use our local proxy route
  return new ethers.JsonRpcProvider(window.location.origin + RPC_PROXY_URL, undefined, { staticNetwork: true });
};

export default function ExplorerClient({ initialData }: { initialData: any }) {
  const rpcProviderRef = useRef<ethers.JsonRpcProvider | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    setMounted(true);
    rpcProviderRef.current = getRpcProvider();
  }, []);

  const handleSearch = () => {
    if (!searchVal) return;
    const val = searchVal.trim();
    if (val.length === 66 || val.startsWith('0x')) {
       if (val.length === 66) {
         window.location.href = `/explorer/tx/${val}`;
       } else if (val.length === 42) {
         window.location.href = `/explorer/address/${val}`;
       } else {
         window.location.href = `/explorer/address/${val}`;
       }
    } else if (!isNaN(Number(val)) && val !== '') {
       window.location.href = `/explorer/blocks/${val}`;
    }
  };

  const fetcher = async () => {
    const provider = rpcProviderRef.current;
    if (!provider) return initialData;

    const [rpcResult, sbResult] = await Promise.allSettled([
      (async () => {
        try {
          const [blockNum, feeData] = await Promise.all([
            provider.getBlockNumber(),
            provider.getFeeData()
          ]);
          const blockPromises = [];
          for (let i = 0; i < 6; i++) {
            if (blockNum - i >= 0) {
              blockPromises.push(provider.getBlock(blockNum - i).catch(() => null));
            }
          }
          const blocks = (await Promise.all(blockPromises)).filter(b => b !== null);
          return { blockNum, feeData, blocks };
        } catch (e) {
          console.warn('RPC Fetch failed:', e);
          return null;
        }
      })(),
      (async () => {
        const { data, count } = await supabase
          .from('token_transactions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(10);
        return { data, count };
      })()
    ]);

    const newData = { ...initialData };

    if (rpcResult.status === 'fulfilled' && rpcResult.value) {
      const { blockNum, feeData, blocks } = rpcResult.value;
      newData.stats.latestBlock = blockNum;
      newData.stats.gas_price = feeData?.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0.1';
      newData.latestBlocks = (blocks || []).map((b: any) => ({
        number: b.number,
        timestamp: b.timestamp * 1000,
        validator: b.miner || '0x...',
        transactionCount: b.transactions?.length || 0,
        reward: `0.01402 ${TOKEN_SYMBOL}`
      }));
      newData.rpcError = false;
    } else {
      newData.rpcError = true;
    }

    if (sbResult.status === 'fulfilled' && sbResult.value) {
      const { data: sbTxData, count: txCount } = sbResult.value;
      if (sbTxData) {
        newData.latestTxns = sbTxData.map((tx: any) => ({
          hash: tx.id.replace(/-/g, '').substring(0, 40),
          timestamp: new Date(tx.created_at).getTime(),
          from: tx.sender_address || '0x000...000',
          to: tx.receiver_address || '0x000...000',
          value: `${tx.amount}`
        }));
        newData.stats.totalTx = (txCount || 0).toLocaleString();
      }
    }
    
    return newData;
  };

  const hasSynced = useRef(false);
  const { data, isLoading } = useSWR('explorer_home_data_v3', fetcher, {
    fallbackData: initialData,
    refreshInterval: 15000,
    revalidateOnFocus: true,
    onSuccess: () => {
      if (!hasSynced.current) {
        fetch('/api/explorer/sync').catch(() => {});
        hasSynced.current = true;
      }
    }
  });

  if (!mounted) return null;

  const stats = data?.stats || initialData.stats;
  const latestBlocks = data?.latestBlocks || initialData.latestBlocks;
  const latestTxns = data?.latestTxns || initialData.latestTxns;
  const rpcError = data?.rpcError ?? (initialData.stats.latestBlock === 0);

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header />
      
      {/* ── Hero Section: High-End Institutional Aesthetic ── */}
      <section className="relative pt-44 pb-32 bg-[#0a1a0a] text-white overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-40">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_50%)] animate-pulse" />
           <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-md"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Green Chain Core Ledger v4.0</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.95]"
            >
              The <span className="text-emerald-500">Green</span> <br />
              Explorer
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group max-w-2xl"
            >
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center">
                <Search className="absolute left-7 text-slate-500" size={20} />
                <input 
                  type="text" 
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search Address / Txn Hash / Block Height..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-7 pl-16 pr-8 text-sm md:text-base font-bold focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 backdrop-blur-2xl transition-all"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 px-8 py-4 bg-emerald-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/30 active:scale-95"
                >
                  Query Ledger
                </button>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-16">
            {[
              { label: `${TOKEN_SYMBOL} Price`, val: `$${stats.price}`, icon: Zap, color: 'emerald' },
              { label: 'Latest Block', val: (rpcError && stats.latestBlock === 0) ? 'Connecting...' : `#${stats.latestBlock.toLocaleString()}`, icon: Layers, color: 'blue' },
              { label: 'Transactions', val: stats.totalTx === '0' ? 'Syncing...' : stats.totalTx, icon: Database, color: 'purple' },
              { label: 'Network TPS', val: stats.tps, icon: Activity, color: 'amber' }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md hover:bg-white/10 transition-all group border-l-4 border-l-emerald-500/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                    <s.icon size={18} />
                  </div>
                  {i === 1 && rpcError && <RefreshCw size={12} className="animate-spin text-amber-400" />}
                </div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl font-black italic tracking-tighter truncate">{s.val}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 space-y-12 pb-32">
        {rpcError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 shadow-xl shadow-amber-900/5">
            <AlertCircle size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest">Mainnet Node Syncing: Block data may be slightly delayed.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* Latest Blocks Table */}
          <section className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs font-black text-slate-900 uppercase italic tracking-[0.2em]">Live Block Pulse</h3>
               </div>
               <Link href="/explorer/blocks" className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1 group">
                 View History <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
            <div className="divide-y divide-slate-100">
               {latestBlocks.length === 0 ? (
                 <div className="p-24 text-center space-y-4">
                    <RefreshCw size={32} className="mx-auto text-emerald-100 animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Block Propagation...</p>
                 </div>
               ) : latestBlocks.map((b: any) => (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   key={b.number} 
                   className="p-8 hover:bg-emerald-50/30 transition-colors flex items-center justify-between group"
                 >
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center font-black text-xs border border-emerald-100 group-hover:scale-110 transition-transform shadow-sm">
                          {b.number.toString().slice(-2)}
                       </div>
                       <div>
                          <Link href={`/explorer/blocks/${b.number}`} className="text-base font-black text-slate-900 hover:text-emerald-600 transition-colors">#{b.number.toLocaleString()}</Link>
                          <div className="flex items-center gap-2 mt-1">
                             <Clock size={10} className="text-slate-400" />
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                               {Math.max(0, Math.floor((Date.now() - b.timestamp)/1000))}s ago
                             </p>
                          </div>
                       </div>
                    </div>
                    <div className="text-right space-y-1">
                       <p className="text-[10px] font-black text-slate-900 uppercase">Miner: {b.validator.slice(0, 10)}...</p>
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[8px] font-black uppercase">
                          {b.transactionCount} Transactions
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
          </section>

          {/* Latest Transactions Table */}
          <section className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <h3 className="text-xs font-black text-slate-900 uppercase italic tracking-[0.2em]">Token Flow</h3>
               </div>
               <Link href="/explorer/transactions" className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1 group">
                 Inspect All <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
            <div className="divide-y divide-slate-100">
               {latestTxns.length === 0 ? (
                 <div className="p-24 text-center space-y-4">
                    <Activity size={32} className="mx-auto text-blue-100" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listening for Network Events...</p>
                 </div>
               ) : (
                 latestTxns.map((tx: any) => (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   key={tx.hash} 
                   className="p-8 hover:bg-blue-50/30 transition-colors flex items-center justify-between group"
                 >
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center font-black text-xs border border-blue-100 group-hover:scale-110 transition-transform shadow-sm">
                          TX
                       </div>
                       <div className="min-w-0">
                          <Link href={`/explorer/tx/${tx.hash}`} className="text-base font-black text-slate-900 hover:text-blue-600 transition-colors block truncate w-32 md:w-56">{tx.hash}</Link>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            Confirmed {Math.max(0, Math.floor((Date.now() - tx.timestamp)/1000))}s ago
                          </p>
                       </div>
                    </div>
                    <div className="text-right space-y-2">
                       <div className="text-sm font-black text-emerald-600 italic">+{Number(tx.value).toLocaleString()} {TOKEN_SYMBOL}</div>
                       <div className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md">
                         From: {tx.from.slice(0, 10)}...
                       </div>
                    </div>
                 </motion.div>
                 ))
               )}
            </div>
          </section>

        </div>

        {/* ── Visual Proof Section ── */}
        <section className="bg-[#0a1a0a] rounded-[4rem] p-12 md:p-20 relative overflow-hidden text-center space-y-10">
           <div className="absolute inset-0 opacity-10">
              <Globe size={400} className="absolute -right-20 -bottom-20 text-emerald-500" />
           </div>
           <div className="max-w-3xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                 Immutable <span className="text-emerald-500">Core</span> Infrastructure
              </h2>
              <p className="text-slate-400 font-medium leading-relaxed italic text-sm md:text-lg">
                 Green Chain leverages advanced cryptographic signatures to ensure every micro-transaction in the sustainable economy is publicly auditable and permanent.
              </p>
              <div className="flex flex-wrap justify-center gap-8 pt-8">
                 <div className="flex flex-col items-center gap-3">
                    <ShieldCheck size={24} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Certified Origin</span>
                 </div>
                 <div className="flex flex-col items-center gap-3">
                    <Cpu size={24} className="text-blue-500" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">ASIC Resistant</span>
                 </div>
                 <div className="flex flex-col items-center gap-3">
                    <Globe2 size={24} className="text-purple-500" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Zero Knowledge</span>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
