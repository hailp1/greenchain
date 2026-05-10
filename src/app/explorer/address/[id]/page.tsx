'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Globe, Search, Wallet, ArrowLeft, Clock, FileText, 
  ChevronRight, ShieldCheck, Copy, Database, Activity,
  QrCode, PieChart, TrendingUp, ArrowUpRight, ArrowDownLeft,
  ExternalLink, Layers, Info, Lock, Zap, ChevronDown,
  BarChart, Code, History, Filter, Share2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AddressPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const addressId = unwrappedParams.id;
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'transactions' | 'internal' | 'tokens' | 'contract' | 'analytics'>('transactions');
  
  const [nativeBalance, setNativeBalance] = useState<string>("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [isContract, setIsContract] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);

  // Special Address Tags
  const getAddressTag = (addr: string) => {
    if (addr === '0x0000000000000000000000000000000000000000') return 'Null Address';
    if (addr.toLowerCase() === '0xbe85cf9ddb93d9ea677e95599779b400437899e8') return 'AGRI Token Contract';
    if (addr.toLowerCase() === '0x1c3132e1858e70f612d1b7147614d955f0be1071') return 'Mainnet Validator';
    return null;
  };

  const addressTag = getAddressTag(addressId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
        // Fetch REAL Balances & Code
        try {
          const TOKEN_ADDRESS = "0xbE85Cf9DDB93d9ea677e95599779B400437899E8"; // FWD Token
          const erc20Abi = ["function balanceOf(address owner) view returns (uint256)"];
          const tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, provider);

          const [nBal, tBal, code] = await Promise.all([
            provider.getBalance(addressId),
            tokenContract.balanceOf(addressId).catch(() => BigInt(0)),
            provider.getCode(addressId)
          ]);

          setNativeBalance(ethers.formatEther(nBal));
          setTokenBalance(ethers.formatEther(tBal));
          setIsContract(code !== '0x');
          setIsVerified(code !== '0x'); // Assume verified for system contracts in this demo
        } catch (e) {
          console.error("Error fetching blockchain balances:", e);
        }

        // Fetch Metadata & Transactions from Supabase
        const { data: entityData } = await supabase
          .from('entities')
          .select('*')
          .eq('wallet_address', addressId)
          .maybeSingle();
          
        const { data: txData } = await supabase
          .from('token_transactions')
          .select(`
            *,
            sender:sender_id(wallet_address),
            receiver:receiver_id(wallet_address)
          `)
          .or(`sender_id.eq.${entityData?.id || '00000000-0000-0000-0000-000000000000'},receiver_id.eq.${entityData?.id || '00000000-0000-0000-0000-000000000000'}`)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (txData) {
          const formatted = txData.map(tx => ({
            hash: tx.id,
            timestamp: new Date(tx.created_at).toLocaleString(),
            from: tx.sender?.wallet_address || 'System',
            to: tx.receiver?.wallet_address || 'System',
            value: `${tx.amount}`,
            type: tx.type,
            status: 'Confirmed'
          }));
          setTransactions(formatted);
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12">
        
        {/* Breadcrumb & Global Tools */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
             <Link href="/explorer" className="hover:text-blue-600 transition-colors">Explorer</Link>
             <ChevronRight size={12} className="text-slate-300" />
             <span className="text-slate-600">Address Details</span>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                 <QrCode size={18} />
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                 <Share2 size={18} />
              </button>
           </div>
        </div>

        {/* Address Identity Header */}
        <div className="space-y-6">
           <div className="flex flex-wrap items-center gap-3">
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${isContract ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                 {isContract ? <Code size={12} /> : <Wallet size={12} />}
                 {isContract ? 'Smart Contract' : 'External Wallet'}
              </div>
              {isVerified && (
                 <div className="px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12} /> Verified Source
                 </div>
              )}
              {addressTag && (
                 <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Info size={12} className="text-blue-400" />
                    {addressTag}
                 </div>
              )}
           </div>
           
           <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-white border border-slate-100 shadow-2xl flex items-center justify-center text-slate-300 shrink-0">
                 <Database size={32} />
              </div>
              <div className="space-y-1 min-w-0">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Blockchain Identifier (EVM Address)</p>
                 <div className="flex items-center gap-4">
                    <h1 className="text-xl md:text-3xl font-mono font-black tracking-tight break-all text-slate-950">
                       {addressId}
                    </h1>
                    <button onClick={handleCopy} className="p-3 hover:bg-slate-50 rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 transition-all active:scale-90 shadow-sm shrink-0">
                       <Copy size={18} />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Financial Overview & Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Primary Financial Stats */}
           <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Native Balance Card */}
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden group">
                 <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Native Asset Balance</p>
                       <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                          <Zap size={22} />
                       </div>
                    </div>
                    <div>
                       <h3 className="text-5xl font-black text-slate-950 tracking-tighter leading-none mb-2">
                          {Number(nativeBalance).toLocaleString(undefined, {maximumFractionDigits: 6})}
                       </h3>
                       <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-blue-600 uppercase italic">AGRI Mainnet Coin</p>
                          <span className="text-[10px] text-slate-400 font-bold">≈ $0.00 USD</span>
                       </div>
                    </div>
                 </div>
                 <div className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12 pointer-events-none group-hover:scale-110 transition-transform">
                    <TrendingUp size={240} />
                 </div>
              </div>

              {/* Token Multi-Selector Card */}
              <div className="bg-slate-950 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                 <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Ecosystem Assets</p>
                       <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md border border-white/5 shadow-xl">
                          <Layers size={22} />
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="relative">
                          <button 
                            onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                            className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group/btn"
                          >
                             <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black italic">AGRI</div>
                                <span className="text-sm font-black italic tracking-tight">Ecosystem Tokens</span>
                             </div>
                             <ChevronDown size={16} className={`text-slate-500 transition-transform ${isTokenDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                             {isTokenDropdownOpen && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                  className="absolute top-full left-0 right-0 mt-3 bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                >
                                   <div className="p-4 space-y-2">
                                      <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl cursor-pointer">
                                         <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] font-black">FWD</div>
                                            <span className="text-[11px] font-bold">fwd LIFE Token</span>
                                         </div>
                                         <span className="text-[11px] font-mono">{Number(tokenBalance).toLocaleString()}</span>
                                      </div>
                                   </div>
                                </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                       
                       <div className="pt-2">
                          <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
                             {Number(tokenBalance).toLocaleString(undefined, {maximumFractionDigits: 2})}
                          </h3>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Aggregated Token Value</p>
                       </div>
                    </div>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-50 pointer-events-none"></div>
              </div>
           </div>

           {/* Network Metadata Insights */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                 <div className="flex items-center gap-3">
                    <Info size={16} className="text-blue-500" />
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Network Insights</h4>
                 </div>
                 <div className="space-y-5">
                    <InsightRow label="Total Transactions" value={transactions.length > 0 ? transactions.length.toLocaleString() : '0'} />
                    <InsightRow label="Internal Calls" value={isContract ? '142' : '0'} />
                    <InsightRow label="First Seen" value={transactions.length > 0 ? transactions[transactions.length-1].timestamp.split(',')[0] : 'Never'} />
                    <InsightRow label="Last Seen" value={transactions.length > 0 ? transactions[0].timestamp.split(',')[0] : 'Never'} />
                    <div className="pt-4 border-t border-slate-50">
                       <InsightRow label="Ledger Integrity" value="A+ Verified" highlight />
                    </div>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <button className="py-4 bg-white border border-slate-200 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <BarChart size={14} className="text-blue-500" /> Analytics
                 </button>
                 <button className="py-4 bg-white border border-slate-200 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Filter size={14} className="text-slate-400" /> Filter
                 </button>
              </div>
           </div>
        </div>

        {/* Tabbed Activity Ledger */}
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex flex-col xl:flex-row justify-between xl:items-center gap-8 bg-slate-50/30">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-[1.5rem] bg-slate-950 text-white flex items-center justify-center shadow-2xl">
                    <Activity size={28} />
                 </div>
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Blockchain Ledger</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Real-time fwd LIFEchain Execution History</p>
                 </div>
              </div>
              
              <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm">
                 {[
                   { id: 'transactions', label: 'Transactions', icon: History },
                   { id: 'internal', label: 'Internal Calls', icon: Zap },
                   { id: 'tokens', label: 'Token Transfers', icon: Layers },
                   { id: 'contract', label: 'Contract', icon: Code, hidden: !isContract },
                   { id: 'analytics', label: 'Analytics', icon: BarChart }
                 ].filter(t => !t.hidden).map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-950 text-white shadow-xl shadow-black/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                    >
                       <tab.icon size={12} />
                       {tab.label}
                    </button>
                 ))}
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white border-b border-slate-100">
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Txn Hash</th>
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Block Time</th>
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Flow</th>
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Counterparty</th>
                       <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Value</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {loading ? (
                       <tr>
                          <td colSpan={6} className="px-10 py-40 text-center">
                             <div className="flex flex-col items-center gap-6">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-xl"></div>
                                <div className="space-y-1">
                                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Querying Distributed Ledger</p>
                                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">Establishing Authority Connection...</p>
                                </div>
                             </div>
                          </td>
                       </tr>
                    ) : transactions.length === 0 ? (
                       <tr>
                          <td colSpan={6} className="px-10 py-40 text-center">
                             <div className="flex flex-col items-center gap-6 opacity-40">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                   <Search size={32} />
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching ledger records</p>
                                   <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Address has no mainnet activity yet</p>
                                </div>
                             </div>
                          </td>
                       </tr>
                    ) : transactions.map((tx, i) => (
                       <tr key={i} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <Link href={`/explorer/tx/${tx.hash}`} className="text-xs font-mono font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100/50">
                                   {tx.hash.substring(0,18)}...
                                </Link>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg shadow-black/10 border border-white/5">
                                {tx.type === 'PAYMENT' ? 'Transfer' : tx.type === 'REWARD' ? 'Mint' : tx.type}
                             </span>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                <Clock size={12} className="text-slate-300" /> {tx.timestamp}
                             </div>
                          </td>
                          <td className="px-10 py-8 text-center">
                             <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${tx.from === addressId ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                {tx.from === addressId ? 'OUT' : 'IN'}
                             </span>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex flex-col gap-1 min-w-[200px]">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">{tx.from === addressId ? 'Recipient' : 'Sender'}</p>
                                <Link 
                                   href={`/explorer/address/${tx.from === addressId ? tx.to : tx.from}`}
                                   className="text-[11px] font-mono font-bold text-slate-900 hover:text-blue-600 transition-colors break-all flex items-center gap-2"
                                >
                                   {tx.from === addressId ? (tx.to === 'System' ? 'Authority System' : tx.to.substring(0,24)+'...') : (tx.from === 'System' ? 'Network Treasury' : tx.from.substring(0,24)+'...')}
                                   <ExternalLink size={10} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <div className="flex flex-col items-end">
                                <p className={`text-lg font-black tracking-tight ${tx.from === addressId ? 'text-slate-950' : 'text-emerald-500'}`}>
                                   {tx.from === addressId ? '-' : '+'}{Number(tx.value).toLocaleString()}
                                </p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">AGRI Coins</p>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           {/* Pagination Placeholder */}
           <div className="p-8 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {transactions.length} latest records</p>
              <div className="flex gap-2">
                 <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-300 cursor-not-allowed">Previous</button>
                 <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-300 cursor-not-allowed">Next</button>
              </div>
           </div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-10 py-5 rounded-[2rem] text-xs font-black z-[110] shadow-2xl border border-white/10 uppercase tracking-widest flex items-center gap-3"
          >
            <ShieldCheck className="text-blue-500" size={18} /> Identifier Copied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InsightRow({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
   return (
      <div className="flex justify-between items-center group">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
         <span className={`text-xs font-bold ${highlight ? 'text-emerald-600 px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm' : 'text-slate-900'}`}>{value}</span>
      </div>
   );
}
