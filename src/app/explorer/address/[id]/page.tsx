'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Globe, Search, Wallet, ArrowLeft, Clock, FileText, 
  ChevronRight, ShieldCheck, Copy, Database, Activity,
  QrCode, PieChart, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';

export default function AddressPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const addressId = unwrappedParams.id;
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [nativeBalance, setNativeBalance] = useState<string>("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch REAL Balances from Blockchain
        try {
          const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
          const TOKEN_ADDRESS = "0xbE85Cf9DDB93d9ea677e95599779B400437899E8"; // FWD Token
          const erc20Abi = ["function balanceOf(address owner) view returns (uint256)"];
          const tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, provider);

          const [nBal, tBal] = await Promise.all([
            provider.getBalance(addressId),
            tokenContract.balanceOf(addressId).catch(() => BigInt(0))
          ]);

          setNativeBalance(ethers.formatEther(nBal));
          setTokenBalance(ethers.formatEther(tBal));
        } catch (e) {
          console.error("Error fetching blockchain balances:", e);
        }

        // Fetch Entity data (Optional metadata)
        const { data: entityData } = await supabase
          .from('entities')
          .select('*')
          .eq('wallet_address', addressId)
          .maybeSingle();
          
        if (entityData) {
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
              value: `${tx.amount}`,
              type: tx.type
            }));
            setTransactions(formatted);
          }
        } else {
          setTransactions([]);
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

  const decodeMethod = (type: string) => {
    switch(type) {
        case 'PAYMENT': return 'Transfer';
        case 'REWARD': return 'Mint (Reward)';
        case 'STAKE': return 'Stake';
        default: return 'Contract Call';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      <header className="bg-[#0a0f0a] text-white border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/explorer" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl uppercase italic">AgriChain<span className="text-emerald-500 text-[10px] ml-1 uppercase tracking-widest not-italic">Core</span></span>
          </Link>
          <div className="relative max-w-xs w-full hidden lg:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  const target = searchQuery.length > 50 ? `/explorer/tx/${searchQuery}` : searchQuery.startsWith('0x') ? `/explorer/address/${searchQuery}` : `/explorer/blocks`;
                  window.location.href = target;
                }
              }}
               placeholder="Search by Txn Hash / Address" 
               className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
             />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        
        {/* Address Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-emerald-500 text-natural-950 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Verified Address
                 </div>
                 <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                    EVM Compatible
                 </div>
              </div>
              <div className="flex items-start gap-5">
                 <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 shadow-2xl flex items-center justify-center text-emerald-500 shrink-0">
                    <Wallet size={32} />
                 </div>
                 <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Blockchain Identifier</p>
                    <h1 className="text-xl md:text-3xl font-black tracking-tighter break-all flex items-center gap-3">
                       {addressId}
                       <button onClick={handleCopy} className="p-2 hover:bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-500 transition-all active:scale-90">
                          <Copy size={18} />
                       </button>
                    </h1>
                 </div>
              </div>
           </div>
           <div className="flex gap-3">
              <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                 <QrCode size={16} /> QR Code
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-900/5 relative overflow-hidden group">
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Total AGRI Balance</p>
                  <div className="space-y-1">
                     <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                        {Number(nativeBalance).toLocaleString(undefined, {maximumFractionDigits: 4})} 
                        <span className="text-sm text-slate-400 ml-2 uppercase">AGRI</span>
                     </h3>
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 w-fit px-2 py-0.5 rounded">
                        Staked/Token: {Number(tokenBalance).toLocaleString(undefined, {maximumFractionDigits: 2})} AGRI
                     </p>
                  </div>
               </div>
               <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                  <Database size={200} />
               </div>
            </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-900/5 relative overflow-hidden group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Activity Snapshot</p>
              <div className="flex items-end gap-3 mb-4">
                 <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{transactions.length > 0 ? transactions.length : '0'}</h3>
                 <span className="text-xs font-black text-emerald-500 flex items-center gap-1 mb-2 bg-emerald-50 px-2 py-1 rounded-lg">
                    <TrendingUp size={14} /> LIVE
                 </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Indexed Transactions</p>
           </div>

           <div className="bg-gradient-to-br from-slate-900 to-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck size={120} className="text-emerald-400" />
              </div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">Security Rating</p>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Tier-1 Secure</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg w-fit border border-white/10">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest">Protected by PoA</span>
              </div>
           </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-natural-900 text-white flex items-center justify-center">
                    <Activity size={20} />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-widest">Transaction History</h3>
              </div>
              <div className="hidden sm:flex gap-4 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                 <button className="px-6 py-2 bg-white text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">All</button>
                 <button className="px-6 py-2 text-slate-400 hover:text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest">In</button>
                 <button className="px-6 py-2 text-slate-400 hover:text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Out</button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Txn Hash</th>
                       <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                       <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                       <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                       <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Counterparty</th>
                       <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Value</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                     {loading ? (
                        <tr>
                          <td colSpan={6} className="px-10 py-20 text-center">
                             <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Blockchain...</p>
                             </div>
                          </td>
                        </tr>
                     ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-10 py-20 text-center">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No activity found for this address</p>
                          </td>
                        </tr>
                     ) : transactions.map((tx, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="px-10 py-6">
                              <Link href={`/explorer/tx/${tx.hash}`} className="text-xs font-mono font-bold text-blue-500 hover:underline">
                                 {tx.hash.substring(0,14)}...
                              </Link>
                           </td>
                           <td className="px-10 py-6">
                              <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">
                                 {decodeMethod(tx.type)}
                              </span>
                           </td>
                           <td className="px-10 py-6 text-center">
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-500 rounded-lg text-[9px] font-black border border-emerald-100 uppercase tracking-widest">Confirmed</span>
                           </td>
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                 <Clock size={12} className="text-slate-300" /> {tx.timestamp}
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-3">
                                 <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${tx.from === addressId ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                    {tx.from === addressId ? 'OUT' : 'IN'}
                                 </div>
                                 <Link 
                                    href={`/explorer/address/${tx.from === addressId ? tx.to : tx.from}`}
                                    className="text-[11px] font-mono font-bold text-slate-600 hover:text-blue-500 hover:underline break-all"
                                 >
                                    {tx.from === addressId ? (tx.to === 'System' ? 'Internal Contract' : tx.to) : (tx.from === 'System' ? 'Network Reward' : tx.from)}
                                 </Link>
                              </div>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <p className={`text-sm font-black ${tx.from === addressId ? 'text-rose-500' : 'text-emerald-500'}`}>
                                 {tx.from === addressId ? '-' : '+'}{Number(tx.value).toLocaleString()} <span className="text-[10px] opacity-60">AGRI</span>
                              </p>
                           </td>
                        </tr>
                     ))}
                  </tbody>
              </table>
           </div>
           <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End of results</p>
           </div>
        </div>
      </main>

      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-8 py-4 rounded-3xl text-xs font-black z-[110] shadow-2xl border border-white/10 uppercase tracking-widest"
          >
            Copied Address!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
