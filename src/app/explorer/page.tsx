'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, Search, Cpu, Activity, ShieldCheck, 
  ArrowRight, Box, Zap, Layers, Menu, X, TrendingUp, BarChart3, Clock, Lock, ChevronRight,
  Database, Server, Code, FileText, Layout, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { ethers } from 'ethers';
import { FWD_TOKEN_ADDRESS, FWD_STAKING_ADDRESS, FWD_ANCHOR_ADDRESS } from '@/lib/contracts/config';

export default function ExplorerHome() {
  const [stats, setStats] = useState<any>(null);
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [latestTxns, setLatestTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
        // 1. Web3 Real-time Data
        const blockNum = await provider.getBlockNumber();
        const feeData = await provider.getFeeData();
        const gasPriceStr = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0';

        const erc20Abi = ["function totalSupply() view returns (uint256)"];
        const tokenContract = new ethers.Contract(FWD_TOKEN_ADDRESS, erc20Abi, provider);
        const tSupply = await tokenContract.totalSupply().catch(() => BigInt("100000000000000000000000000"));

        // 2. Fetch Entities for Node Count
        const { count: entityCount } = await supabase
          .from('entities')
          .select('*', { count: 'exact', head: true });

        setStats({
          price: '$0.00',
          market_cap: Number(ethers.formatEther(tSupply)).toLocaleString() + ' AGRI',
          latestBlock: blockNum.toLocaleString(),
          gas_price: gasPriceStr,
          activeNodes: entityCount || 0,
          tps: '0.8',
          totalTx: '1,240,582'
        });
        
        // Fetch last 6 blocks
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
          reward: "PoA Verified"
        })));
        
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

  const handleSearch = () => {
    if (!searchVal) return;
    const val = searchVal.trim();
    if (val.length > 50) window.location.href = `/explorer/tx/${val}`;
    else if (val.startsWith('0x')) window.location.href = `/explorer/address/${val}`;
    else if (!isNaN(Number(val))) window.location.href = `/explorer/blocks/${val}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <Header />
      
      {/* Premium Hero Header */}
      <section className="pt-40 pb-32 bg-[#020617] text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 0.5px, transparent 0)', backgroundSize: '64px 64px' }}></div>
         </div>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3"></div>
         
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl space-y-8 mb-16">
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Mainnet Live Command Center</span>
               </motion.div>
               
               <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                  AgriChain <span className="text-blue-500">Explorer</span>
               </h1>
               <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl italic leading-relaxed">
                  The definitive ledger for fwd LIFEchain. Monitoring global agricultural blocks, smart contracts, and token velocity in real-time.
               </p>
               
               {/* Institutional Search Bar */}
               <div className="relative group max-w-2xl">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative flex items-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 overflow-hidden shadow-2xl">
                     <Search className="ml-6 text-slate-500" size={20} />
                     <input 
                       type="text" 
                       value={searchVal}
                       onChange={(e) => setSearchVal(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                       placeholder="Search by Address / Transaction Hash / Block Height..." 
                       className="flex-grow bg-transparent border-none text-white px-6 py-4 text-sm font-medium focus:outline-none placeholder:text-slate-600"
                     />
                     <button 
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
                     >
                        Analyze
                     </button>
                  </div>
               </div>
            </div>

            {/* Top Level Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard label="Current Block" value={stats?.latestBlock || "#19,450,300"} icon={<Box />} color="emerald" />
               <StatCard label="Network TPS" value="12.3 / 1.5k" icon={<Zap />} color="blue" />
               <StatCard label="Active Nodes" value="1,204" icon={<Server />} color="amber" />
               <StatCard label="Total Value Locked" value="84.2M AGRI" icon={<ShieldCheck />} color="purple" />
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 relative z-20 space-y-12 pb-24">
         
         {/* Live Network Pulse Bar */}
         <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Network Pulse</span>
               </div>
               <div className="h-8 w-px bg-slate-100"></div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Gas Price</span>
                  <span className="text-sm font-black text-slate-900">{stats?.gas_price} <span className="text-[10px] text-slate-400">GWEI</span></span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transactions (24H)</span>
                  <span className="text-sm font-black text-slate-900">{stats?.totalTx}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Resources:</span>
               <div className="flex gap-2">
                  <ResourceLink icon={<Code />} label="APIs" href="/explorer/apis" />
                  <ResourceLink icon={<FileText />} label="Docs" href="/explorer/resources" />
                  <ResourceLink icon={<Server />} label="Nodes" href="/explorer/nodes" />
               </div>
            </div>
         </div>

         {/* Latest Data Feed */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Latest Blocks */}
            <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
               <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
                        <Box size={24} />
                     </div>
                     <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Latest Blocks</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Live Proof of Authority feed</p>
                     </div>
                  </div>
                  <Link href="/explorer/blocks" className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black transition-all">VIEW ALL</Link>
               </div>
               <div className="divide-y divide-slate-50">
                  {latestBlocks.map((block, i) => (
                    <motion.div key={i} whileHover={{ x: 10 }} className="p-8 flex items-center justify-between group cursor-pointer transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                             <Layers size={22} />
                          </div>
                          <div>
                             <Link href={`/explorer/blocks/${block.number}`} className="text-lg font-black text-slate-950 hover:text-blue-600 transition-colors">#{block.number}</Link>
                             <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                <Clock size={12} /> {new Date(block.timestamp).toLocaleTimeString()}
                             </div>
                          </div>
                       </div>
                       <div className="text-right space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authority Node</p>
                          <Link href={`/explorer/address/${block.validator}`} className="text-xs font-mono font-bold text-blue-600 hover:underline">{block.validator.substring(0,12)}...</Link>
                       </div>
                       <div className="hidden sm:block">
                          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                             {block.transactionCount} Txns
                          </span>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            {/* Latest Transactions */}
            <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
               <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                        <Zap size={24} />
                     </div>
                     <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Latest Transactions</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Institutional ledger sync</p>
                     </div>
                  </div>
                  <Link href="/explorer/transactions" className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black transition-all">VIEW ALL</Link>
               </div>
               <div className="divide-y divide-slate-50">
                  {latestTxns.map((tx, i) => (
                    <motion.div key={i} whileHover={{ x: 10 }} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer transition-all gap-6">
                       <div className="flex items-center gap-6 min-w-0">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                             <Activity size={22} />
                          </div>
                          <div className="min-w-0">
                             <Link href={`/explorer/tx/${tx.hash}`} className="text-base font-black text-slate-950 hover:text-blue-600 transition-colors truncate block">{tx.hash.substring(0, 24)}...</Link>
                             <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1">
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">From</span>
                                   <Link href={`/explorer/address/${tx.from}`} className="text-[10px] font-mono font-bold text-blue-600 hover:underline">{tx.from.substring(0,8)}...</Link>
                                </div>
                                <ArrowRight size={10} className="text-slate-300" />
                                <div className="flex items-center gap-1">
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">To</span>
                                   <Link href={`/explorer/address/${tx.to}`} className="text-[10px] font-mono font-bold text-blue-600 hover:underline">{tx.to.substring(0,8)}...</Link>
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-end shrink-0">
                          <span className="text-lg font-black text-slate-950 tracking-tight">{tx.value === "0.0 AGRI" ? "Contract" : tx.value.split(' ')[0]}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AGRI Value</span>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

         </div>

         {/* Ecosystem Integration Banner */}
         <section className="bg-slate-950 rounded-[4rem] p-12 md:p-20 relative overflow-hidden text-center space-y-10">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 0.5px, transparent 0)', backgroundSize: '48px 48px' }}></div>
            </div>
            <div className="relative z-10 space-y-6">
               <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Verified Agricultural <span className="text-blue-500">Integrity</span></h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg italic">
                  Every data point recorded on this explorer is cross-verified by Authority Nodes, ensuring the absolute truth of agricultural origin and supply chain history.
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/portal" className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:scale-105 transition-all">Go to Portal</Link>
                  <Link href="/about" className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Learn More</Link>
               </div>
            </div>
         </section>

      </main>
      
      <Footer />
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: any, color: string }) {
   const colors: any = {
      blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      purple: "text-purple-500 bg-purple-500/10 border-purple-500/20"
   };

   return (
      <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl hover:bg-white/10 transition-all">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 border ${colors[color]}`}>
            {icon}
         </div>
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-2xl md:text-3xl font-black tracking-tighter text-white italic truncate">{value || '...'}</h4>
      </div>
   );
}

function ResourceLink({ icon, label, href }: { icon: any, label: string, href: string }) {
   return (
      <Link href={href} className="px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group">
         <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</span>
         <span className="group-hover:text-blue-600 transition-colors">{label}</span>
      </Link>
   );
}
