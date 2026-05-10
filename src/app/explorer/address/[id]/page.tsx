'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Copy, ChevronDown, CheckCircle2, Info, FileText, ArrowRight, Globe
} from 'lucide-react';
import Link from 'next/link';
import { ethers } from 'ethers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AddressPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const addressId = unwrappedParams.id;
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'transactions' | 'internal' | 'tokens' | 'analytics'>('transactions');
  
  const [nativeBalance, setNativeBalance] = useState<string>("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [isContract, setIsContract] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!addressId) return;
      
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
        // Fetch blockchain data and entity metadata in parallel
        const [nBal, tBal, code, entityRes] = await Promise.all([
          provider.getBalance(addressId).catch(() => BigInt(0)),
          (async () => {
             const TOKEN_ADDRESS = "0xbE85Cf9DDB93d9ea677e95599779B400437899E8"; 
             const erc20Abi = ["function balanceOf(address owner) view returns (uint256)"];
             const tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, provider);
             return await tokenContract.balanceOf(addressId).catch(() => BigInt(0));
          })(),
          provider.getCode(addressId).catch(() => '0x'),
          supabase.from('entities').select('*').eq('wallet_address', addressId).maybeSingle()
        ]);

        setNativeBalance(ethers.formatEther(nBal));
        setTokenBalance(ethers.formatEther(tBal));
        setIsContract(code !== '0x' && code !== '0x0' && code !== '0x ');

        const entityData = entityRes.data;
        
        // If we have an entity record, fetch their specific transaction history from the database
        if (entityData) {
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
              hash: tx.id.replace(/-/g, '').substring(0, 40),
              timestamp: new Date(tx.created_at).toLocaleString(),
              age: Math.floor((Date.now() - new Date(tx.created_at).getTime()) / 60000) + ' mins ago',
              from: tx.sender?.wallet_address || 'System',
              to: tx.receiver?.wallet_address || 'System',
              value: `${tx.amount}`,
              type: tx.type,
            }));
            setTransactions(formatted);
          }
        } else {
          // If no entity is found (e.g. Burn address or unknown wallet), we show an empty list or 
          // we could potentially query by address directly if the schema supported it.
          // For now, we clear any previous transactions.
          setTransactions([]);
        }
      } catch (err) {
        console.error("Error loading address data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addressId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTag = () => {
    const addr = addressId.toLowerCase();
    if (addr === '0x0000000000000000000000000000000000000000') return 'Null Address / Burn';
    if (addr === '0xbe85cf9ddb93d9ea677e95599779b400437899e8') return 'AGRI Token Contract';
    if (addr === '0x1c3132e1858e70f612d1b7147614d955f0be1071') return 'Mainnet Validator';
    return null;
  };

  const tag = getTag();

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Syncing Ledger Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      <Header />
      
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-slate-200 pb-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                 <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${addressId}`} alt="identicon" className="w-full h-full" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 {isContract ? 'Contract' : 'Address'} 
                 <span className="font-mono text-base break-all">{addressId}</span>
              </h1>
              <button onClick={handleCopy} className="text-slate-400 hover:text-slate-600 transition-colors">
                 {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
           </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Balance Overview */}
           <div className="bg-white rounded border border-slate-200 shadow-sm">
              <div className="p-4 border-b border-slate-200">
                 <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Overview</h2>
              </div>
              <div className="p-6 space-y-6 text-sm">
                 <div>
                    <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest mb-1 block">Native Balance</span>
                    <div className="flex items-center gap-2">
                       <span className="text-lg font-bold text-slate-900">{Number(nativeBalance).toLocaleString(undefined, {maximumFractionDigits: 6})} AGRI</span>
                    </div>
                 </div>
                 <div>
                    <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest mb-1 block">Ecosystem Value</span>
                    <span className="text-slate-700 font-medium italic">Unlisted (Price data pending)</span>
                 </div>
                 <div>
                    <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest mb-1 block">Token Holdings</span>
                    <div className="relative">
                       <button 
                         onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                         className="w-full max-w-sm flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors text-left"
                       >
                          <span className="truncate mr-2 font-medium">
                             {Number(tokenBalance) > 0 ? `${Number(tokenBalance).toLocaleString()} FWD` : 'No tokens found'}
                          </span>
                          <ChevronDown size={14} className="text-slate-500 shrink-0" />
                       </button>
                       {isTokenDropdownOpen && Number(tokenBalance) > 0 && (
                          <div className="absolute top-full left-0 w-full max-w-sm mt-1 bg-white border border-slate-200 rounded shadow-xl z-10 p-2">
                             <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                                <div>
                                   <p className="font-bold text-slate-800">fwd LIFE Token (FWD)</p>
                                   <p className="text-[10px] text-slate-500 uppercase font-black">{Number(tokenBalance).toLocaleString()} Units</p>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           {/* Identity & Metadata */}
           <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col">
              <div className="p-4 border-b border-slate-200">
                 <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">More Info</h2>
              </div>
              <div className="p-6 space-y-6 text-sm flex-grow">
                 <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">Public Tag:</span>
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase border border-blue-100">
                       {tag || 'Generic Account'}
                    </span>
                 </div>
                 <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">Account Type:</span>
                    <span className="text-slate-700 font-bold">{isContract ? 'Smart Contract' : 'Wallet (EOA)'}</span>
                 </div>
                 <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">Last Activity:</span>
                    <span className="text-slate-700">{transactions.length > 0 ? transactions[0].age : 'N/A'}</span>
                 </div>
              </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-sm">
                          <Globe size={12} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Multichain Portfolio</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 cursor-pointer hover:underline uppercase tracking-tighter">View Aggregate Data</span>
                 </div>
              </div>
           </div>

        </div>

        {/* Ledger Activity Tabs */}
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
           
           <div className="flex gap-8 border-b border-slate-200 px-6 bg-slate-50/50 overflow-x-auto scrollbar-hide">
              {['transactions', 'internal', 'tokens', 'analytics'].map((tab) => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab as any)}
                   className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative shrink-0 ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    {tab === 'tokens' ? 'Token Transfers' : tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
                 </button>
              ))}
           </div>

           <div className="p-4 border-b border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-widest px-6">
              <div className="flex items-center gap-2">
                 <FileText size={14} /> Showing {transactions.length} Verified Entries
              </div>
           </div>

           {activeTab === 'transactions' && (
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <tr>
                          <th className="px-6 py-4">Txn Hash</th>
                          <th className="px-6 py-4">Method</th>
                          <th className="px-6 py-4">Age</th>
                          <th className="px-6 py-4">From</th>
                          <th className="px-6 py-4"></th>
                          <th className="px-6 py-4">To</th>
                          <th className="px-6 py-4 text-right">Value</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {transactions.length === 0 ? (
                          <tr>
                             <td colSpan={7} className="px-6 py-20 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-40">
                                   <Database size={40} className="text-slate-300" />
                                   <p className="text-[10px] font-black uppercase tracking-widest">No ledger records found for this identity</p>
                                </div>
                             </td>
                          </tr>
                       ) : transactions.map((tx, i) => {
                          const isOut = tx.from.toLowerCase() === addressId.toLowerCase();
                          return (
                             <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                   <Link href={`/explorer/tx/${tx.hash}`} className="text-xs font-mono font-bold text-blue-600 hover:underline truncate block w-28">{tx.hash}</Link>
                                </td>
                                <td className="px-6 py-4">
                                   <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[9px] font-black uppercase tracking-tighter text-slate-500">
                                      {tx.type}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-[10px] text-slate-400 font-bold whitespace-nowrap uppercase">{tx.age}</td>
                                <td className="px-6 py-4">
                                   <Link href={`/explorer/address/${tx.from}`} className="text-[11px] font-mono font-bold text-blue-600 truncate block w-28 hover:underline">{tx.from}</Link>
                                </td>
                                <td className="px-2 py-4 text-center">
                                   <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${isOut ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                      {isOut ? 'OUT' : 'IN'}
                                   </span>
                                </td>
                                <td className="px-6 py-4">
                                   <Link href={`/explorer/address/${tx.to}`} className="text-[11px] font-mono font-bold text-blue-600 truncate block w-28 hover:underline">{tx.to}</Link>
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <span className="text-xs font-bold text-slate-900">{tx.value} AGRI</span>
                                </td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           )}
           {activeTab !== 'transactions' && (
              <div className="p-20 text-center">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No data available in this module</p>
              </div>
           )}
        </div>

      </main>
      <Footer />
    </div>
  );
}

function Database({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
      <path d="M3 12A9 3 0 0 0 21 12"></path>
    </svg>
  );
}
