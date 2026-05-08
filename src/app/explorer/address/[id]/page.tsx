'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Globe, Search, Wallet, ArrowLeft, Clock, FileText, 
  ChevronRight, ShieldCheck, Copy, Database, Activity,
  QrCode, PieChart, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddressPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const addressId = unwrappedParams.id;
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [entityStats, setEntityStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Entity data
        const { data: entityData } = await supabase
          .from('entities')
          .select('*')
          .eq('wallet_address', addressId)
          .single();
          
        if (entityData) {
          setEntityStats(entityData);
          
          // Fetch Transactions for this entity
          const { data: txData } = await supabase
            .from('token_transactions')
            .select(`
              *,
              sender:sender_id(wallet_address),
              receiver:receiver_id(wallet_address)
            `)
            .or(`sender_id.eq.${entityData.id},receiver_id.eq.${entityData.id}`)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (txData) {
            const formatted = txData.map(tx => ({
              hash: tx.id,
              timestamp: new Date(tx.created_at).toLocaleString(),
              from: tx.sender?.wallet_address || 'System',
              to: tx.receiver?.wallet_address || 'System',
              value: `${tx.amount} fwd`,
              type: tx.type
            }));
            setTransactions(formatted);
          }
        }
      } catch (err) {
        console.error("Error fetching address data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (addressId) fetchData();
  }, [addressId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      <header className="bg-[#111b11] text-white border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/explorer" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl">AgriChain<span className="text-emerald-500 text-xs ml-1 uppercase tracking-widest">Explorer</span></span>
          </Link>
          <div className="relative max-w-xs w-full hidden lg:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  const target = searchQuery.length > 50 ? `/explorer/${searchQuery}` : searchQuery.startsWith('0x') ? `/explorer/address/${searchQuery}` : `/explorer/blocks`;
                  window.location.href = target;
                }
              }}
               placeholder="Search by Txn Hash / Block / Address" 
               className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
             />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Address Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                 <Wallet size={28} />
              </div>
              <div>
                 <h1 className="text-xl md:text-2xl font-black tracking-tight mb-2 flex items-center gap-3">
                    Address <span className="text-slate-400 font-mono text-sm md:text-lg break-all">{addressId}</span>
                    <button onClick={handleCopy} className="p-1.5 hover:bg-white rounded-lg border border-slate-100 text-slate-400 transition-colors">
                       <Copy size={16} />
                    </button>
                 </h1>
                 <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">Regular Address</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-500 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-100">Verified Identity</span>
                 </div>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all">
                 <QrCode size={12} /> VIEW QR
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-900/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <PieChart size={80} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Total Balance</p>
               <h3 className="text-3xl font-black text-slate-900 mb-2">{entityStats ? Number(entityStats.fwd_balance || 0).toLocaleString() : '0'} fwd</h3>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Staked: {entityStats ? Number(entityStats.staked_balance || 0).toLocaleString() : '0'} fwd</p>
            </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-900/5 relative overflow-hidden group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Transactions</p>
              <div className="flex items-end gap-3 mb-2">
                 <h3 className="text-3xl font-black text-slate-900">142</h3>
                 <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mb-1">
                    <TrendingUp size={12} /> +12%
                 </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processed on Mainnet</p>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-900/5 relative overflow-hidden group bg-gradient-to-br from-slate-900 to-black text-white">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                 <ShieldCheck size={80} className="text-emerald-400" />
              </div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Account Security</p>
              <h3 className="text-2xl font-black mb-2">Multi-Sig Protected</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status: SECURE ✅</p>
           </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
           <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" /> Transaction History
              </h3>
              <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <button className="text-emerald-500">All</button>
                 <button className="hover:text-slate-600">In</button>
                 <button className="hover:text-slate-600">Out</button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Txn Hash</th>
                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Block</th>
                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Age</th>
                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">From/To</th>
                       <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                    </tr>
                 </thead>
                 <tbody>
                     {loading ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Scanning Ledger...
                          </td>
                        </tr>
                     ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            No transactions found
                          </td>
                        </tr>
                     ) : transactions.map((tx, i) => (
                       <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group">
                          <td className="px-8 py-6">
                             <span className="text-xs font-mono font-bold text-slate-600 truncate block max-w-[100px]" title={tx.hash}>{tx.hash.substring(0,8)}...</span>
                          </td>
                          <td className="px-8 py-6">
                             <span className="px-2 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500 border border-slate-200">{tx.type || 'Transfer'}</span>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">Confirmed</span>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{tx.timestamp}</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono font-bold text-slate-400 truncate max-w-[80px]" title={tx.from}>{tx.from === addressId ? 'SELF' : tx.from}</span>
                                <ChevronRight size={12} className="text-slate-300" />
                                <span className="text-[10px] font-mono font-bold text-blue-600 hover:underline truncate max-w-[80px]" title={tx.to}>{tx.to}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`text-xs font-black ${tx.from === addressId ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {tx.from === addressId ? '-' : '+'}{tx.value}
                             </span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
              </table>
           </div>
        </div>
      </main>

      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-bold z-[110] shadow-2xl"
          >
            Copied Address!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
