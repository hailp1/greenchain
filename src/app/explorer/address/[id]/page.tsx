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
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
        try {
          const TOKEN_ADDRESS = "0xbE85Cf9DDB93d9ea677e95599779B400437899E8"; 
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
        } catch (e) {
          console.error("Error fetching balances:", e);
        }

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
            hash: tx.id.replace(/-/g, '').substring(0, 40), // Mock hash from UUID for display
            timestamp: new Date(tx.created_at).toLocaleString(),
            age: Math.floor((Date.now() - new Date(tx.created_at).getTime()) / 60000) + ' mins ago',
            from: tx.sender?.wallet_address || 'System',
            to: tx.receiver?.wallet_address || 'System',
            value: `${tx.amount}`,
            type: tx.type,
          }));
          setTransactions(formatted);
        }
      } catch (err) {
        console.error("Error:", err);
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
    if (addressId === '0x0000000000000000000000000000000000000000') return 'Null Address';
    if (addressId.toLowerCase() === '0xbe85cf9ddb93d9ea677e95599779b400437899e8') return 'AGRI Token Contract';
    if (addressId.toLowerCase() === '0x1c3132e1858e70f612d1b7147614d955f0be1071') return 'Mainnet Validator';
    return null;
  };

  const tag = getTag();

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      <Header />
      
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-slate-200 pb-4">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                 <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${addressId}`} alt="identicon" className="w-full h-full rounded-full" />
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
           
           {/* Overview Card */}
           <div className="bg-white rounded border border-slate-200 shadow-sm">
              <div className="p-4 border-b border-slate-200">
                 <h2 className="text-sm font-bold">Overview</h2>
              </div>
              <div className="p-4 space-y-4 text-sm">
                 <div>
                    <span className="text-slate-500 uppercase text-xs font-medium mb-1 block">AGRI BALANCE</span>
                    <div className="flex items-center gap-2">
                       <img src="/icons/eth.svg" className="w-4 h-4" alt="AGRI" onError={(e) => e.currentTarget.style.display = 'none'} />
                       <span className="font-medium">{Number(nativeBalance).toLocaleString(undefined, {maximumFractionDigits: 6})} AGRI</span>
                    </div>
                 </div>
                 <div>
                    <span className="text-slate-500 uppercase text-xs font-medium mb-1 block">AGRI VALUE</span>
                    <span className="text-slate-700">${(Number(nativeBalance) * 2326.88).toLocaleString(undefined, {maximumFractionDigits: 2})} <span className="text-slate-400">(@ $2,326.88/AGRI)</span></span>
                 </div>
                 <div>
                    <span className="text-slate-500 uppercase text-xs font-medium mb-1 block">TOKEN HOLDINGS</span>
                    <div className="relative">
                       <button 
                         onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                         className="w-full max-w-sm flex items-center justify-between p-2 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors text-left"
                       >
                          <span className="truncate mr-2">${(Number(tokenBalance) * 1.5).toLocaleString()} <span className="text-slate-500 text-xs ml-1">(&gt;1 Tokens)</span></span>
                          <ChevronDown size={14} className="text-slate-500 shrink-0" />
                       </button>
                       {isTokenDropdownOpen && (
                          <div className="absolute top-full left-0 w-full max-w-sm mt-1 bg-white border border-slate-200 rounded shadow-lg z-10 p-2">
                             <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded cursor-pointer">
                                <div>
                                   <p className="font-medium text-slate-800">fwd LIFE Token (FWD)</p>
                                   <p className="text-xs text-slate-500">{Number(tokenBalance).toLocaleString()} FWD</p>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           {/* More Info Card */}
           <div className="bg-white rounded border border-slate-200 shadow-sm flex flex-col">
              <div className="p-4 border-b border-slate-200">
                 <h2 className="text-sm font-bold">More Info</h2>
              </div>
              <div className="p-4 space-y-4 text-sm flex-grow">
                 {tag && (
                    <div className="flex gap-4">
                       <span className="text-slate-500 w-1/3">Name Tag:</span>
                       <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{tag}</span>
                    </div>
                 )}
                 {isContract && (
                    <div className="flex gap-4">
                       <span className="text-slate-500 w-1/3">Contract Creator:</span>
                       <span className="text-blue-600 truncate"><Link href="/explorer/address/0x000" className="hover:underline">0x000...000</Link></span>
                    </div>
                 )}
                 <div className="flex gap-4">
                    <span className="text-slate-500 w-1/3">Last Txn Sent:</span>
                    <span className="text-slate-700">{transactions.length > 0 ? transactions[0].age : 'N/A'}</span>
                 </div>
              </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                 <span className="text-slate-500 uppercase text-xs font-medium">MULTICHAIN INFO</span>
                 <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border border-blue-200">
                          <Globe size={12} />
                       </div>
                       <span className="font-medium">${(Number(nativeBalance) * 2326.88 + Number(tokenBalance) * 1.5).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                    </div>
                    <span className="text-xs text-blue-600 cursor-pointer">View Portfolio</span>
                 </div>
              </div>
           </div>

        </div>

        {/* Transaction Tabs */}
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
           
           <div className="flex gap-6 border-b border-slate-200 px-4 bg-slate-50/50 overflow-x-auto scrollbar-hide">
              {['transactions', 'internal', 'tokens', 'analytics'].map((tab) => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab as any)}
                   className={`py-3 px-2 text-sm font-medium capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                 >
                    {tab === 'tokens' ? 'Token Transfers (ERC-20)' : tab}
                 </button>
              ))}
           </div>

           <div className="p-4 border-b border-slate-200 flex justify-between items-center text-sm text-slate-600">
              <div className="flex items-center gap-2">
                 <FileText size={16} /> Latest 25 from a total of {transactions.length} transactions
              </div>
           </div>

           {activeTab === 'transactions' && (
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                       <tr>
                          <th className="px-4 py-3 font-medium">Transaction Hash</th>
                          <th className="px-4 py-3 font-medium">Method</th>
                          <th className="px-4 py-3 font-medium">Age</th>
                          <th className="px-4 py-3 font-medium">From</th>
                          <th className="px-4 py-3 font-medium"></th>
                          <th className="px-4 py-3 font-medium">To</th>
                          <th className="px-4 py-3 font-medium">Value</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {transactions.length === 0 ? (
                          <tr>
                             <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                There are no transactions for this address.
                             </td>
                          </tr>
                       ) : transactions.map((tx, i) => {
                          const isOut = tx.from.toLowerCase() === addressId.toLowerCase();
                          return (
                             <tr key={i} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3">
                                   <div className="flex items-center gap-2">
                                      <Info size={14} className="text-slate-300" />
                                      <Link href={`/explorer/tx/${tx.hash}`} className="text-blue-600 hover:text-blue-800 truncate block w-32 font-mono">{tx.hash}</Link>
                                   </div>
                                </td>
                                <td className="px-4 py-3">
                                   <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 capitalize">
                                      {tx.type.toLowerCase()}
                                   </span>
                                </td>
                                <td className="px-4 py-3 text-slate-500">{tx.age}</td>
                                <td className="px-4 py-3">
                                   {isOut ? (
                                      <span className="text-slate-600 truncate block w-32 font-mono">{tx.from}</span>
                                   ) : (
                                      <Link href={`/explorer/address/${tx.from}`} className="text-blue-600 hover:text-blue-800 truncate block w-32 font-mono">{tx.from}</Link>
                                   )}
                                </td>
                                <td className="px-2 py-3 text-center">
                                   <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isOut ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                      {isOut ? 'OUT' : 'IN'}
                                   </span>
                                </td>
                                <td className="px-4 py-3">
                                   {!isOut ? (
                                      <span className="text-slate-600 truncate block w-32 font-mono">{tx.to}</span>
                                   ) : (
                                      <Link href={`/explorer/address/${tx.to}`} className="text-blue-600 hover:text-blue-800 truncate block w-32 font-mono">{tx.to}</Link>
                                   )}
                                </td>
                                <td className="px-4 py-3 text-slate-700">{tx.value} AGRI</td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           )}
           {activeTab !== 'transactions' && (
              <div className="p-8 text-center text-slate-500">
                 No {activeTab} found.
              </div>
           )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
