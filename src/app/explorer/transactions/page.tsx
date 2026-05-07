'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/store/nosql-sim';
import { 
  Globe, Search, Activity, ArrowLeft, Clock, FileText, 
  ChevronRight, ShieldCheck, Filter, Download
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const t = await db.getCollection('latest_transactions');
      setTransactions(t);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-[#111b11] text-white border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl">AgriChain<span className="text-emerald-500 text-xs ml-1 uppercase tracking-widest">Explorer</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
             <Link href="/explorer" className="hover:text-white transition-colors">Home</Link>
             <Link href="/explorer/blocks" className="hover:text-white transition-colors">Blocks</Link>
             <Link href="/explorer/transactions" className="text-emerald-400">Transactions</Link>
             <Link href="/explorer/nodes" className="hover:text-white transition-colors">Nodes</Link>
             <Link href="/explorer/resources" className="hover:text-white transition-colors">Resources</Link>
          </div>
          <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="md:hidden p-2 text-slate-400 hover:text-white"
           >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
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
                 <Link href="/explorer/transactions" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5 text-emerald-400">Transactions</Link>
                 <Link href="/explorer/nodes" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Nodes</Link>
                 <Link href="/explorer/resources" onClick={() => setIsMobileMenuOpen(false)} className="py-3">Resources</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
           <div>
             <h1 className="text-2xl font-black tracking-tight mb-2">Transactions</h1>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-emerald-500" />
                Latest 500,000 Transactions found
             </p>
           </div>
           <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                 <Filter size={12} /> FILTER
              </button>
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                 <Download size={12} /> CSV EXPORT
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Txn Hash</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Block</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">From</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">To</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee</th>
                    </tr>
                 </thead>
                 <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group">
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                               <FileText size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                               <Link href={`/explorer/${tx.hash}`} className="text-xs font-mono font-bold text-blue-600 hover:underline">{tx.hash}</Link>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">19482412</span>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-xs text-slate-500 font-medium">{tx.timestamp}</span>
                         </td>
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                               <span className="text-xs font-mono font-bold text-blue-600 cursor-pointer hover:underline truncate max-w-[100px]">{tx.from}</span>
                            </div>
                         </td>
                         <td className="px-6 py-5 flex items-center gap-2">
                            <div className="p-1 bg-emerald-50 rounded text-emerald-500">
                               <ArrowLeft size={10} className="rotate-180" />
                            </div>
                            <span className="text-xs font-mono font-bold text-blue-600 cursor-pointer hover:underline truncate max-w-[100px]">{tx.to}</span>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-xs font-black text-slate-900">{tx.value}</span>
                         </td>
                         <td className="px-6 py-5">
                            <span className="text-[10px] font-mono text-slate-400">{tx.fee}</span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing 25 of 500,000 transactions</p>
              <div className="flex gap-2">
                 <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
                    <ChevronRight size={16} className="rotate-180" />
                 </button>
                 <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50">
                    <ChevronRight size={16} />
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
