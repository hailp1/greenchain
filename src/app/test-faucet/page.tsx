'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { 
  Zap, Box, Search, RefreshCw, ShieldCheck, Database, ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RPC_URL = 'https://rpc.fwdlife.vn';

export default function TestFaucet() {
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL, undefined, { staticNetwork: true });
      
      let data: any = null;
      if (target.startsWith('0x') && target.length > 42) {
        // Transaction Hash
        data = await provider.getTransaction(target);
      } else if (!isNaN(Number(target))) {
        // Block Number
        data = await provider.getBlock(Number(target), true);
      } else {
        // Current Stats
        const blockNum = await provider.getBlockNumber();
        const fee = await provider.getFeeData();
        data = { latestBlock: blockNum, gasPrice: ethers.formatUnits(fee.gasPrice || 0, 'gwei') };
      }

      if (!data) throw new Error("No data found for the given target.");
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch data from RPC.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 pt-40 pb-24 space-y-12">
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <Zap size={12} className="text-amber-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Advanced Diagnostic Tool</span>
           </div>
           <h1 className="text-5xl font-black tracking-tighter uppercase italic">Test <span className="text-blue-600">Faucet</span> & Diagnostic</h1>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Verify raw blockchain data directly from Geth Node</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-8">
           <div className="flex flex-col gap-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Block Number / Tx Hash (Leave empty for latest stats)</label>
              <div className="flex gap-4">
                 <input 
                   type="text" 
                   value={target}
                   onChange={(e) => setTarget(e.target.value)}
                   placeholder="e.g. 18240 or 0x..."
                   className="flex-grow p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                 />
                 <button 
                   onClick={checkData}
                   disabled={loading}
                   className="px-8 bg-blue-600 text-white rounded-2xl font-black uppercase italic hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20"
                 >
                   {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                   Check
                 </button>
              </div>
           </div>

           {error && (
             <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">!</div>
                {error}
             </div>
           )}

           {result && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black text-slate-900 uppercase">Raw Result Data</h3>
                   <span className="text-[10px] font-black text-emerald-500 uppercase">OK - Data Received</span>
                </div>
                <div className="p-6 bg-slate-950 rounded-2xl border border-white/10 overflow-auto max-h-[500px]">
                   <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed">
                      {JSON.stringify(result, (key, value) => 
                        typeof value === 'bigint' ? value.toString() : value, 
                      2)}
                   </pre>
                </div>
             </div>
           )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                 <ShieldCheck size={24} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-xs font-black uppercase tracking-widest">PoA Validation</h4>
                 <p className="text-[11px] text-slate-500 font-medium">Verify that blocks are being minted correctly by the authorized validator set on fwd LIFEchain.</p>
              </div>
           </div>
           <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                 <Database size={24} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-xs font-black uppercase tracking-widest">Direct RPC Access</h4>
                 <p className="text-[11px] text-slate-500 font-medium">This tool bypasses all caching layers to provide a raw view of the current ledger state for debugging.</p>
              </div>
           </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
