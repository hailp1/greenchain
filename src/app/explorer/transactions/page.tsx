'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';
import { FWD_TOKEN_ADDRESS, FWD_STAKING_ADDRESS, FWD_ANCHOR_ADDRESS } from '@/lib/contracts/config';
import { 
  Globe, Search, Activity, ArrowLeft, Clock, FileText, 
  ChevronRight, ShieldCheck, Filter, Download, RefreshCw, Zap, Layers,
  ArrowRight, Cpu, BarChart3, Lock, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RPC_URL = 'https://rpc.fwdlife.vn';

// Known address labels
const ADDRESS_LABELS: Record<string, string> = {
  [FWD_TOKEN_ADDRESS.toLowerCase()]: 'AGRI Token Contract',
  [FWD_STAKING_ADDRESS.toLowerCase()]: 'Staking Contract',
  [FWD_ANCHOR_ADDRESS.toLowerCase()]: 'Anchor Contract',
  '0x6e10c6c7647db4533e0960ac5e6f8acdf502685b': 'Node 1 (Farm)',
  '0x3c4662fa2e7c02bd386df6e418d1317110fc7358': 'Node 2 (Auditor)',
  '0xc0647cc5fef44d5696e559ae305a07b03710e060': 'Node 3 (Retail)',
};

function getLabel(addr: string): string {
  if (!addr) return '—';
  return ADDRESS_LABELS[addr.toLowerCase()] || addr;
}

function shortAddr(addr: string): string {
  if (!addr) return '—';
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function timeAgo(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface TxInfo {
  hash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string | null;
  value: string;
  gasUsed: string;
  gasPrice: string;
  fee: string;
  isContractCreation: boolean;
  status: 'success' | 'pending';
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TxInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestBlock, setLatestBlock] = useState(0);
  const [totalTxCount, setTotalTxCount] = useState(0);
  const [rpcOnline, setRpcOnline] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchOnChainTxs = useCallback(async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const currentBlock = await provider.getBlockNumber();
      setLatestBlock(currentBlock);
      setRpcOnline(true);

      const allTxs: TxInfo[] = [];
      const startBlock = Math.max(0, currentBlock - 50);

      for (let i = currentBlock; i >= startBlock && allTxs.length < 30; i--) {
        const block = await provider.getBlock(i, true);
        if (!block) continue;

        if (block.transactions && block.transactions.length > 0) {
          for (const txHash of block.transactions) {
            if (allTxs.length >= 30) break;
            
            const tx = await provider.getTransaction(txHash as string);
            if (!tx) continue;

            let receipt = null;
            try {
              receipt = await provider.getTransactionReceipt(txHash as string);
            } catch { /* ignore */ }

            const gasUsed = receipt ? receipt.gasUsed : tx.gasLimit;
            const fee = ethers.formatEther(gasUsed * tx.gasPrice);

            allTxs.push({
              hash: tx.hash,
              blockNumber: tx.blockNumber || i,
              timestamp: block.timestamp,
              from: tx.from,
              to: tx.to,
              value: ethers.formatEther(tx.value),
              gasUsed: gasUsed.toString(),
              gasPrice: ethers.formatUnits(tx.gasPrice, 'gwei'),
              fee: fee,
              isContractCreation: !tx.to,
              status: receipt ? (receipt.status === 1 ? 'success' : 'pending') : 'pending',
            });
          }
        }
      }

      setTotalTxCount(allTxs.length);
      setTransactions(allTxs);
    } catch (err) {
      console.error('RPC fetch error:', err);
      setRpcOnline(false);

      // Fallback to Supabase
      try {
        const { data } = await supabase
          .from('blockchain_ledger')
          .select('tx_hash, block_height, anchored_at, batches ( id, producer_id, entities ( name ) )')
          .order('anchored_at', { ascending: false })
          .limit(50);

        if (data) {
          const formatted: TxInfo[] = data.map((item: any) => ({
            hash: item.tx_hash || '0x...',
            blockNumber: item.block_height || 0,
            timestamp: Math.floor(new Date(item.anchored_at).getTime() / 1000),
            from: item.batches?.entities?.name || 'Unknown',
            to: FWD_ANCHOR_ADDRESS,
            value: '0',
            gasUsed: '0',
            gasPrice: '0',
            fee: '0',
            isContractCreation: false,
            status: 'success' as const,
          }));
          setTransactions(formatted);
          setTotalTxCount(formatted.length);
        }
      } catch (e) {
        console.error('Supabase fallback error:', e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOnChainTxs();
  }, [fetchOnChainTxs]);

  // Auto-refresh every 8 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchOnChainTxs, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchOnChainTxs]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Header />
      
      {/* Institutional Hero */}
      <section className="pt-40 pb-20 bg-[#020617] text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 0.5px, transparent 0)', backgroundSize: '48px 48px' }}></div>
         </div>
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                     <Activity size={12} className="text-blue-400" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Real-time Transaction Ledger</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">Global <span className="text-blue-500">Activity</span></h1>
                  <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl italic">
                     Monitoring agricultural value transfer, token velocity, and smart contract interactions across the fwd LIFEchain network.
                  </p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Status</p>
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${rpcOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-black italic">{rpcOnline ? 'GETH POA LIVE' : 'RPC OFFLINE'}</span>
                     </div>
                  </div>
                  <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Monitored</p>
                     <p className="text-xl font-black italic text-blue-400">{totalTxCount} <span className="text-[10px] text-slate-500">TXNS</span></p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20 space-y-12 pb-24">
         
         <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Recent <span className="text-blue-600">Transactions</span></h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional record of value and data transfers</p>
               </div>
               
               <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                     <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Search Txn Hash..." 
                       className="bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-full md:w-64"
                     />
                  </div>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${autoRefresh ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-400'}`}
                     >
                        <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} />
                        {autoRefresh ? 'LIVE SYNC' : 'PAUSED'}
                     </button>
                     <button 
                        onClick={() => { setLoading(true); fetchOnChainTxs(); }}
                        className="px-6 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-950/20"
                     >
                        Refresh
                     </button>
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction Hash</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Method</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Block</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Age</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">From / To</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Value (AGRI)</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Fee</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading ? (
                       <tr>
                         <td colSpan={7} className="px-8 py-24 text-center">
                            <div className="flex flex-col items-center gap-4">
                               <RefreshCw size={32} className="text-blue-500 animate-spin" />
                               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Scanning network ledger...</span>
                            </div>
                         </td>
                       </tr>
                     ) : transactions.length === 0 ? (
                       <tr>
                         <td colSpan={7} className="px-8 py-24 text-center text-xs font-black text-slate-400 uppercase tracking-widest">
                           No transactions found on-chain
                         </td>
                       </tr>
                     ) : transactions.map((tx, i) => (
                       <tr key={tx.hash} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.isContractCreation ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                   {tx.isContractCreation ? <FileText size={16} /> : <Zap size={16} />}
                                </div>
                                <Link href={`/explorer/tx/${tx.hash}`} className="text-xs font-mono font-bold text-blue-600 hover:underline">{tx.hash.slice(0, 18)}...</Link>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${tx.isContractCreation ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                {tx.isContractCreation ? 'Contract Creation' : 'Transfer'}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <Link href={`/explorer/blocks/${tx.blockNumber}`} className="text-xs font-black text-slate-900 hover:text-blue-600 transition-colors">#{tx.blockNumber}</Link>
                          </td>
                          <td className="px-8 py-6 text-slate-500">
                             <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                                <Clock size={12} /> {timeAgo(tx.timestamp)}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                   <span className="text-[9px] font-black text-slate-400 uppercase w-8">From</span>
                                   <Link href={`/explorer/address/${tx.from}`} className="text-xs font-mono font-bold text-blue-600 hover:underline">{shortAddr(tx.from)}</Link>
                                </div>
                                <div className="flex items-center gap-2">
                                   <span className="text-[9px] font-black text-slate-400 uppercase w-8">To</span>
                                   {tx.to ? (
                                      <Link href={`/explorer/address/${tx.to}`} className="text-xs font-mono font-bold text-blue-600 hover:underline">{shortAddr(tx.to)}</Link>
                                   ) : (
                                      <span className="text-xs font-black text-purple-600">New Contract</span>
                                   )}
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900 italic">{parseFloat(tx.value) > 0 ? parseFloat(tx.value).toFixed(4) : '0.00'}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AGRI</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right text-[10px] font-mono font-bold text-slate-400">
                             {parseFloat(tx.fee).toFixed(8)}
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {rpcOnline ? `Synced with Geth PoA • Chain ID 300489` : 'Cached Data Mode'}
               </p>
               <div className="flex gap-2">
                  <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all shadow-sm">Previous</button>
                  <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100 transition-all shadow-sm">Next Page</button>
               </div>
            </div>
         </div>
      </main>
      
      <Footer />
    </div>
  );
}
