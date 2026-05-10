'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Copy, ChevronDown, CheckCircle2, Info, FileText, ArrowRight, Globe, Database
} from 'lucide-react';
import Link from 'next/link';
import { ethers } from 'ethers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useSWR from 'swr';

// Use a persistent provider to avoid re-initializing
const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn", undefined, { staticNetwork: true });

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
  const [txLoading, setTxLoading] = useState(true);
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);

  const fetcher = async () => {
    if (!addressId) return null;
    const addr = addressId.toLowerCase();
    
    // Step 1: Identity & Balance
    const identResults = await Promise.allSettled([
      provider.getBalance(addr).catch(() => BigInt(0)),
      (async () => {
         const TOKEN_ADDRESS = "0xbE85Cf9DDB93d9ea677e95599779B400437899E8"; 
         const erc20Abi = ["function balanceOf(address owner) view returns (uint256)"];
         const tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, provider);
         return await tokenContract.balanceOf(addr);
      })().catch(() => BigInt(0)),
      addr === '0x0000000000000000000000000000000000000000' ? Promise.resolve('0x') : provider.getCode(addr).catch(() => '0x'),
      supabase.from('entities').select('id, wallet_address').eq('wallet_address', addr).maybeSingle()
    ]);

    const nBal = identResults[0].status === 'fulfilled' ? identResults[0].value : BigInt(0);
    const tBal = identResults[1].status === 'fulfilled' ? identResults[1].value : BigInt(0);
    const code = identResults[2].status === 'fulfilled' ? (identResults[2].value as string) : '0x';
    const entityRes = identResults[3].status === 'fulfilled' ? identResults[3].value : null;

    // Step 2: Transactions (Trust the DB for speed)
    let txData: any[] = [];
    try {
      let txQuery = supabase
        .from('token_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40);
        
      if (entityRes?.data?.id) {
        txQuery = txQuery.or(`sender_id.eq.${entityRes.data.id},receiver_id.eq.${entityRes.data.id},sender_address.ilike.${addr},receiver_address.ilike.${addr}`);
      } else {
        txQuery = txQuery.or(`sender_address.ilike.${addr},receiver_address.ilike.${addr}`);
      }
      const { data } = await txQuery;
      txData = (data || []).map(tx => ({
        hash: tx.id.replace(/-/g, '').substring(0, 40),
        timestamp: new Date(tx.created_at).toLocaleString(),
        age: Math.floor((Date.now() - new Date(tx.created_at).getTime()) / 60000) + 'm ago',
        from: tx.sender_address || 'System',
        to: tx.receiver_address || 'System',
        value: `${tx.amount}`,
        type: tx.type,
        rawTimestamp: new Date(tx.created_at).getTime()
      }));
    } catch (e) {
      console.warn("[AddressPage] DB fetch error:", e);
    }

    return {
      nativeBalance: ethers.formatEther(nBal),
      tokenBalance: ethers.formatEther(tBal),
      isContract: code !== '0x' && code !== '0x0' && code !== '0x ',
      transactions: txData
    };
  };

  const { data: swrData, isLoading: swrLoading } = useSWR(`address_data_${addressId}`, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true
  });

  useEffect(() => {
    if (swrData) {
      setNativeBalance(swrData.nativeBalance);
      setTokenBalance(swrData.tokenBalance);
      setIsContract(swrData.isContract);
      setTransactions(swrData.transactions);
      setLoading(false);
      setTxLoading(false);
    }
  }, [swrData]);

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
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Blockchain Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-24">
      <Header />
      
      <main className="pt-24 max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Simple Identity Header */}
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-100 overflow-hidden shrink-0">
                 <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${addressId}`} alt="identicon" className="w-full h-full" />
              </div>
              <div className="min-w-0">
                 <h1 className="text-sm md:text-lg font-black text-slate-900 flex items-center gap-2">
                    {isContract ? 'Contract' : 'Address'}
                    <span className="font-mono text-slate-500 break-all select-all font-medium">{addressId}</span>
                    <button onClick={handleCopy} className="text-slate-300 hover:text-blue-600 transition-colors shrink-0">
                       {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                 </h1>
              </div>
           </div>
           
           <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                 {isContract ? 'Verified Code' : 'External Account'}
              </div>
              {tag && (
                 <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {tag}
                 </div>
              )}
           </div>
        </div>

        {/* Data Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Native Balance</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{Number(nativeBalance).toLocaleString(undefined, {maximumFractionDigits: 6})}</span>
                    <span className="text-sm font-black text-blue-600 uppercase italic">AGRI</span>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Token Holdings</p>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">
                       {Number(tokenBalance) > 0 ? `${Number(tokenBalance).toLocaleString()} AGRI Assets` : 'No assets found'}
                    </span>
                    {Number(tokenBalance) > 0 && (
                       <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                          <CheckCircle2 size={16} />
                       </div>
                    )}
                 </div>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Network Info</p>
              <div className="space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Market Value:</span>
                    <span className="font-bold text-slate-400 italic">Unlisted</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Last Txn:</span>
                    <span className="font-bold text-slate-900">{transactions.length > 0 ? transactions[0].age : 'N/A'}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="flex border-b border-slate-100 bg-slate-50/50">
              {['transactions', 'internal', 'tokens'].map((tab) => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab as any)}
                   className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
                 </button>
              ))}
           </div>

           {activeTab === 'transactions' && (
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 border-b border-slate-100">
                       <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">Txn Hash</th>
                          <th className="px-6 py-4">Method</th>
                          <th className="px-6 py-4">Age</th>
                          <th className="px-6 py-4">From</th>
                          <th className="px-6 py-4"></th>
                          <th className="px-6 py-4">To</th>
                          <th className="px-6 py-4 text-right">Value</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                        {txLoading ? (
                           <tr>
                              <td colSpan={7} className="px-6 py-20 text-center">
                                 <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Loading History...</p>
                              </td>
                           </tr>
                        ) : transactions.length === 0 ? (
                          <tr>
                             <td colSpan={7} className="px-6 py-20 text-center opacity-30">
                                <Database size={32} className="mx-auto mb-2" />
                                <p className="text-[9px] font-black uppercase tracking-widest">No ledger activity recorded on fwd LIFEchain</p>
                             </td>
                          </tr>
                       ) : transactions.map((tx, i) => {
                          const isOut = tx.from.toLowerCase() === addressId.toLowerCase();
                          return (
                             <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                   <Link href={`/explorer/tx/${tx.hash}`} className="font-mono font-bold text-blue-600 hover:underline truncate block w-24">{tx.hash}</Link>
                                </td>
                                <td className="px-6 py-4">
                                   <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[8px] font-black uppercase text-slate-500">
                                      {tx.type}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-bold uppercase">{tx.age}</td>
                                <td className="px-6 py-4">
                                   <Link href={`/explorer/address/${tx.from}`} className="font-mono font-bold text-blue-600 truncate block w-24 hover:underline">{tx.from}</Link>
                                </td>
                                <td className="px-2 py-4">
                                   <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${isOut ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                      {isOut ? 'OUT' : 'IN'}
                                   </span>
                                </td>
                                <td className="px-6 py-4">
                                   <Link href={`/explorer/address/${tx.to}`} className="font-mono font-bold text-blue-600 truncate block w-24 hover:underline">{tx.to}</Link>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">
                                   {tx.value} AGRI
                                </td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
