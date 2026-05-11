'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, Box, Zap, FileText, ArrowRight, Server, Globe, Database, Clock, Activity
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';
import useSWR from 'swr';

const RPC_URL = "https://rpc.fwdlife.vn";
const rpcProvider = new ethers.JsonRpcProvider(RPC_URL, undefined, { staticNetwork: true });

export default function ExplorerClient({ initialData }: { initialData: any }) {
  const [mounted, setMounted] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    setMounted(true);
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
    // Run RPC and Supabase in PARALLEL
    const [rpcResult, sbResult] = await Promise.allSettled([
      (async () => {
        try {
          const [blockNum, feeData] = await Promise.all([
            rpcProvider.getBlockNumber(),
            rpcProvider.getFeeData()
          ]);
          const blockPromises = [];
          for (let i = 0; i < 6; i++) {
            if (blockNum - i >= 0) {
              blockPromises.push(rpcProvider.getBlock(blockNum - i).catch(() => null));
            }
          }
          const blocks = (await Promise.all(blockPromises)).filter(b => b !== null);
          return { blockNum, feeData, blocks };
        } catch (e) {
          console.warn('RPC Fetch failed (CORS or Network):', e);
          return initialData.stats;
        }
      })(),
      (async () => {
        const sbPromise = supabase
          .from('token_transactions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(6);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase timeout')), 10000));
        return await Promise.race([sbPromise, timeoutPromise]) as any;
      })()
    ]);

    const newData = { ...initialData };

    if (rpcResult.status === 'fulfilled') {
      const { blockNum, feeData, blocks } = rpcResult.value;
      newData.stats.latestBlock = blockNum;
      newData.stats.gas_price = feeData?.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0.1';
      newData.latestBlocks = blocks.map((b: any) => ({
        number: b.number,
        timestamp: b.timestamp * 1000,
        validator: b.miner || '0x...',
        transactionCount: b.transactions?.length || 0,
        reward: "0.01402 AGRI"
      }));
    }

    if (sbResult.status === 'fulfilled') {
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
  const { data, isLoading } = useSWR('explorer_home_data', fetcher, {
    fallbackData: initialData,
    refreshInterval: 15000,
    revalidateOnFocus: true,
    onSuccess: () => {
      // Trigger background sync ONLY ONCE on mount
      if (!hasSynced.current) {
        fetch('/api/explorer/sync').catch(() => {});
        hasSynced.current = true;
      }
    }
  });

  const stats = data?.stats || initialData.stats;
  const latestBlocks = data?.latestBlocks || initialData.latestBlocks;
  const latestTxns = data?.latestTxns || initialData.latestTxns;

  if (!mounted) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
       <div className="animate-pulse text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Initializing Institutional Ledger...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <Header />
      
      {/* Search Hero */}
      <section className="pt-40 pb-24 bg-[#020617] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 0.5px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 space-y-12">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Globe size={12} className="text-blue-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Institutional Ledger v2.1</span>
             </div>
             <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">fwd <span className="text-blue-500">LIFE</span>chain Explorer</h1>
          </div>

          <div className="relative max-w-3xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by Address / Txn Hash / Block..."
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-sm md:text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-xl transition-all"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
            >
              Find
            </button>
          </div>

          {/* Core Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-8">
             {[
               { label: 'AGRI Price', val: `$${stats.price}`, icon: Zap, color: 'text-amber-400' },
               { label: 'Latest Block', val: `#${stats.latestBlock.toLocaleString()}`, icon: Box, color: 'text-blue-400' },
               { label: 'Total Transactions', val: stats.totalTx, icon: FileText, color: 'text-emerald-400' },
               { label: 'Gas Price', val: `${stats.gas_price} Gwei`, icon: Server, color: 'text-purple-400' }
             ].map((s, i) => (
               <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md group hover:bg-white/10 transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${s.color}`}>
                     <s.icon size={20} />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-xl font-black italic tracking-tight">{s.val}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 relative z-20 space-y-12 pb-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Latest Blocks */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-widest">Latest Blocks</h3>
                  <Link href="/explorer/blocks" className="text-[10px] font-black text-blue-600 uppercase hover:underline">View All</Link>
               </div>
               <div className="divide-y divide-slate-100">
                  {isLoading && latestBlocks.length === 0 ? (
                    <div className="p-12 text-center text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Chain State...</div>
                  ) : latestBlocks.map((b: any) => (
                    <div key={b.number} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">BK</div>
                          <div>
                             <Link href={`/explorer/blocks/${b.number}`} className="text-sm font-black text-blue-600 hover:underline">#{b.number}</Link>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">{Math.floor((Date.now() - b.timestamp)/1000)}s ago</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-900 uppercase">Miner: {b.validator.slice(0, 10)}...</p>
                          <p className="text-[10px] text-blue-500 font-bold uppercase">{b.transactionCount} Txns</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Latest Transactions */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-widest">Latest Transactions</h3>
                  <Link href="/explorer/transactions" className="text-[10px] font-black text-blue-600 uppercase hover:underline">View All</Link>
               </div>
               <div className="divide-y divide-slate-100">
                  {isLoading && latestTxns.length === 0 ? (
                    <div className="p-12 text-center text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Scanning Ledger...</div>
                  ) : latestTxns.length > 0 ? (
                    latestTxns.map((tx: any) => (
                    <div key={tx.hash} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">TX</div>
                          <div className="min-w-0">
                             <Link href={`/explorer/tx/${tx.hash}`} className="text-sm font-black text-blue-600 hover:underline block truncate w-32 md:w-48">{tx.hash}</Link>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">{Math.floor((Date.now() - tx.timestamp)/1000)}s ago</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-900 uppercase italic">{tx.value} AGRI</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">From: {tx.from.slice(0, 8)}...</p>
                       </div>
                    </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                       <Activity size={24} className="text-slate-200 mx-auto mb-2" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Recent Activity</p>
                    </div>
                  )}
               </div>
            </div>

         </div>
      </main>

      <Footer />
    </div>
  );
}
