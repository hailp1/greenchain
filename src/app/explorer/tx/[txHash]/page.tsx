'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ethers } from 'ethers';
import { 
  ArrowRight, CheckCircle2, Clock, Box, Database, 
  ExternalLink, Copy, ChevronRight, Zap, ShieldCheck, 
  Cpu, Activity, Globe, Info, Terminal, Layout
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function TransactionDetail() {
  const params = useParams();
  const txHash = params.txHash as string;
  const [tx, setTx] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [block, setBlock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'state'>('overview');

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
          setError("Giao dịch không tồn tại hoặc chưa được index trên fwd LIFEchain.");
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
        setError("Không thể kết nối tới node blockchain AgriChain.");
      } finally {
        setLoading(false);
      }
    };

    if (txHash) fetchTxData();
  }, [txHash]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple toast could be added here
  };

  const calculateTxFee = () => {
    if (!tx || !receipt) return "0";
    const feeWei = BigInt(receipt.gasUsed) * BigInt(tx.gasPrice);
    return ethers.formatEther(feeWei);
  };

  const decodeInputData = (data: string) => {
    if (!data || data === '0x') return 'Simple Transfer';
    if (data.startsWith('0x40c10f19')) return 'Mint Asset (Admin)';
    if (data.startsWith('0xa9059cbb')) return 'ERC20 Transfer';
    if (data.startsWith('0x095ea7b3')) return 'Approve Allowance';
    if (data.startsWith('0x368fac3d')) return 'Blockchain Anchor (PoA)';
    return 'Smart Contract Call';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-blue-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Ledger</p>
          <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest">fwd LIFEchain Mainnet</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb & Network Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
            <Link href="/explorer" className="hover:text-blue-400 transition-colors">Explorer</Link>
            <ChevronRight size={12} className="text-slate-800" />
            <span className="text-slate-300">Transaction</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-400">
                <Globe size={12} /> AgriChain Core v1.0
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-400">
                <ShieldCheck size={12} /> PoA Consensus Verified
             </div>
          </div>
        </div>

        {error ? (
          <div className="bg-white/5 border border-white/10 p-20 rounded-[4rem] text-center backdrop-blur-xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 border border-red-500/20">
               <Zap size={40} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">Transaction Out of Sync</h2>
            <p className="text-slate-400 mb-10 max-w-md mx-auto text-sm font-medium">{error}</p>
            <Link href="/explorer" className="px-10 py-5 bg-white text-natural-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
               Back to Main Explorer
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Essential Summary Header */}
            <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Activity size={300} className="text-blue-500" />
               </div>
               
               <div className="relative z-10 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                             Transaction <span className="text-blue-500">Details</span>
                           </h1>
                           <div className={`mt-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl ${receipt?.status === 1 ? 'bg-emerald-500 text-natural-950 shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'}`}>
                              {receipt?.status === 1 ? <CheckCircle2 size={14} /> : <Zap size={14} />}
                              {receipt?.status === 1 ? 'Confirmed' : 'Failed'}
                           </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 font-mono text-xs md:text-sm break-all bg-black/40 p-3 rounded-2xl border border-white/5 w-fit">
                          <span className="text-blue-500/50 font-black">HASH</span>
                          <span className="text-blue-400 select-all">{txHash}</span>
                          <button onClick={() => copyToClipboard(txHash)} className="hover:text-white transition-colors p-1 bg-white/5 rounded-lg">
                            <Copy size={14} />
                          </button>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Value Transfer</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-5xl font-black text-white tracking-tighter">{ethers.formatEther(tx?.value || 0)}</span>
                           <span className="text-xl font-black text-blue-500 uppercase italic">AGRI</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Gas Fee: {calculateTxFee()} AGRI</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-8 border-b border-white/10 px-4">
               {['overview', 'logs', 'state'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                     {tab}
                     {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full" />}
                  </button>
               ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               <div className="lg:col-span-8 space-y-10">
                  {activeTab === 'overview' && (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                        {/* Core Ledger Data */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
                           <div className="p-8 md:p-12 space-y-12">
                              {/* Addresses Flow */}
                              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                                 <div className="md:col-span-5 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                          <ArrowRight size={12} className="rotate-180 text-blue-500" /> Originating Address
                                       </p>
                                       <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                          <Layout size={14} />
                                       </div>
                                    </div>
                                    <Link href={`/explorer/address/${tx?.from}`} className="block text-sm font-mono font-bold text-blue-400 hover:text-blue-300 break-all transition-colors leading-relaxed">
                                       {tx?.from}
                                    </Link>
                                 </div>
                                 <div className="md:col-span-1 flex justify-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 shadow-2xl">
                                       <ChevronRight size={24} className="text-blue-500/50" />
                                    </div>
                                 </div>
                                 <div className="md:col-span-5 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                          Recipient Address <ArrowRight size={12} text-emerald-500 />
                                       </p>
                                       <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                          <Database size={14} />
                                       </div>
                                    </div>
                                    <Link href={`/explorer/address/${tx?.to}`} className="block text-sm font-mono font-bold text-emerald-400 hover:text-emerald-300 break-all transition-colors leading-relaxed">
                                       {tx?.to || "0x0000000000000000000000000000000000000000 (Burn)"}
                                    </Link>
                                 </div>
                              </div>

                              {/* Technical Details List */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                 <DetailRow label="Transaction Type" value="Legacy (Type 0)" icon={<Terminal size={14} />} />
                                 <DetailRow label="Nonce" value={`#${tx?.nonce}`} icon={<Activity size={14} />} />
                                 <DetailRow label="Gas Price" value={`${ethers.formatUnits(tx?.gasPrice || 0, 'gwei')} Gwei`} icon={<Zap size={14} />} />
                                 <DetailRow label="Confirmations" value={block ? "Verified (PoA Stable)" : "Pending Finality"} status={block ? "success" : "warning"} icon={<ShieldCheck size={14} />} />
                              </div>

                              <div className="h-px bg-white/5"></div>

                              {/* Input Data / Action */}
                              <div className="space-y-6">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                          <Cpu size={16} />
                                       </div>
                                       <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Interaction Data</h3>
                                    </div>
                                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-500/20">
                                       {decodeInputData(tx?.data)}
                                    </span>
                                 </div>
                                 <div className="group relative">
                                    <div className="absolute inset-0 bg-blue-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative font-mono text-[11px] text-slate-500 break-all leading-loose bg-black/60 p-8 rounded-[2rem] border border-white/5 max-h-[250px] overflow-y-auto scrollbar-hide">
                                       <span className="text-blue-900/50 font-black mr-4 uppercase">HexPayload:</span> 
                                       {tx?.data || "0x"}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}

                  {activeTab === 'logs' && (
                     <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center space-y-6">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500 border border-blue-500/20">
                           <Terminal size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic">Event Logs</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto">This transaction generated {receipt?.logs?.length || 0} events on the fwd LIFEchain VM.</p>
                        <div className="space-y-4 text-left">
                           {receipt?.logs?.map((log: any, i: number) => (
                              <div key={i} className="p-6 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px]">
                                 <p className="text-blue-500 mb-2">#LOG_{i} - {log.address}</p>
                                 <div className="grid grid-cols-1 gap-1 opacity-60">
                                    {log.topics.map((t: string, ti: number) => (
                                       <p key={ti}><span className="text-slate-600">Topic[{ti}]:</span> {t}</p>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                  )}
               </div>

               {/* Technical Sidebar */}
               <div className="lg:col-span-4 space-y-10">
                  
                  {/* Block Metadata Card */}
                  <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-white/10 rounded-[3rem] p-10 space-y-8 backdrop-blur-3xl shadow-2xl">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-2xl shadow-black/50">
                           <Box size={28} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified In Block</p>
                           <p className="text-3xl font-black text-white italic tracking-tighter">#{tx?.blockNumber}</p>
                        </div>
                     </div>

                     <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Network Consensus</p>
                           <p className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                              <ShieldCheck size={14} /> PoA Finalized
                           </p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</p>
                           <p className="text-sm font-bold text-white flex items-center gap-2">
                              <Clock size={14} className="text-blue-500" /> {block ? new Date(block.timestamp * 1000).toLocaleString() : 'Processing...'}
                           </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Gas Used</p>
                              <p className="text-sm font-bold text-white">{receipt?.gasUsed.toString()}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Gas Limit</p>
                              <p className="text-sm font-bold text-white">{tx?.gasLimit.toString()}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Node & Network Status */}
                  <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Info size={14} className="text-blue-500" />
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Insight</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                           Giao dịch này đã được xác thực bởi tập hợp các Authority Nodes trên fwd LIFEchain, đảm bảo tính minh bạch và không thể thay đổi cho dữ liệu nông nghiệp.
                        </p>
                     </div>
                     <div className="flex flex-col gap-3">
                        <button className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                           Download JSON Receipt
                        </button>
                        <Link href="/explorer" className="w-full py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
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

function DetailRow({ label, value, icon, status }: { label: string, value: string, icon: any, status?: 'success' | 'warning' }) {
   return (
      <div className="flex justify-between items-center py-4 border-b border-white/5 group">
         <div className="flex items-center gap-3">
            <div className="text-slate-600 group-hover:text-blue-500 transition-colors">
               {icon}
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
         </div>
         <span className={`text-xs font-bold ${status === 'success' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-slate-200'}`}>
            {value}
         </span>
      </div>
   );
}
