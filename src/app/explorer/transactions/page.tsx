'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';
import { 
  Activity, Clock, RefreshCw, Zap, Database
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RPC_URL = 'https://rpc.fwdlife.vn';

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
  type: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TxInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [rpcOnline, setRpcOnline] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      console.log("[TxPage] Starting fetch...");
      setLoading(true);
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      
      // 1. Fetch from Blockchain
      let blockNum = 0;
      try {
        blockNum = await provider.getBlockNumber();
        console.log("[TxPage] Block height:", blockNum);
        setRpcOnline(true);
      } catch (e) {
        console.warn("[TxPage] RPC Height fetch failed");
        setRpcOnline(false);
      }

      let chainTxs: TxInfo[] = [];
      if (blockNum > 0) {
        const blockPromises = [];
        for (let i = 0; i < 5; i++) {
          if (blockNum - i >= 0) {
            blockPromises.push(provider.getBlock(blockNum - i, true).catch(() => null));
          }
        }
        const blocks = await Promise.all(blockPromises);
        console.log("[TxPage] Blocks fetched:", blocks.length);
        
        for (const b of blocks) {
          if (!b) continue;
          for (const tx of (b.transactions || [])) {
             const txObj = tx as any;
             chainTxs.push({
               hash: txObj.hash || txObj,
               blockNumber: b.number,
               timestamp: b.timestamp || Math.floor(Date.now()/1000),
               from: txObj.from || '0x...',
               to: txObj.to || "Contract",
               value: txObj.value ? ethers.formatEther(txObj.value) : '0',
               type: txObj.to ? 'Transfer' : 'Contract'
             });
             if (chainTxs.length >= 20) break;
          }
          if (chainTxs.length >= 20) break;
        }
      }

      // 2. Fetch from Supabase with Timeout
      console.log("[TxPage] Fetching Supabase ledger...");
      let platformTxs: TxInfo[] = [];
      try {
        const fetchWithTimeout = async () => {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Supabase Timeout")), 5000));
          const fetchPromise = supabase
            .from('token_transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(40);
          
          return await Promise.race([fetchPromise, timeoutPromise]) as any;
        };

        const { data: sbData, error: sbError } = await fetchWithTimeout();

        if (sbError) {
          console.error("[TxPage] Supabase error:", sbError);
        } else if (sbData) {
          console.log("[TxPage] Supabase raw data count:", sbData.length);
          platformTxs = sbData.map((tx: any) => {
            try {
              return {
                hash: (tx.id || '').toString().replace(/-/g, '').substring(0, 40),
                blockNumber: 0, 
                timestamp: tx.created_at ? Math.floor(new Date(tx.created_at).getTime() / 1000) : Math.floor(Date.now()/1000),
                from: tx.sender_address || '0x000...000',
                to: tx.receiver_address || '0x000...000',
                value: tx.amount?.toString() || '0',
                type: tx.type || 'Platform'
              };
            } catch (mapErr) {
               return null;
            }
          }).filter((tx: any): tx is TxInfo => tx !== null);
        }
      } catch (sbFatal) {
        console.warn("[TxPage] Supabase skipped (Timeout/Error):", sbFatal);
      }

      console.log("[TxPage] Merging:", chainTxs.length, "chain txs and", platformTxs.length, "platform txs");

      // Merge and sort safely
      const merged = [...chainTxs, ...platformTxs]
        .filter(tx => tx && tx.hash && tx.timestamp)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 50);
      
      console.log("[TxPage] Final merged count:", merged.length);
      setTransactions(merged);

    } catch (err: any) {
      console.error("[TxPage] Fatal Fetch Error:", err.message);
      setRpcOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 15000);
    return () => clearInterval(interval);
  }, [fetchTransactions]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Header />
      
      <section className="pt-40 pb-20 bg-[#020617] text-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                     <Activity size={12} className="text-blue-400" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Institutional Ledger</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">Global <span className="text-blue-500">Activity</span></h1>
                  <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl italic">
                     Monitoring agricultural value transfer and token velocity across fwd LIFEchain.
                  </p>
               </div>
               
               <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <div className={`w-2 h-2 rounded-full ${rpcOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-black italic uppercase">{rpcOnline ? 'GETH POA LIVE' : 'RPC OFFLINE'}</span>
               </div>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20 space-y-12 pb-24">
         
         <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-xl font-black text-slate-900 uppercase italic">Recent <span className="text-blue-600">Transactions</span></h3>
               <button onClick={fetchTransactions} className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
               </button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Txn Hash</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Method</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Age</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">From / To</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Value (AGRI)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading && transactions.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-8 py-24 text-center">
                            <RefreshCw size={32} className="text-blue-500 animate-spin mx-auto mb-4" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Scanning network ledger...</span>
                         </td>
                       </tr>
                     ) : (
                        transactions.map((tx) => (
                          <tr key={tx.hash} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-6">
                                <Link href={`/explorer/tx/${tx.hash}`} className="text-xs font-mono font-bold text-blue-600 hover:underline">{tx.hash.slice(0, 18)}...</Link>
                             </td>
                             <td className="px-8 py-6">
                                <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-600">
                                   {tx.type}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-slate-500 text-[10px] font-bold uppercase">
                                <div className="flex items-center gap-2">
                                   <Clock size={12} /> {timeAgo(tx.timestamp)}
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="space-y-1">
                                   <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-black text-slate-300 uppercase w-8">From</span>
                                      <Link href={`/explorer/address/${tx.from}`} className="text-xs font-mono font-bold text-blue-600 hover:underline">{shortAddr(tx.from)}</Link>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-black text-slate-300 uppercase w-8">To</span>
                                      <Link href={`/explorer/address/${tx.to || ''}`} className="text-xs font-mono font-bold text-blue-600 hover:underline">{tx.to ? shortAddr(tx.to) : 'Contract'}</Link>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <div className="flex flex-col">
                                   <span className="text-sm font-black text-slate-900 italic">{tx.value}</span>
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AGRI</span>
                                </div>
                             </td>
                          </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </main>
      
      <Footer />
    </div>
  );
}
