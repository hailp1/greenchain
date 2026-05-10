'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Info, FileText, ChevronLeft, ChevronRight, Pickaxe, Clock, Database
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ethers } from 'ethers';

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestBlockNum, setLatestBlockNum] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const blocksPerPage = 20;

  useEffect(() => {
    const fetchLatestHeight = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
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
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
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
      
      <main className="pt-24 max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
           <div>
              <h1 className="text-xl font-bold text-slate-800">Blocks</h1>
              <p className="text-sm text-slate-500 mt-1">Showing latest validated blocks on fwd LIFEchain</p>
           </div>
           
           {/* Pagination */}
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                 <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded">
                 Page {currentPage}
              </span>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 border border-slate-200 rounded bg-white hover:bg-slate-50 transition-colors"
              >
                 <ChevronRight size={16} />
              </button>
           </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center gap-3 text-blue-700">
           <Info size={18} className="shrink-0" />
           <p className="text-xs font-medium">
              Network currently at height <span className="font-bold">#{latestBlockNum.toLocaleString()}</span>. 
              Average block time: <span className="font-bold">3.2s</span>
           </p>
        </div>

        {/* Blocks Table */}
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <tr>
                       <th className="px-6 py-4">Block</th>
                       <th className="px-6 py-4">Age</th>
                       <th className="px-6 py-4">Txns</th>
                       <th className="px-6 py-4">Validator / Miner</th>
                       <th className="px-6 py-4">Gas Used</th>
                       <th className="px-6 py-4">Gas Limit</th>
                       <th className="px-6 py-4 text-right">Reward</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 font-medium">
                    {loading ? (
                       Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                             <td colSpan={7} className="px-6 py-4 bg-slate-50/20 h-12"></td>
                          </tr>
                       ))
                    ) : blocks.length === 0 ? (
                       <tr>
                          <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                             No blocks found.
                          </td>
                       </tr>
                    ) : (
                       blocks.map((block) => (
                          <tr key={block.number} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-6 py-4 text-blue-600 font-bold">
                                <Link href={`/explorer/blocks/${block.number}`}>{block.number}</Link>
                             </td>
                             <td className="px-6 py-4 text-slate-500 text-xs">
                                {Math.floor((Date.now() - block.timestamp * 1000) / 1000)}s ago
                             </td>
                             <td className="px-6 py-4">
                                <Link href={`/explorer/transactions?block=${block.number}`} className="text-blue-600 hover:underline">
                                   {block.transactions?.length || 0}
                                </Link>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <Pickaxe size={12} className="text-slate-400" />
                                   <Link href={`/explorer/address/${block.miner}`} className="text-blue-600 truncate block w-32 font-mono">
                                      {block.miner}
                                   </Link>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-slate-600 text-xs">
                                {Number(block.gasUsed).toLocaleString()} <span className="text-[10px] opacity-50">({((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(2)}%)</span>
                             </td>
                             <td className="px-6 py-4 text-slate-500 text-xs">
                                {Number(block.gasLimit).toLocaleString()}
                             </td>
                             <td className="px-6 py-4 text-right text-slate-900 font-bold">
                                0.0142 AGRI
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Footer note */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
           <Database size={12} />
           Real-time PoA consensus verification from rpc.fwdlife.vn
        </div>

      </main>
      <Footer />
    </div>
  );
}
