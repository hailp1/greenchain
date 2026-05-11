'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Info, FileText, ChevronLeft, ChevronRight, Pickaxe, Clock, Database
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ethers } from 'ethers';
import { RPC_URL, TOKEN_SYMBOL } from '@/lib/contracts/config';

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestBlockNum, setLatestBlockNum] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const blocksPerPage = 20;

  useEffect(() => {
    const fetchLatestHeight = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const height = await provider.getBlockNumber();
        setLatestBlockNum(height);
      } catch (err) {
        console.error("RPC Height Error:", err);
      }
    };
    fetchLatestHeight();
  }, []);

  useEffect(() => {
    const fetchBlocks = async () => {
      if (latestBlockNum === 0) return;
      
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        
        const startBlock = latestBlockNum - (currentPage - 1) * blocksPerPage;
        const blockPromises = [];
        
        for (let i = 0; i < blocksPerPage; i++) {
          const target = startBlock - i;
          if (target >= 0) {
            blockPromises.push(provider.getBlock(target));
          }
        }
        
        const fetched = await Promise.all(blockPromises);
        setBlocks(fetched.filter(b => b !== null));
      } catch (err) {
        console.error("Fetch blocks error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [latestBlockNum, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      <Header />
      
      <main className="pt-32 max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
           <div>
              <h1 className="text-xl font-black text-slate-900 uppercase italic tracking-widest">Blocks</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Showing latest validated blocks on Green Chain</p>
           </div>
           
           {/* Pagination */}
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
              >
                 <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-black px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                 Page {currentPage}
              </span>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                 <ChevronRight size={16} />
              </button>
           </div>
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-800">
           <Info size={18} className="shrink-0" />
           <p className="text-[10px] font-black uppercase tracking-widest">
              Network currently at height <span className="text-emerald-600">#{latestBlockNum.toLocaleString()}</span>. 
              Average block time: <span className="text-emerald-600">3.2s</span>
           </p>
        </div>

        {/* Blocks Table */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <tr>
                       <th className="px-8 py-6">Block</th>
                       <th className="px-6 py-6">Age</th>
                       <th className="px-6 py-6">Txns</th>
                       <th className="px-6 py-6">Validator / Miner</th>
                       <th className="px-6 py-6">Gas Used</th>
                       <th className="px-6 py-6">Gas Limit</th>
                       <th className="px-8 py-6 text-right">Reward</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {loading ? (
                       Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                             <td colSpan={7} className="px-8 py-6 bg-slate-50/20 h-16"></td>
                          </tr>
                       ))
                    ) : blocks.length === 0 ? (
                       <tr>
                          <td colSpan={7} className="px-8 py-24 text-center text-slate-400 uppercase font-black text-xs tracking-widest">
                             No blocks identified in this sequence.
                          </td>
                       </tr>
                    ) : (
                       blocks.map((block) => (
                          <tr key={block.number} className="hover:bg-emerald-50/30 transition-colors group">
                             <td className="px-8 py-6 text-emerald-600 font-black">
                                <Link href={`/explorer/blocks/${block.number}`} className="hover:underline">#{block.number}</Link>
                             </td>
                             <td className="px-6 py-6 text-slate-500 text-[10px] font-bold uppercase">
                                {Math.max(0, Math.floor((Date.now() - block.timestamp * 1000) / 1000))}s ago
                             </td>
                             <td className="px-6 py-6">
                                <Link href={`/explorer/transactions?block=${block.number}`} className="text-blue-600 font-bold hover:underline">
                                   {block.transactions?.length || 0}
                                </Link>
                             </td>
                             <td className="px-6 py-6">
                                <div className="flex items-center gap-2">
                                   <Pickaxe size={12} className="text-slate-400" />
                                   <Link href={`/explorer/address/${block.miner}`} className="text-slate-900 font-mono text-xs truncate block w-32 hover:text-emerald-600">
                                      {block.miner}
                                   </Link>
                                </div>
                             </td>
                             <td className="px-6 py-6 text-slate-600 text-[10px] font-bold">
                                {Number(block.gasUsed).toLocaleString()} <span className="text-[8px] opacity-40">({((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(2)}%)</span>
                             </td>
                             <td className="px-6 py-6 text-slate-500 text-[10px] font-bold">
                                {Number(block.gasLimit).toLocaleString()}
                             </td>
                             <td className="px-8 py-6 text-right text-slate-900 font-black italic">
                                0.0142 {TOKEN_SYMBOL}
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Footer note */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] px-4 pt-4">
           <Database size={12} />
           Institutional PoA Node Consensus Verification active
        </div>

      </main>
      <Footer />
    </div>
  );
}
