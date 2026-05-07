'use client';

import { useState, useEffect, use } from 'react';
import { 
  Globe, ShieldCheck, Zap, Layers, Cpu, ArrowLeft, Activity, 
  TrendingUp, BarChart3, Clock, Lock, CheckCircle2, Award, User
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function EntityExplorer({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const entityId = resolvedParams.id;
  
  const [entity, setEntity] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Entity Details
        const { data: entityData, error: eError } = await supabase
          .from('entities')
          .select('*')
          .eq('id', entityId)
          .maybeSingle();

        if (eError) throw eError;
        if (!entityData) throw new Error("Entity not found in ledger");
        setEntity(entityData);

        // 2. Fetch Batches for this entity
        const { data: batchData } = await supabase
          .from('batches')
          .select('*, blockchain_ledger(tx_hash, block_height, anchored_at)')
          .eq('producer_id', entityId)
          .order('timestamp', { ascending: false });
        setBatches(batchData || []);

        // 3. Fetch Transactions for this entity
        const { data: txData } = await supabase
          .from('token_transactions')
          .select('*')
          .or(`entity_id.eq.${entityId},sender_id.eq.${entityId},receiver_id.eq.${entityId}`)
          .order('created_at', { ascending: false });
        setTransactions(txData || []);

      } catch (err: any) {
        console.error('Entity fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [entityId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Ledger Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <Link href="/reputation" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors mb-8">
           <ArrowLeft size={14} /> Back to Leaderboard
        </Link>

        {/* Entity Profile Header */}
        <div className="bg-[#0a0f0a] rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden mb-12">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Globe size={300} />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                    <ShieldCheck size={12} /> Verified Node Protocol
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                    {entity?.name}
                 </h1>
                 <p className="text-slate-400 font-mono text-xs break-all">Entity ID: {entity?.id}</p>
                 <div className="flex flex-wrap gap-4 pt-4">
                    <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Reputation Score</p>
                       <p className="text-2xl font-black text-emerald-400">{entity?.reputation_score}</p>
                    </div>
                    <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Staked Balance</p>
                       <p className="text-2xl font-black text-blue-400">{Number(entity?.staked_balance || 0).toFixed(0)} fwd</p>
                    </div>
                    <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Role Type</p>
                       <p className="text-2xl font-black text-white">{entity?.role}</p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Node Integrity</p>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-xl font-black text-emerald-500 italic uppercase">Operational</span>
                    </div>
                 </div>
                 <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-2">
                    <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xl">
                       {entity?.name.charAt(0)}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Ledger Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left: Staking & Transactions */}
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
                 <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xs font-black text-natural-900 uppercase tracking-widest flex items-center gap-3">
                       <Zap size={16} className="text-amber-500" /> On-Chain Activity Log
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400">Showing last {transactions.length} entries</span>
                 </div>
                 <div className="divide-y divide-slate-50">
                    {transactions.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No transaction history found for this entity</div>
                    ) : transactions.map((tx, i) => (
                      <div key={i} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                         <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'GAS_FEE' ? 'bg-orange-50 text-orange-500' : tx.type === 'STAKE' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
                               {tx.type === 'GAS_FEE' ? <ArrowLeft size={20} className="rotate-135" /> : tx.type === 'STAKE' ? <Lock size={20} /> : <Award size={20} />}
                            </div>
                            <div>
                               <p className="text-sm font-black text-natural-950 uppercase">{tx.type.replace('_', ' ')}</p>
                               <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">{tx.description}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className={`text-lg font-black ${tx.type === 'GAS_FEE' || tx.type === 'STAKE' ? 'text-red-500' : 'text-emerald-500'}`}>
                               {tx.type === 'GAS_FEE' || tx.type === 'STAKE' ? '-' : '+'}{tx.amount} fwd
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">{new Date(tx.created_at).toLocaleDateString()}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Right: Anchored Batches & Validation */}
           <div className="space-y-8">
              <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
                 <div className="p-8 border-b border-slate-50 bg-emerald-600 text-white">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
                       <Layers size={16} /> Anchored Batches
                    </h3>
                 </div>
                 <div className="divide-y divide-slate-50">
                    {batches.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No supply chain batches recorded</div>
                    ) : batches.map((batch, i) => (
                      <div key={i} className="p-6 space-y-4">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-xs font-black text-natural-950">{batch.product_name}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(batch.timestamp).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${batch.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                               {batch.status}
                            </span>
                         </div>
                         {batch.blockchain_ledger?.[0] && (
                           <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Transaction Hash</p>
                              <p className="text-[10px] font-mono text-blue-600 break-all">{batch.blockchain_ledger[0].tx_hash}</p>
                              <div className="flex justify-between items-center pt-2">
                                 <p className="text-[9px] font-bold text-slate-500">Block #{batch.blockchain_ledger[0].block_height}</p>
                                 <Link href={`/explorer/${batch.blockchain_ledger[0].tx_hash}`} className="text-[9px] font-black text-emerald-600 hover:underline">VIEW RECEIPT</Link>
                              </div>
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
              </section>

              <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <TrendingUp size={100} />
                 </div>
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4">Consensus Power</p>
                    <p className="text-4xl font-black italic tracking-tighter leading-none mb-6">{(Number(entity?.reputation_score || 0) + (Number(entity?.staked_balance || 0) * 0.1)).toFixed(1)} <span className="text-xs not-italic text-blue-200">vPoints</span></p>
                    <p className="text-[10px] font-bold text-blue-100 uppercase leading-relaxed">Sức mạnh biểu quyết dựa trên staking và uy tín on-chain.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
