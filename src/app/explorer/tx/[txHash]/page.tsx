'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ethers } from 'ethers';
import { ArrowRight, CheckCircle2, Clock, Box, Database, ExternalLink, Copy, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TransactionDetail() {
  const params = useParams();
  const txHash = params.txHash as string;
  const [tx, setTx] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [block, setBlock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTxData = async () => {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
        const [txData, receiptData] = await Promise.all([
          provider.getTransaction(txHash),
          provider.getTransactionReceipt(txHash)
        ]);

        if (!txData) {
          setError("Giao dịch không tồn tại hoặc chưa được index.");
          return;
        }

        let blockData = null;
        if (txData.blockNumber != null) {
          blockData = await provider.getBlock(txData.blockNumber);
        }

        setTx(txData);
        setReceipt(receiptData);
        setBlock(blockData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Không thể kết nối tới node blockchain.");
      } finally {
        setLoading(false);
      }
    };

    if (txHash) fetchTxData();
  }, [txHash]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép!");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 font-mono animate-pulse uppercase tracking-[0.2em] text-xs">Synchronizing Ledger...</p>
      </div>
    </div>
  );

  // Helper functions for Etherscan-like display
    const calculateTxFee = () => {
    if (!tx || !receipt) return "0";
    const feeWei = BigInt(receipt.gasUsed) * BigInt(tx.gasPrice);
    return ethers.formatEther(feeWei);
  };

  const decodeInputData = (data: string) => {
    if (!data || data === '0x') return 'Transfer';
    if (data.startsWith('0x40c10f19')) return 'Mint Token';
    if (data.startsWith('0xa9059cbb')) return 'Transfer Token';
    if (data.startsWith('0x095ea7b3')) return 'Approve Spender';
    if (data.startsWith('0x368fac3d')) return 'Anchor Root';
    return 'Contract Call';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 font-sans">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-8 uppercase tracking-[0.2em] font-black">
          <Link href="/explorer" className="hover:text-blue-400 transition-colors">Explorer</Link>
          <ChevronRight size={12} className="text-slate-700" />
          <span className="text-slate-300">Transaction Details</span>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-12 rounded-[3rem] text-center backdrop-blur-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
               <Zap size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Transaction Not Found</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">{error}</p>
            <Link href="/explorer" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl font-bold transition-all border border-white/10">
               <ArrowRight size={16} className="rotate-180" /> Quay lại Explorer
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                      Transaction <span className="text-blue-500">Receipt</span>
                    </h1>
                    <div className="flex items-center gap-3 text-slate-500 font-mono text-xs md:text-sm break-all bg-white/5 p-2 rounded-lg border border-white/5 w-fit">
                      <span className="opacity-60">Hash:</span>
                      <span className="text-blue-400">{txHash}</span>
                      <button onClick={() => copyToClipboard(txHash)} className="hover:text-white transition-colors p-1">
                        <Copy size={14} />
                      </button>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 self-start md:self-center">
                    <div className={`px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl ${receipt?.status === 1 ? 'bg-emerald-500 text-natural-950 shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'}`}>
                      {receipt?.status === 1 ? <CheckCircle2 size={16} /> : <Zap size={16} />}
                      {receipt?.status === 1 ? 'Success' : 'Failed'}
                    </div>
                 </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Core Data */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                   <div className="p-8 md:p-10 space-y-10">
                      
                      {/* Addresses */}
                      <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
                         <div className="md:col-span-5 p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-colors group">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                               <ArrowRight size={12} className="rotate-180 text-blue-500" /> Sender (From)
                            </p>
                            <Link href={`/explorer/address/${tx?.from}`} className="block text-sm font-mono font-bold text-blue-400 hover:text-blue-300 break-all transition-colors">
                               {tx?.from}
                            </Link>
                         </div>
                         <div className="md:col-span-1 flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500">
                               <ChevronRight size={20} />
                            </div>
                         </div>
                         <div className="md:col-span-5 p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-emerald-500/30 transition-colors group">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                               Receiver (To) <ArrowRight size={12} className="text-emerald-500" />
                            </p>
                            <Link href={`/explorer/address/${tx?.to}`} className="block text-sm font-mono font-bold text-emerald-400 hover:text-emerald-300 break-all transition-colors">
                               {tx?.to || "Contract Creation"}
                            </Link>
                         </div>
                      </div>

                      {/* Main Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Value Transferred</p>
                            <div className="flex items-baseline gap-1">
                               <span className="text-2xl font-black text-white">{ethers.formatEther(tx?.value || 0)}</span>
                               <span className="text-[10px] font-black text-slate-500 uppercase">AGRI</span>
                            </div>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction Fee</p>
                            <p className="text-lg font-bold text-emerald-500">{calculateTxFee()} <span className="text-[10px] opacity-60">AGRI</span></p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gas Price</p>
                            <p className="text-lg font-bold text-blue-400">{ethers.formatUnits(tx?.gasPrice || 0, 'gwei')} <span className="text-[10px] opacity-60 uppercase">Gwei</span></p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nonce</p>
                            <p className="text-lg font-black text-white italic">#{tx?.nonce}</p>
                         </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                      {/* Decoded Action */}
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                               <Database size={16} />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Interaction Data (Decoded)</h3>
                         </div>
                         <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Transaction Method</span>
                               <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/30">
                                  {decodeInputData(tx?.data)}
                               </span>
                            </div>
                            <div className="font-mono text-[10px] text-slate-500 break-all leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 max-h-[120px] overflow-y-auto">
                               <span className="text-blue-900/50 mr-2">HEX:</span> {tx?.data || "0x"}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Right Column: Technical Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Block Info Card */}
                <div className="bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 backdrop-blur-xl">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-2xl shadow-black/50">
                         <Box size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Included In Block</p>
                         <p className="text-2xl font-black text-white italic">#{tx?.blockNumber}</p>
                      </div>
                   </div>

                   <div className="space-y-5">
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-500 font-bold uppercase tracking-widest">Confirmations</span>
                         <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg font-black">{block ? "Verified Stable" : "Confirming..."}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-500 font-bold uppercase tracking-widest">Gas Limit</span>
                         <span className="font-mono text-slate-300">{tx?.gasLimit.toString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-500 font-bold uppercase tracking-widest">Gas Used</span>
                         <span className="font-mono text-emerald-400">{receipt?.gasUsed.toString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-500 font-bold uppercase tracking-widest">Timestamp</span>
                         <span className="font-mono text-slate-300 text-[10px] flex items-center gap-1">
                            <Clock size={12} /> {block ? new Date(block.timestamp * 1000).toLocaleString() : '...'}
                         </span>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                         <Database size={14} /> Network: AgriChain Core v1
                      </div>
                   </div>
                </div>

                {/* Explorer Action Card */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center space-y-6">
                   <p className="text-xs text-slate-500 font-medium leading-relaxed italic px-4">
                      Đây là bằng chứng kỹ thuật số không thể thay đổi, được ghi lại trên sổ cái fwd LIFEchain PoA.
                   </p>
                   <div className="flex flex-col gap-3">
                      <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all">
                         View Raw JSON
                      </button>
                      <Link href="/explorer" className="w-full py-4 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20 transition-all flex items-center justify-center gap-2">
                         <ExternalLink size={14} /> Back to Dashboard
                      </Link>
                   </div>
                </div>

              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
