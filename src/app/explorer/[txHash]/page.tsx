'use client';

import { useState, useEffect, use } from 'react';
import { db } from '@/lib/store/nosql-sim';
import { 
  ShieldCheck, Hash, Clock, Box, FileText, Zap, Activity, 
  Globe, ArrowLeft, Copy, ExternalLink, Search, Menu, X,
  ChevronDown, Cpu, Database, Fingerprint, Package
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExplorerPage({ params }: { params: Promise<{ txHash: string }> }) {
  const unwrappedParams = use(params);
  const txHash = unwrappedParams.txHash;
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txDetails, setTxDetails] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchTxData = async () => {
      // Find the transaction in our mock store
      const products = await db.getCollection('products');
      let foundNode = null;
      let foundProduct = null;

      for (const p of products) {
        const node = p.nodes.find((n: any) => n.txHash === txHash || n.hash === txHash);
        if (node) {
          foundNode = node;
          foundProduct = p;
          break;
        }
      }

      if (foundNode) {
        setTxDetails({
          hash: foundNode.txHash || foundNode.hash,
          status: "Success",
          block: foundNode.blockNumber || 19482041,
          timestamp: foundNode.timestamp,
          from: "0x7a2d4E813F0C5...f9e1",
          to: "0xAgriChain_V3_Main",
          gasLimit: "120,000",
          gasUsed: foundNode.gasUsed || "21,000",
          value: "0 ETH",
          fee: "0.00042 ETH",
          productName: foundProduct?.name,
          nodeType: foundNode.type,
          rawHash: foundNode.hash
        });
      } else {
        // Mock fallback if not found in specific product nodes
        setTxDetails({
          hash: txHash,
          status: "Success",
          block: 19482412,
          timestamp: new Date().toISOString(),
          from: "0x3d4e...e5f6",
          to: "0xAgriChain_V3_Main",
          gasLimit: "120,000",
          gasUsed: "42,109",
          value: "0 ETH",
          fee: "0.00084 ETH",
          productName: "Unknown Transaction",
          nodeType: "GENERAL",
          rawHash: txHash
        });
      }
      setLoading(false);
    };
    fetchTxData();
  }, [txHash]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
          ></motion.div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying AgriChain Ledger...</p>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      {/* Explorer Header */}
      <header className="bg-[#111b11] text-white border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl">AgriChain<span className="text-emerald-500 text-xs ml-1 uppercase tracking-widest">Explorer</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
             <Link href="/explorer" className="hover:text-emerald-400 transition-colors">Home</Link>
             <Link href="/explorer/blocks" className="hover:text-emerald-400 transition-colors">Blocks</Link>
             <Link href="/explorer/transactions" className="hover:text-emerald-400 transition-colors">Transactions</Link>
             <Link href="/explorer/nodes" className="hover:text-emerald-400 transition-colors">Nodes</Link>
             <Link href="/explorer/resources" className="hover:text-emerald-400 transition-colors">Resources</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="md:hidden p-2 text-slate-400 hover:text-white"
             >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
             <div className="relative max-w-xs w-full hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text" 
                  placeholder="Search hash..." 
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
             </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#1a251a] border-b border-white/5 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                 <Link href="/explorer" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Home</Link>
                 <Link href="/explorer/blocks" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Blocks</Link>
                 <Link href="/explorer/transactions" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Transactions</Link>
                 <Link href="/explorer/nodes" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Nodes</Link>
                 <Link href="/explorer/resources" onClick={() => setIsMobileMenuOpen(false)} className="py-3">Resources</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Breadcrumb & Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h1 className="text-xl md:text-2xl font-black tracking-tight mb-1">Transaction Details</h1>
             <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span>AgriChain Mainnet</span>
                <ChevronDown size={10} />
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>TxID: {txHash.substring(0, 16)}...</span>
             </div>
           </div>
           <div className="flex gap-2">
              <button onClick={() => handleCopy(txHash)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-2 hover:bg-slate-50 active:scale-95 transition-all">
                 <Copy size={12} /> COPY HASH
              </button>
              <Link href="/explorer" className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                 <Globe size={12} /> EXPLORER HOME
              </Link>
           </div>
        </div>

        {/* Transaction Card */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
           {/* Card Tabs */}
           <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button className="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-b-2 border-emerald-500 text-emerald-600 bg-white">Overview</button>
              <button className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Logs (12)</button>
              <button className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">State Change</button>
           </div>

           <div className="p-6 md:p-10 space-y-6 md:space-y-8">
              
              {/* Status Section */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-6 border-b border-slate-50">
                 <div className="w-full md:w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> Transaction Hash:
                 </div>
                 <div className="flex-grow flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-slate-900 break-all">{txDetails.hash}</span>
                    <button onClick={() => handleCopy(txDetails.hash)} className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400">
                      <Copy size={14} />
                    </button>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-6 border-b border-slate-50">
                 <div className="w-full md:w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> Status:
                 </div>
                 <div className="flex-grow">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-1.5">
                       <ShieldCheck size={12} /> Success
                    </span>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-6 border-b border-slate-50">
                 <div className="w-full md:w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Box size={14} /> Block:
                 </div>
                 <div className="flex-grow flex items-center gap-3">
                    <span className="text-sm font-bold text-blue-600 cursor-pointer hover:underline">{txDetails.block}</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase">Confirmed</span>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-6 border-b border-slate-50">
                 <div className="w-full md:w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} /> Transaction Action:
                 </div>
                 <div className="flex-grow flex items-center gap-2">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                       <Package size={16} className="text-emerald-500" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Verified {txDetails.nodeType} data for <span className="text-blue-600">{txDetails.productName}</span></span>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-6 border-b border-slate-50">
                 <div className="w-full md:w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Timestamp:
                 </div>
                 <div className="flex-grow text-sm font-bold text-slate-700">
                    {new Date(txDetails.timestamp).toLocaleString('vi-VN')}
                 </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-6 border-b border-slate-50">
                 <div className="w-full md:w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Fingerprint size={14} /> From:
                 </div>
                 <div className="flex-grow flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-blue-600 cursor-pointer hover:underline">{txDetails.from}</span>
                    <div className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded text-[9px] font-bold uppercase tracking-widest">AgriChain Node</div>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-6 border-b border-slate-50">
                 <div className="w-full md:w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Interacted With:
                 </div>
                 <div className="flex-grow flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-blue-600 cursor-pointer hover:underline">{txDetails.to}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100">Smart Contract</span>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-6">
                 <div className="w-full md:w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={14} /> Gas Limit & Usage:
                 </div>
                 <div className="flex-grow flex items-center gap-6">
                    <div>
                       <p className="text-[10px] text-slate-400 uppercase font-black">Limit</p>
                       <p className="text-sm font-bold">{txDetails.gasLimit}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-100"></div>
                    <div>
                       <p className="text-[10px] text-slate-400 uppercase font-black">Used by Txn</p>
                       <p className="text-sm font-bold text-emerald-600">{txDetails.gasUsed} ({((parseInt(txDetails.gasUsed.replace(/,/g,'')) / parseInt(txDetails.gasLimit.replace(/,/g,''))) * 100).toFixed(2)}%)</p>
                    </div>
                 </div>
              </div>

           </div>

           {/* Input Data Section */}
           <div className="bg-slate-900 p-8 md:p-12 text-white border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <Database size={20} className="text-emerald-400" />
                    <h3 className="text-lg font-bold">Input Data (Decoded)</h3>
                 </div>
                 <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">UTF-8 / Hex</span>
              </div>

              <div className="bg-black/40 rounded-2xl border border-white/10 p-6 md:p-10 font-mono text-xs md:text-sm space-y-6">
                 <div className="flex gap-4">
                    <span className="text-emerald-400 w-24 shrink-0">Function:</span>
                    <span className="text-blue-400 break-all">verifyProductNodeData(bytes32 productHash, uint256 timestamp, string location)</span>
                 </div>
                 <div className="h-[1px] bg-white/5"></div>
                 <div className="space-y-4">
                    <div className="flex gap-4">
                       <span className="text-slate-500 w-24 shrink-0">[0] hash:</span>
                       <span className="text-white break-all">{txDetails.rawHash}</span>
                    </div>
                    <div className="flex gap-4">
                       <span className="text-slate-500 w-24 shrink-0">[1] time:</span>
                       <span className="text-white">{new Date(txDetails.timestamp).getTime()} ({new Date(txDetails.timestamp).toLocaleDateString()})</span>
                    </div>
                    <div className="flex gap-4">
                       <span className="text-slate-500 w-24 shrink-0">[2] loc:</span>
                       <span className="text-white">Authenticated Origin</span>
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white mb-1">Authenticity Guaranteed</p>
                       <p className="text-[10px] text-slate-400">This transaction is verified by the AgriChain Distributed Ledger Protocol.</p>
                    </div>
                 </div>
                 <button className="w-full md:w-auto px-8 py-3 bg-white text-slate-900 rounded-xl text-xs font-black shadow-lg hover:-translate-y-1 transition-all active:scale-95">
                    DOWNLOAD RECEIPT
                 </button>
              </div>
           </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">AgriChain Protocol v3.0.1 - Decentralized Agricultural Transparency</p>
        </div>
      </main>

      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-bold z-[110] shadow-2xl"
          >
            Copied Transaction Hash!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
