'use client';

import { useState, useEffect, use } from 'react';
import { 
  ChevronLeft, ChevronRight, Info, Clock, Box, Pickaxe, Database, FileText
} from 'lucide-react';
import Link from 'next/link';
import { ethers } from 'ethers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlockDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const blockId = unwrappedParams.id;
  const [block, setBlock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
        // Try to fetch by number or hash
        let target: string | number = blockId;
        if (!isNaN(Number(blockId))) {
          target = Number(blockId);
        }

        const fetchedBlock = await provider.getBlock(target, true);
        if (!fetchedBlock) {
          setError("Block not found");
          return;
        }

        setBlock(fetchedBlock);
      } catch (err: any) {
        console.error("Block detail error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockDetails();
  }, [blockId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying Block Ledger...</p>
      </div>
    </div>
  );

  if (error || !block) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Block Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The block height or hash requested does not exist on fwd LIFEchain.</p>
        <Link href="/explorer" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase">Back to Home</Link>
      </div>
    </div>
  );

  const txs = block.prefetchedTransactions || block.transactions || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      <Header />
      
      <main className="pt-24 max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
           <Link href="/explorer/blocks" className="hover:text-blue-600 transition-colors">Blocks</Link>
           <ChevronRight size={12} />
           <span className="text-slate-600">Block #{block.number}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
           <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              Block <span className="text-slate-500">#{block.number}</span>
           </h1>
           <div className="flex items-center gap-2">
              <Link href={`/explorer/blocks/${block.number - 1}`} className="p-2 border border-slate-200 rounded bg-white hover:bg-slate-50">
                 <ChevronLeft size={16} />
              </Link>
              <Link href={`/explorer/blocks/${block.number + 1}`} className="p-2 border border-slate-200 rounded bg-white hover:bg-slate-50">
                 <ChevronRight size={16} />
              </Link>
           </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Block Overview</h2>
           </div>
           
           <div className="divide-y divide-slate-50">
              <DetailRow label="Block Height" value={block.number} />
              <DetailRow label="Timestamp" value={`${new Date(block.timestamp * 1000).toUTCString()} (${Math.floor((Date.now() - block.timestamp * 1000) / 1000)}s ago)`} />
              <DetailRow label="Transactions" value={`${txs.length} transactions in this block`} />
              <DetailRow label="Validator / Miner" value={
                 <Link href={`/explorer/address/${block.miner}`} className="text-blue-600 font-mono hover:underline">{block.miner}</Link>
              } />
              <DetailRow label="Block Hash" value={<span className="font-mono text-slate-500">{block.hash}</span>} />
              <DetailRow label="Parent Hash" value={
                 <Link href={`/explorer/blocks/${block.parentHash}`} className="text-blue-600 font-mono hover:underline">{block.parentHash}</Link>
              } />
              <DetailRow label="Gas Used" value={`${Number(block.gasUsed).toLocaleString()} (${((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(2)}%)`} />
              <DetailRow label="Gas Limit" value={Number(block.gasLimit).toLocaleString()} />
              <DetailRow label="Block Reward" value="0.0142 AGRI (PoA Consensus)" />
           </div>
        </div>

        {/* Transactions in Block */}
        {txs.length > 0 && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Transactions in Block</h2>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <tr>
                          <th className="px-6 py-4">Txn Hash</th>
                          <th className="px-6 py-4">From</th>
                          <th className="px-6 py-4">To</th>
                          <th className="px-6 py-4 text-right">Value</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {txs.map((tx: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                             <td className="px-6 py-4">
                                <Link href={`/explorer/tx/${tx.hash}`} className="text-blue-600 font-mono font-bold hover:underline truncate block w-40">{tx.hash}</Link>
                             </td>
                             <td className="px-6 py-4">
                                <Link href={`/explorer/address/${tx.from}`} className="text-blue-600 font-mono hover:underline truncate block w-40">{tx.from}</Link>
                             </td>
                             <td className="px-6 py-4">
                                <Link href={`/explorer/address/${tx.to}`} className="text-blue-600 font-mono hover:underline truncate block w-40">{tx.to || "Contract Creation"}</Link>
                             </td>
                             <td className="px-6 py-4 text-right font-bold">
                                {ethers.formatEther(tx.value || 0)} AGRI
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

      </main>
      <Footer />
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: any }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center py-5 px-6 gap-2 md:gap-12">
       <div className="w-48 shrink-0 flex items-center gap-2">
          <Info size={14} className="text-slate-300" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}:</span>
       </div>
       <div className="text-sm font-medium text-slate-800 break-all">
          {value}
       </div>
    </div>
  );
}
