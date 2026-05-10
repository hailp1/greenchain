'use client';

import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';
import { 
  Activity, Clock, RefreshCw, Zap, Database, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RPC_URL = 'https://rpc.fwdlife.vn';
const rpcProvider = new ethers.JsonRpcProvider(RPC_URL, undefined, { staticNetwork: true });

function shortAddr(addr: string): string {
  if (!addr) return '—';
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function timeAgo(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 0) return 'just now';
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
  const [initialLoad, setInitialLoad] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [rpcOnline, setRpcOnline] = useState(false);
  const [supabaseOnline, setSupabaseOnline] = useState(false);
  const [blockHeight, setBlockHeight] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const isFetching = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      if (mounted) setSyncing(true);

      console.log("[TxPage] === Starting fetch cycle ===");
      let chainTxs: TxInfo[] = [];
      let platformTxs: TxInfo[] = [];

      // ── Step 1: Fetch Supabase FIRST (most reliable) ──
      try {
        console.log("[TxPage] Step 1: Querying Supabase...");
        
        const supabasePromise = supabase
          .from('token_transactions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(50);

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase timeout (25s)')), 25000)
        );

        const result = await Promise.race([supabasePromise, timeoutPromise]) as any;
        const { data: sbData, count, error: sbError } = result;

        if (sbError) {
          console.warn("[TxPage] Supabase error:", sbError.message);
        } else if (sbData && sbData.length > 0) {
          console.log("[TxPage] Supabase OK:", sbData.length, "rows, total:", count);
          if (mounted) {
            setSupabaseOnline(true);
            setTxCount(count || sbData.length);
          }
          platformTxs = sbData.map((tx: any) => {
            try {
              return {
                hash: (tx.id || '').toString().replace(/-/g, '').substring(0, 40),
                blockNumber: 0,
                timestamp: tx.created_at
                  ? Math.floor(new Date(tx.created_at).getTime() / 1000)
                  : Math.floor(Date.now() / 1000),
                from: tx.sender_address || '0x000...system',
                to: tx.receiver_address || '0x000...system',
                value: tx.amount?.toString() || '0',
                type: tx.type || 'Platform',
              };
            } catch {
              return null;
            }
          }).filter((tx: any): tx is TxInfo => tx !== null);
          console.log("[TxPage] Platform txs mapped:", platformTxs.length);
        } else {
          console.log("[TxPage] Supabase returned 0 rows");
        }
      } catch (e: any) {
        console.warn("[TxPage] Supabase failed:", e.message);
      }

      // ── Step 2: Fetch Blockchain ──
      try {
        console.log("[TxPage] Step 2: Querying RPC...");
        const blockNum = await rpcProvider.getBlockNumber();
        if (mounted) {
          setRpcOnline(true);
          setBlockHeight(blockNum);
        }
        console.log("[TxPage] RPC block:", blockNum);

        const blockPromises = [];
        for (let i = 0; i < 15; i++) {
          if (blockNum - i >= 0) {
            blockPromises.push(rpcProvider.getBlock(blockNum - i, true).catch(() => null));
          }
        }
        const blocks = await Promise.all(blockPromises);

        for (const b of blocks) {
          if (!b) continue;
          for (const tx of (b.transactions || [])) {
            const txObj = tx as any;
            chainTxs.push({
              hash: txObj.hash || txObj,
              blockNumber: b.number,
              timestamp: b.timestamp || Math.floor(Date.now() / 1000),
              from: txObj.from || '0x...',
              to: txObj.to || 'Contract',
              value: txObj.value ? ethers.formatEther(txObj.value) : '0',
              type: txObj.to ? 'Transfer' : 'Contract',
            });
            if (chainTxs.length >= 10) break;
          }
          if (chainTxs.length >= 10) break;
        }
        console.log("[TxPage] Chain txs found:", chainTxs.length);
      } catch (e: any) {
        console.warn("[TxPage] RPC failed:", e.message);
        if (mounted) setRpcOnline(false);
      }

      // ── Step 3: Merge, deduplicate, sort ──
      const allTxs = [...chainTxs, ...platformTxs];
      const seen = new Set<string>();
      const unique = allTxs.filter(tx => {
        if (!tx || !tx.hash) return false;
        if (seen.has(tx.hash)) return false;
        seen.add(tx.hash);
        return true;
      });
      const sorted = unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);

      console.log("[TxPage] Final result:", sorted.length, "unique transactions");

      if (mounted) {
        setTransactions(prev => sorted.length > 0 ? sorted : prev);
        setInitialLoad(false);
        setSyncing(false);
      }

      isFetching.current = false;

      // Schedule next poll with backoff
      if (mounted) {
        if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
          timerRef.current = setTimeout(fetchData, 20000);
        } else {
          timerRef.current = setTimeout(fetchData, 60000);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Header />
      
      <section className="pt-40 pb-20 bg-[#020617] text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 0.5px, transparent 0)', backgroundSize: '40px 40px' }}></div>
         </div>
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
               
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                     <div className={`w-2 h-2 rounded-full ${rpcOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></div>
                     <span className="text-sm font-black italic uppercase">{rpcOnline ? 'GETH POA LIVE' : 'CONNECTING...'}</span>
                  </div>
                  {blockHeight > 0 && (
                     <div className="hidden md:flex items-center gap-2 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Block</span>
                        <span className="text-sm font-mono font-black text-blue-400">#{blockHeight.toLocaleString()}</span>
                     </div>
                  )}
               </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Transactions</p>
                  <p className="text-lg font-black">{txCount > 0 ? txCount.toLocaleString() : '—'}</p>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Data Source</p>
                  <p className="text-lg font-black">{supabaseOnline ? 'Supabase Live' : rpcOnline ? 'RPC Only' : 'Connecting...'}</p>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Displayed</p>
                  <p className="text-lg font-black">{transactions.length} Txns</p>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Sync Status</p>
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full ${syncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                     <p className="text-lg font-black">{syncing ? 'Syncing' : 'Idle'}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20 space-y-12 pb-24">
         
         <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase italic">Recent <span className="text-blue-600">Transactions</span></h3>
                  {syncing && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>}
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden md:block">
                     {transactions.length > 0 ? `${transactions.length} records` : initialLoad ? 'Loading...' : 'No data'}
                  </span>
                  <button 
                     onClick={() => window.location.reload()} 
                     className="p-3 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                  >
                     <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
                  </button>
               </div>
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
                     {initialLoad && transactions.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-8 py-24 text-center">
                            <RefreshCw size={32} className="text-blue-500 animate-spin mx-auto mb-4" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Connecting to ledger...</span>
                            <span className="text-[10px] text-slate-300 font-bold mt-2 block">Fetching data from Supabase & Geth RPC</span>
                         </td>
                       </tr>
                     ) : transactions.length > 0 ? (
                        transactions.map((tx, idx) => (
                          <tr key={`${tx.hash}-${idx}`} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-8 py-6">
                                <Link href={`/explorer/tx/${tx.hash}`} className="text-xs font-mono font-bold text-blue-600 hover:underline flex items-center gap-1">
                                   {tx.hash.slice(0, 18)}...
                                   <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                             </td>
                             <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                   tx.type === 'Transfer' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                   tx.type === 'REWARD' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                   tx.type === 'STAKE' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                   tx.type === 'PAYMENT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                   'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
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
                                   <span className="text-sm font-black text-slate-900 italic">{Number(tx.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AGRI</span>
                                </div>
                             </td>
                          </tr>
                        ))
                     ) : (
                        <tr>
                          <td colSpan={5} className="px-8 py-24 text-center">
                             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <Activity size={24} className="text-slate-300" />
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">No recent transactions found on the ledger.</span>
                             <button 
                                onClick={() => window.location.reload()}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
                             >
                                Retry Connection
                             </button>
                          </td>
                        </tr>
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
