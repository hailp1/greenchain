'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';
import { FWD_TOKEN_ADDRESS, FWD_STAKING_ADDRESS, FWD_ANCHOR_ADDRESS } from '@/lib/contracts/config';
import { 
  Globe, Search, Activity, ArrowLeft, Clock, FileText, 
  ChevronRight, ShieldCheck, Filter, Download, RefreshCw, Zap, Layers
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      // Scan the latest 50 blocks for transactions
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

  // Auto-refresh every 6 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchOnChainTxs, 6000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchOnChainTxs]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-[#111b11] text-white border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl">AgriChain<span className="text-emerald-500 text-xs ml-1 uppercase tracking-widest">Explorer</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
             <Link href="/explorer" className="hover:text-white transition-colors">Home</Link>
             <Link href="/explorer/blocks" className="hover:text-white transition-colors">Blocks</Link>
             <Link href="/explorer/transactions" className="text-emerald-400">Transactions</Link>
             <Link href="/explorer/nodes" className="hover:text-white transition-colors">Nodes</Link>
             <Link href="/explorer/resources" className="hover:text-white transition-colors">Resources</Link>
          </div>
          <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="md:hidden p-2 text-slate-400 hover:text-white"
           >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#1a251a] border-b border-white/5 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                 <Link href="/explorer" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Home</Link>
                 <Link href="/explorer/blocks" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Blocks</Link>
                 <Link href="/explorer/transactions" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5 text-emerald-400">Transactions</Link>
                 <Link href="/explorer/nodes" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Nodes</Link>
                 <Link href="/explorer/resources" onClick={() => setIsMobileMenuOpen(false)} className="py-3">Resources</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${rpcOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-sm font-black">{rpcOnline ? 'Geth PoA Live' : 'Offline'}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Latest Block</p>
            <p className="text-sm font-black text-blue-600 flex items-center gap-1"><Layers size={14} /> #{latestBlock.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Txn Found</p>
            <p className="text-sm font-black">{totalTxCount}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chain ID</p>
            <p className="text-sm font-black text-emerald-600">300489</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
           <div>
             <h1 className="text-2xl font-black tracking-tight mb-2">Transactions</h1>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-emerald-500" />
                {rpcOnline ? 'Live from Geth PoA Network (Chain 300489)' : 'Fallback: Supabase Ledger'}
             </p>
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 border rounded-lg text-[11px] font-bold flex items-center gap-2 transition-all ${autoRefresh ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                 <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} /> {autoRefresh ? 'LIVE' : 'PAUSED'}
              </button>
              <button 
                onClick={() => { setLoading(true); fetchOnChainTxs(); }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
              >
                 <RefreshCw size={12} /> REFRESH
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Txn Hash</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Block</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">From</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">To</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Txn Fee</th>
                    </tr>
                 </thead>
                 <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <RefreshCw size={24} className="text-emerald-500 animate-spin" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying Geth RPC...</span>
                          </div>
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Zap size={24} className="text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No transactions yet — Use the Faucet to create one!</span>
                            <Link href="/test-faucet" className="text-xs font-bold text-emerald-600 hover:underline">Go to Faucet →</Link>
                          </div>
                        </td>
                      </tr>
                    ) : transactions.map((tx, i) => (
                      <motion.tr 
                        key={tx.hash} 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-colors group"
                      >
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                               <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${tx.isContractCreation ? 'bg-purple-50 text-purple-500' : tx.status === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                                 {tx.isContractCreation ? <FileText size={12} /> : <ShieldCheck size={12} />}
                               </div>
                               <Link href={`/explorer/${tx.hash}`} className="text-xs font-mono font-bold text-blue-600 hover:underline">{tx.hash.slice(0, 16)}...</Link>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">{tx.blockNumber}</span>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest flex items-center gap-1">
                              <Clock size={10} /> {timeAgo(tx.timestamp)}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">{shortAddr(tx.from)}</span>
                               {ADDRESS_LABELS[tx.from.toLowerCase()] && (
                                 <span className="text-[9px] text-slate-400 font-bold">{getLabel(tx.from)}</span>
                               )}
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            {tx.isContractCreation ? (
                              <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">CONTRACT CREATE</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-emerald-50 rounded text-emerald-500">
                                   <ArrowLeft size={10} className="rotate-180" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-mono font-bold text-blue-600 cursor-pointer hover:underline">{shortAddr(tx.to || '')}</span>
                                  {tx.to && ADDRESS_LABELS[tx.to.toLowerCase()] && (
                                    <span className="text-[9px] text-slate-400 font-bold">{getLabel(tx.to)}</span>
                                  )}
                                </div>
                              </div>
                            )}
                         </td>
                         <td className="px-6 py-5">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-md ${parseFloat(tx.value) > 0 ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-slate-500 bg-slate-100'}`}>
                              {parseFloat(tx.value) > 0 ? `${parseFloat(tx.value).toFixed(4)} AGRI` : 'DATA'}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-[10px] font-mono text-slate-400">{parseFloat(tx.fee).toFixed(8)}</span>
                         </td>
                      </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {rpcOnline ? `Live from Geth PoA • Block #${latestBlock.toLocaleString()} • ${totalTxCount} txn(s)` : 'Showing cached data'}
              </p>
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
