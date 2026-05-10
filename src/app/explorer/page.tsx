'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Box, Zap, FileText, ArrowRight, Server, Globe, Database, Clock
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';

export default function ExplorerHome() {
  const [stats, setStats] = useState<any>(null);
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [latestTxns, setLatestTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
        // 1. Fetch Basic Network Stats
        const [blockNum, feeData, { count: supabaseTxCount }] = await Promise.all([
          provider.getBlockNumber(),
          provider.getFeeData(),
          supabase.from('token_transactions').select('*', { count: 'exact', head: true })
        ]);
        
        const gasPriceStr = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0.1';

        // 2. Scan blocks for real-time activity
        const SEARCH_RANGE = 40; 
        const blockPromises = [];
        for (let i = 0; i < SEARCH_RANGE; i++) {
          if (blockNum - i >= 0) {
            blockPromises.push(provider.getBlock(blockNum - i, true));
          }
        }
        
        const fetchedBlocks = await Promise.all(blockPromises);
        const validBlocks = fetchedBlocks.filter(b => b !== null);

        // 3. Calculate Real-time TPS
        let totalTxInScan = 0;
        validBlocks.forEach(b => {
           totalTxInScan += b.transactions?.length || 0;
        });
        const timeSpan = validBlocks.length > 1 ? (validBlocks[0].timestamp - validBlocks[validBlocks.length - 1].timestamp) : 1;
        const realTps = (totalTxInScan / Math.max(1, timeSpan)).toFixed(2);

        setStats({
          price: 'Pending',
          market_cap: 'N/A',
          latestBlock: blockNum,
          gas_price: gasPriceStr,
          tps: realTps,
          totalTx: (supabaseTxCount || 0).toLocaleString()
        });

        // 4. Format Latest Blocks
        setLatestBlocks(validBlocks.slice(0, 6).map((b: any) => ({
          number: b.number,
          timestamp: b.timestamp * 1000,
          validator: b.miner,
          transactionCount: b.transactions?.length || 0,
          reward: "0.01402 AGRI"
        })));
        
        // 5. Collect Latest Transactions from blocks
        let txns: any[] = [];
        for (const b of validBlocks) {
          const blockTxs = b.transactions || [];
          for (const tx of blockTxs) {
            // Handle both full transactions and hashes (casting for TS)
            const txObj = tx as any;
            txns.push({
              hash: txObj.hash || txObj,
              timestamp: b.timestamp * 1000,
              from: txObj.from || '0x...',
              to: txObj.to || "Contract / Mint",
              value: txObj.value ? ethers.formatEther(txObj.value) : '0'
            });
            if (txns.length >= 6) break;
          }
          if (txns.length >= 6) break;
        }
        setLatestTxns(txns);

      } catch (err: any) {
        console.error('Explorer fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!searchVal) return;
    const val = searchVal.trim();
    if (val.length > 50) window.location.href = `/explorer/tx/${val}`;
    else if (val.startsWith('0x')) window.location.href = `/explorer/address/${val}`;
    else if (!isNaN(Number(val))) window.location.href = `/explorer/blocks/${val}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Header />
      
      {/* Search & Hero Section (Standard Etherscan Style) */}
      <section className="pt-24 pb-12 bg-[#111827] text-white">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col gap-6">
               <h1 className="text-xl font-bold">The fwd LIFEchain Explorer</h1>
               <div className="flex w-full max-w-2xl bg-white rounded-lg overflow-hidden border border-slate-700 shadow-xl">
                  <input 
                    type="text" 
                    placeholder="Search by Address / Txn Hash / Block / Token..." 
                    className="flex-grow px-4 py-3 text-slate-900 text-sm focus:outline-none"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button onClick={handleSearch} className="bg-blue-600 px-6 flex items-center justify-center hover:bg-blue-700 transition-colors">
                     <Search size={18} />
                  </button>
               </div>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-6 space-y-6 pb-24">
         
         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center gap-3 mb-3">
                  <Globe size={16} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AGRI Price</span>
               </div>
               <p className="text-lg font-bold">{stats?.price || '...'}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center gap-3 mb-3">
                  <Zap size={16} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Transactions</span>
               </div>
               <p className="text-lg font-bold">{stats?.totalTx || '0'} <span className="text-xs text-slate-400 font-medium">({stats?.tps || '0.00'} TPS)</span></p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center gap-3 mb-3">
                  <Box size={16} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Latest Block</span>
               </div>
               <p className="text-lg font-bold">#{stats?.latestBlock?.toLocaleString() || '...'}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center gap-3 mb-3">
                  <Server size={16} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gas Price</span>
               </div>
               <p className="text-lg font-bold">{stats?.gas_price || '0'} Gwei</p>
            </div>
         </div>

         {/* Tables Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Latest Blocks */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-sm font-bold">Latest Blocks</h2>
                  <Link href="/explorer/blocks" className="text-[10px] font-black text-blue-600 uppercase hover:underline">View all</Link>
               </div>
               <div className="divide-y divide-slate-100">
                  {loading ? (
                     <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Syncing Ledger...</div>
                  ) : latestBlocks.map((b, i) => (
                     <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                              <Box size={18} />
                           </div>
                           <div>
                              <Link href={`/explorer/blocks/${b.number}`} className="text-sm font-bold text-blue-600 hover:underline">{b.number}</Link>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{Math.floor((Date.now() - b.timestamp) / 1000)} secs ago</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-medium">Miner <Link href={`/explorer/address/${b.validator}`} className="text-blue-600 font-mono">{b.validator.substring(0, 10)}...</Link></p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase"><span className="text-blue-600">{b.transactionCount} txns</span> in 3.2s</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Latest Transactions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-sm font-bold">Latest Transactions</h2>
                  <Link href="/explorer/transactions" className="text-[10px] font-black text-blue-600 uppercase hover:underline">View all</Link>
               </div>
               <div className="divide-y divide-slate-100 min-h-[400px]">
                  {loading ? (
                     <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Scanning Network Activity...</div>
                  ) : latestTxns.length === 0 ? (
                     <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
                        <Database size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No recent transactions found in last 40 blocks</p>
                     </div>
                  ) : latestTxns.map((tx, i) => (
                     <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                              <FileText size={18} />
                           </div>
                           <div className="min-w-0">
                              <Link href={`/explorer/tx/${tx.hash}`} className="text-sm font-bold text-blue-600 hover:underline truncate block w-32 font-mono">{tx.hash}</Link>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{Math.floor((Date.now() - tx.timestamp) / 1000)} secs ago</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-medium">From <Link href={`/explorer/address/${tx.from}`} className="text-blue-600 font-mono">{tx.from.substring(0, 8)}...</Link></p>
                           <p className="text-xs font-medium">To <Link href={`/explorer/address/${tx.to}`} className="text-blue-600 font-mono">{tx.to.substring(0, 8)}...</Link></p>
                        </div>
                        <div className="text-right pl-4">
                           <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[9px] font-black text-slate-700 uppercase">
                              {Number(tx.value).toFixed(2)} AGRI
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>

         {/* Footer Note */}
         <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">
            <Database size={12} />
            Data provided by fwd LIFEchain RPC (Geth/PoA) & Supabase Indexer
         </div>

      </main>
      <Footer />
    </div>
  );
}
