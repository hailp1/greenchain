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
  const [stats, setStats] = useState<any>({
    price: 'Pending',
    market_cap: 'N/A',
    latestBlock: 0,
    gas_price: '0.1',
    tps: '0.00',
    totalTx: '0'
  });
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [latestTxns, setLatestTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // 1. Initial Load from Supabase (Resilient & Fast)
      try {
        const { data: sbTxData, count: supabaseTxCount } = await supabase
          .from('token_transactions')
          .select('*, sender:sender_id(wallet_address), receiver:receiver_id(wallet_address)')
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (sbTxData) {
          setLatestTxns(sbTxData.map(tx => ({
            hash: tx.id.replace(/-/g, '').substring(0, 40),
            timestamp: new Date(tx.created_at).getTime(),
            from: tx.sender?.wallet_address || tx.sender_address || '0x0000000000000000000000000000000000000000',
            to: tx.receiver?.wallet_address || tx.receiver_address || '0x0000000000000000000000000000000000000000',
            value: `${tx.amount}`
          })));
        }
        
        setStats((prev: any) => ({ ...prev, totalTx: (supabaseTxCount || 0).toLocaleString() }));
      } catch (e: any) {
        console.warn("Supabase initial fetch error:", e);
        setError("Supabase Sync Error: " + e.message);
      }

      // 2. Blockchain Fetch (With Hard Timeouts)
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn", undefined, { staticNetwork: true });
        
        // Timeout helper
        const withTimeout = (promise: Promise<any>, ms: number) => 
          Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))]);

        const [blockNum, feeData] = await Promise.all([
          withTimeout(provider.getBlockNumber(), 4000).catch(() => 0),
          withTimeout(provider.getFeeData(), 4000).catch(() => null)
        ]);

        if (blockNum > 0) {
          const gasPriceStr = feeData?.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0.1';
          
          // Fetch blocks
          const SEARCH_RANGE = 10; 
          const blockPromises = [];
          for (let i = 0; i < SEARCH_RANGE; i++) {
             blockPromises.push(withTimeout(provider.getBlock(blockNum - i, true), 3000).catch(() => null));
          }
          
          const validBlocks = (await Promise.all(blockPromises)).filter(b => b !== null);

          // Update stats and blocks
          setStats((prev: any) => ({
            ...prev,
            latestBlock: blockNum,
            gas_price: gasPriceStr,
          }));

          setLatestBlocks(validBlocks.slice(0, 6).map((b: any) => ({
            number: b.number,
            timestamp: b.timestamp * 1000,
            validator: b.miner,
            transactionCount: b.transactions?.length || 0,
            reward: "0.01402 AGRI"
          })));

          // If we found real chain txns, prepend or replace
          const chainTxns = [];
          for (const b of validBlocks) {
            for (const tx of (b.transactions || [])) {
              const txObj = tx as any;
              chainTxns.push({
                hash: txObj.hash || txObj,
                timestamp: b.timestamp * 1000,
                from: txObj.from || '0x...',
                to: txObj.to || "Contract / Mint",
                value: txObj.value ? ethers.formatEther(txObj.value) : '0'
              });
              if (chainTxns.length >= 6) break;
            }
            if (chainTxns.length >= 6) break;
          }
          
          if (chainTxns.length > 0) {
            setLatestTxns(chainTxns);
          }
        }
      } catch (err: any) {
        console.error('Blockchain sync error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
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
            <StatsCard icon={<Globe size={16}/>} label="AGRI Price" value={stats.price} />
            <StatsCard icon={<Zap size={16}/>} label="Total Transactions" value={stats.totalTx} sub={`(${stats.tps} TPS)`} />
            <StatsCard icon={<Box size={16}/>} label="Latest Block" value={stats.latestBlock > 0 ? `#${stats.latestBlock.toLocaleString()}` : 'Loading...'} />
            <StatsCard icon={<Server size={16}/>} label="Gas Price" value={`${stats.gas_price} Gwei`} />
         </div>

         {/* Tables Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Latest Blocks */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-sm font-bold">Latest Blocks</h2>
                  <Link href="/explorer/blocks" className="text-[10px] font-black text-blue-600 uppercase hover:underline">View all</Link>
               </div>
               <div className="divide-y divide-slate-100 min-h-[300px]">
                  {latestBlocks.length === 0 ? (
                     <div className="p-20 text-center text-slate-400 text-xs animate-pulse">Syncing Ledger...</div>
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
                           <p className="text-xs font-medium font-mono text-blue-600 truncate w-32">{b.validator}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{b.transactionCount} txns</p>
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
               <div className="divide-y divide-slate-100 min-h-[300px]">
                  {latestTxns.length === 0 ? (
                     <div className="p-20 text-center text-slate-400 text-xs animate-pulse">Scanning Network Activity...</div>
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
                        <div className="text-right hidden md:block">
                           <p className="text-xs font-medium truncate w-32">From <span className="text-blue-600 font-mono">{tx.from.substring(0, 10)}...</span></p>
                           <p className="text-xs font-medium truncate w-32">To <span className="text-blue-600 font-mono">{tx.to.substring(0, 10)}...</span></p>
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

      </main>
      <Footer />
    </div>
  );
}

function StatsCard({ icon, label, value, sub }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
       <div className="flex items-center gap-3 mb-3">
          <span className="text-slate-400">{icon}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
       </div>
       <p className="text-lg font-bold">{value} {sub && <span className="text-xs text-slate-400 font-medium">{sub}</span>}</p>
    </div>
  );
}
