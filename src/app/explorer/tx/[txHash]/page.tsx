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

        setTx(txData);
        setReceipt(receiptData);
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
        <p className="text-blue-400 font-mono animate-pulse">ĐANG TRUY XUẤT DỮ LIỆU CHUỖI...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 uppercase tracking-widest font-bold">
          <Link href="/explorer" className="hover:text-blue-400 transition-colors">Explorer</Link>
          <ChevronRight size={14} />
          <span className="text-slate-300 text-xs truncate">Transaction Details</span>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Oops!</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Link href="/explorer" className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl transition-all">Quay lại Explorer</Link>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Summary Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-white">Transaction Details</h1>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${receipt?.status === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {receipt?.status === 1 ? 'Success' : 'Failed'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-sm break-all">
                  {txHash}
                  <button onClick={() => copyToClipboard(txHash)} className="hover:text-blue-400 transition-colors">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-center min-w-[120px]">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Block Height</p>
                  <p className="text-xl font-black text-white">#{tx?.blockNumber}</p>
                </div>
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <ArrowRight size={12} className="rotate-180 text-blue-400" /> From (Sender)
                      </label>
                      <Link href={`/explorer/address/${tx?.from}`} className="block text-blue-400 font-mono hover:underline truncate">
                        {tx?.from}
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        To (Receiver) <ArrowRight size={12} className="text-emerald-400" />
                      </label>
                      <Link href={`/explorer/address/${tx?.to}`} className="block text-emerald-400 font-mono hover:underline truncate">
                        {tx?.to || "Contract Creation"}
                      </Link>
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full"></div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Value</label>
                      <p className="text-lg font-black text-white flex items-center gap-1">
                        {ethers.formatEther(tx?.value || 0)} <span className="text-[10px] text-slate-400">AGRI</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gas Price</label>
                      <p className="font-mono text-sm">{ethers.formatUnits(tx?.gasPrice || 0, 'gwei')} <span className="text-[10px] text-slate-500 uppercase">Gwei</span></p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Nonce</label>
                      <p className="font-mono text-sm">{tx?.nonce}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Confirmations</label>
                      <p className="text-emerald-400 font-black">{receipt?.confirmations || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Input Data Section */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Database size={14} /> Input Data (Raw Hex)
                  </h3>
                  <div className="bg-black/50 p-6 rounded-2xl border border-white/5 font-mono text-[11px] text-slate-400 break-all leading-relaxed max-h-[200px] overflow-y-auto">
                    {tx?.data || "0x"}
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-white/10 p-8 rounded-[2rem] space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" /> Node Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Network ID</span>
                      <span className="font-mono font-bold text-white">31337</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Gas Limit</span>
                      <span className="font-mono">{tx?.gasLimit.toString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Gas Used</span>
                      <span className="font-mono">{receipt?.gasUsed.toString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Cumulative Gas</span>
                      <span className="font-mono">{receipt?.cumulativeGasUsed.toString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center space-y-4">
                  <p className="text-xs text-slate-500">Đây là dữ liệu thời gian thực được trích xuất trực tiếp từ node fwd LIFEchain.</p>
                  <button className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl text-xs font-bold transition-all border border-white/5">
                    View Logs
                  </button>
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
