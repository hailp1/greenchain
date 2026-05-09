'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, Search, Cpu, Activity, ShieldCheck, 
  ArrowRight, Box, Zap, Layers, Menu, X, TrendingUp, BarChart3, Clock, Lock, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { API_URL } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { ethers } from 'ethers';
import { FWD_TOKEN_ADDRESS, FWD_STAKING_ADDRESS, FWD_ANCHOR_ADDRESS } from '@/lib/contracts/config';

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

        // 3. Web3 Real-time Data
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        const blockNum = await provider.getBlockNumber();
        const feeData = await provider.getFeeData();
        const gasPriceStr = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0';

        setStats({
          price: '$0.00',
          price_change: 'Testnet Phase',
          market_cap: '100,000,000 FWD',
          latestBlock: blockNum.toLocaleString(),
          gas_price: gasPriceStr,
          activeNodes: entityCount || 0
        });
        
        // Fetch last 6 actual blockchain blocks with transactions
        const blockPromises = [];
        for (let i = 0; i < 6; i++) {
          if (blockNum - i >= 0) {
            blockPromises.push(provider.getBlock(blockNum - i, true));
          }
        }
        
        const fetchedBlocks = await Promise.all(blockPromises);
        const validBlocks = fetchedBlocks.filter(b => b !== null);

        setLatestBlocks(validBlocks.map((b: any) => ({
          number: b.number,
          timestamp: b.timestamp * 1000,
          validator: b.miner,
          transactionCount: b.prefetchedTransactions?.length || b.transactions?.length || 0,
          reward: "Consensus"
        })));
        
        // Extract latest transactions from these blocks
        let txns: any[] = [];
        for (const b of validBlocks) {
          const prefetchTxs = (b as any).prefetchedTransactions || [];
          for (const tx of prefetchTxs) {
            txns.push({
              hash: tx.hash,
              timestamp: b.timestamp * 1000,
              from: tx.from,
              to: tx.to || "Contract Creation",
              value: ethers.formatEther(tx.value || 0) + " AGRI"
            });
            if (txns.length >= 6) break;
          }
          if (txns.length >= 6) break;
        }
        setLatestTxns(txns);
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
                  <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Mainnet Live: 1,015 Nodes</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {[
                 { label: "AGRI Price", value: stats?.price, change: stats?.price_change, icon: TrendingUp, color: "text-emerald-500" },
                 { label: "Total Supply", value: stats?.market_cap, icon: Layers, color: "text-blue-500" },
                 { label: "Latest Block", value: stats?.latestBlock, unit: "", icon: Box, color: "text-amber-500" },
                 { label: "Avg. Gas Price", value: stats?.gas_price, unit: "Gwei", icon: Zap, color: "text-purple-500" }
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group"
                 >
                    <div className={`${stat.color} mb-6`}><stat.icon size={20} /></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <div className="flex items-end gap-2">
                       <span className="text-2xl md:text-3xl font-black tracking-tighter">{stat.value || '...'}</span>
                       {stat.unit && <span className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase">{stat.unit}</span>}
                       {stat.change && !stat.unit && <span className="text-[9px] font-bold text-emerald-400 mb-1.5">{stat.change}</span>}
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Investor Insights Section */}
      <section className="py-12 bg-white border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Token Deflation (Burned)</h4>
                  <div className="flex items-end gap-4">
                     <div className="flex-grow bg-slate-50 h-3 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-orange-500" />
                     </div>
                     <span className="text-sm font-black">65,420 fwd</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold mt-2">6.5% of total supply removed from circulation.</p>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Node Network Growth</h4>
                  <div className="flex items-end gap-1 h-12">
                     {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                        const v = Math.min(100, Math.max(20, 30 + (i * 10) + ((stats?.activeNodes || 0) % 20) - 10 + (i % 2 === 0 ? 5 : -5)));
                        return (
                           <motion.div 
                             key={i} 
                             initial={{ height: 0 }} 
                             animate={{ height: `${v}%` }} 
                             transition={{ delay: i * 0.1 }}
                             className="flex-grow bg-emerald-500/20 rounded-t-sm"
                           />
                        );
                     })}
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold mt-2">Organic node expansion: +24% MoM</p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                     <BarChart3 size={32} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Consensus Rate</p>
                     <p className="text-2xl font-black text-natural-950">99.98%</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Official Smart Contracts Section */}
      <section className="py-12 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-8">
               <div className="h-px bg-slate-200 flex-grow"></div>
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 whitespace-nowrap">Official Verified Contracts</h3>
               <div className="h-px bg-slate-200 flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { name: "FWD Token (AGRI)", address: FWD_TOKEN_ADDRESS, icon: Zap, color: "text-emerald-500", bg: "bg-emerald-50" },
                 { name: "Staking Pool", address: FWD_STAKING_ADDRESS, icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50" },
                 { name: "Data Anchor (Oracle)", address: FWD_ANCHOR_ADDRESS, icon: Lock, color: "text-purple-500", bg: "bg-purple-50" }
               ].map((contract, i) => (
                 <Link 
                   href={`/explorer/address/${contract.address}`} 
                   key={i}
                   className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
                 >
                    <div className={`w-12 h-12 rounded-2xl ${contract.bg} ${contract.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                       <contract.icon size={22} />
                    </div>
                    <div className="min-w-0">
                       <p className="text-sm font-black text-slate-900 mb-0.5">{contract.name}</p>
                       <p className="text-[10px] font-mono text-slate-400 truncate">{contract.address}</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-900 transition-colors" />
                 </Link>
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
                          <p className="text-[11px] font-bold text-slate-900">Miner <Link href={`/explorer/address/${block.validator}`} className="text-blue-600 hover:underline">{block.validator.substring(0,8)}...</Link></p>
                          <p className="text-[10px] font-mono text-slate-400">{block.transactionCount} txns</p>
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
                              <Link href={`/explorer/${tx.hash}`} className="text-sm font-black text-blue-600 hover:underline truncate block max-w-[120px]">{tx.hash.substring(0, 16)}...</Link>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                           </div>
                       </div>
                       <div className="flex-1 px-8 hidden md:block">
                          <div className="flex items-center gap-2 text-[11px] font-bold">
                             <span className="text-slate-400">From</span>
                             <Link href={`/explorer/address/${tx.from}`} className="text-blue-600 hover:underline truncate max-w-[80px]">{tx.from}</Link>
                             <span className="text-slate-400">To</span>
                             <Link href={`/explorer/address/${tx.to}`} className="text-blue-600 hover:underline truncate max-w-[80px]">{tx.to}</Link>
                          </div>
                       </div>
                       <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100 text-[10px] font-black text-emerald-600">
                          {tx.value === "0.0 AGRI" ? "Txn" : tx.value}
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
