'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Box, Zap, FileText, ArrowRight, Server, Globe
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ethers } from 'ethers';
import { FWD_TOKEN_ADDRESS } from '@/lib/contracts/config';

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
        
        const blockNum = await provider.getBlockNumber();
        const feeData = await provider.getFeeData();
        const gasPriceStr = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0.308';

        setStats({
          price: 'Pending',
          priceChange: '',
          market_cap: 'N/A',
          latestBlock: blockNum,
          lastSafeBlock: blockNum - 12,
          gas_price: gasPriceStr,
          tps: '12.3',
          totalTx: '3,457.59 M'
        });
        
        // Fetch more blocks to find transactions if necessary
        const blockPromises = [];
        const SEARCH_RANGE = 50; 
        for (let i = 0; i < SEARCH_RANGE; i++) {
          if (blockNum - i >= 0) {
            blockPromises.push(provider.getBlock(blockNum - i, true));
          }
        }
        
        const fetchedBlocks = await Promise.all(blockPromises);
        const validBlocks = fetchedBlocks.filter(b => b !== null);

        // Update latest blocks (just the top 6)
        setLatestBlocks(validBlocks.slice(0, 6).map((b: any) => ({
          number: b.number,
          timestamp: b.timestamp * 1000,
          validator: b.miner,
          transactionCount: b.prefetchedTransactions?.length || b.transactions?.length || 0,
          reward: "0.01402 AGRI"
        })));
        
        // Collect transactions from the larger search range
        let txns: any[] = [];
        for (const b of validBlocks) {
          const prefetchTxs = (b as any).prefetchedTransactions || [];
          for (const tx of prefetchTxs) {
            txns.push({
              hash: tx.hash,
              timestamp: b.timestamp * 1000,
              from: tx.from,
              to: tx.to || "Contract Creation",
              value: ethers.formatEther(tx.value || 0)
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      
      {/* Search & Hero Section (Etherscan-like dark/blue header) */}
      <section className="pt-24 pb-12 bg-[#111827] text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-xl font-medium mb-4">The fwd LIFEchain Explorer</h1>
            
            <div className="relative max-w-3xl">
               <div className="flex bg-white rounded-md overflow-hidden">
                  <div className="hidden sm:flex items-center px-4 bg-gray-100 border-r border-gray-200 text-gray-600 text-sm">
                     All Filters
                  </div>
                  <input 
                    type="text" 
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by Address / Txn Hash / Block / Token..." 
                    className="flex-grow bg-white text-gray-900 px-4 py-3 text-sm focus:outline-none"
                  />
                  <button 
                     onClick={handleSearch}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition-colors flex items-center justify-center"
                  >
                     <Search size={18} />
                  </button>
               </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">Featured: Access data from 50+ chain IDs with a single API key</p>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 space-y-6 pb-12">
         
         {/* Top Level Stats */}
         <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-slate-200">
               <div className="flex items-start gap-4">
                  <Globe className="text-slate-500 mt-1" size={20} />
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-medium">AGRI PRICE</p>
                     <p className="text-sm font-medium">{stats?.price} <span className="text-emerald-500 ml-1">{stats?.priceChange}</span></p>
                  </div>
               </div>
               <div className="mt-4 flex items-start gap-4">
                  <Globe className="text-slate-500 mt-1" size={20} />
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-medium">MARKET CAP</p>
                     <p className="text-sm font-medium">{stats?.market_cap}</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-slate-200">
               <div className="flex items-start gap-4">
                  <Zap className="text-slate-500 mt-1" size={20} />
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-medium">TRANSACTIONS</p>
                     <p className="text-sm font-medium">{stats?.totalTx} <span className="text-slate-500 text-xs ml-1">({stats?.tps} TPS)</span></p>
                  </div>
               </div>
               <div className="mt-4 flex items-start gap-4">
                  <Server className="text-slate-500 mt-1" size={20} />
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-medium">LATEST BLOCK</p>
                     <p className="text-sm font-medium">{stats?.latestBlock?.toLocaleString()}</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 p-5 hidden lg:block">
               <p className="text-xs text-slate-500 uppercase font-medium">TRANSACTION HISTORY IN 14 DAYS</p>
               <div className="h-16 mt-2 w-full flex items-end">
                  <svg viewBox="0 0 100 30" className="w-full h-full stroke-slate-300" fill="none" preserveAspectRatio="none">
                     <path d="M0,20 Q10,10 20,25 T40,15 T60,20 T80,5 T100,20" strokeWidth="1" />
                  </svg>
               </div>
            </div>
         </div>

         {/* Latest Data Feed */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Latest Blocks */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
               <div className="p-4 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800">Latest Blocks</h3>
               </div>
               <div className="flex-grow divide-y divide-slate-100">
                  {latestBlocks.map((block, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded text-slate-400 flex items-center justify-center border border-slate-100">
                             <Box size={18} />
                          </div>
                          <div>
                             <Link href={`/explorer/blocks/${block.number}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                {block.number}
                             </Link>
                             <p className="text-xs text-slate-500">{( (Date.now() - block.timestamp) / 1000 ).toFixed(0)} secs ago</p>
                          </div>
                       </div>
                       <div className="text-right sm:text-left flex-grow sm:px-8">
                          <div className="text-sm">
                             <span className="text-slate-500">Miner </span>
                             <Link href={`/explorer/address/${block.validator}`} className="text-blue-600 hover:text-blue-800 truncate inline-block max-w-[100px] align-bottom">
                                {block.validator.substring(0, 10)}...
                             </Link>
                          </div>
                          <Link href={`/explorer/blocks/${block.number}`} className="text-xs text-blue-600 hover:text-blue-800">
                             {block.transactionCount} txns
                          </Link>
                          <span className="text-xs text-slate-500 ml-1">in 12 secs</span>
                       </div>
                       <div className="hidden sm:block">
                          <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                             {block.reward}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
               <Link href="/explorer/blocks" className="p-3 bg-slate-50 hover:bg-slate-100 text-center text-xs text-slate-600 border-t border-slate-200 transition-colors uppercase font-medium mt-auto">
                  View all blocks <ArrowRight size={12} className="inline ml-1" />
               </Link>
            </div>

            {/* Latest Transactions */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
               <div className="p-4 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800">Latest Transactions</h3>
               </div>
               <div className="flex-grow divide-y divide-slate-100">
                  {latestTxns.map((tx, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded text-slate-400 flex items-center justify-center border border-slate-100">
                             <FileText size={18} />
                          </div>
                          <div>
                             <Link href={`/explorer/tx/${tx.hash}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium truncate max-w-[120px] block">
                                {tx.hash}
                             </Link>
                             <p className="text-xs text-slate-500">{( (Date.now() - tx.timestamp) / 1000 ).toFixed(0)} secs ago</p>
                          </div>
                       </div>
                       <div className="flex-grow sm:px-8 text-sm">
                          <div>
                             <span className="text-slate-500">From </span>
                             <Link href={`/explorer/address/${tx.from}`} className="text-blue-600 hover:text-blue-800 truncate inline-block max-w-[100px] align-bottom">
                                {tx.from.substring(0, 10)}...
                             </Link>
                          </div>
                          <div>
                             <span className="text-slate-500">To </span>
                             <Link href={`/explorer/address/${tx.to}`} className="text-blue-600 hover:text-blue-800 truncate inline-block max-w-[100px] align-bottom">
                                {tx.to.substring(0, 10)}...
                             </Link>
                          </div>
                       </div>
                       <div className="hidden sm:block">
                          <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                             {Number(tx.value).toFixed(5)} AGRI
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
               <Link href="/explorer/transactions" className="p-3 bg-slate-50 hover:bg-slate-100 text-center text-xs text-slate-600 border-t border-slate-200 transition-colors uppercase font-medium mt-auto">
                  View all transactions <ArrowRight size={12} className="inline ml-1" />
               </Link>
            </div>

         </div>
      </main>
      
      <Footer />
    </div>
  );
}
