'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Server, ShieldCheck, Activity, Globe, Pickaxe, Info, Database
} from 'lucide-react';
import Link from 'next/link';
import { ethers } from 'ethers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NodesPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStaked, setTotalStaked] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
        // 1. Identify Active Miners from last 100 blocks
        const currentBlock = await provider.getBlockNumber();
        const blockPromises = [];
        for (let i = 0; i < 50; i++) {
          if (currentBlock - i >= 0) {
            blockPromises.push(provider.getBlock(currentBlock - i));
          }
        }
        const blocks = await Promise.all(blockPromises);
        const activeMiners = new Set(blocks.filter(b => b !== null).map(b => b.miner));
        
        // 2. Fetch Staked Entities from Supabase
        const { data: entities } = await supabase
          .from('entities')
          .select('*')
          .order('staked_balance', { ascending: false });

        let totalS = 0;
        const formattedNodes = (entities || []).map(e => {
          totalS += Number(e.staked_balance || 0);
          return {
            address: e.wallet_address,
            name: e.name,
            role: e.role,
            staked: Number(e.staked_balance || 0),
            reputation: e.reputation_score,
            isActive: activeMiners.has(e.wallet_address),
            type: activeMiners.has(e.wallet_address) ? 'Authority' : 'Staker'
          };
        });

        // 3. Add Genesis Nodes if they aren't in entities but are mining
        activeMiners.forEach(minerAddr => {
           if (!formattedNodes.find(n => n.address.toLowerCase() === minerAddr.toLowerCase())) {
              formattedNodes.push({
                 address: minerAddr,
                 name: "Genesis Authority",
                 role: "ADMIN",
                 staked: 1000000,
                 reputation: 100,
                 isActive: true,
                 type: 'Authority'
              });
           }
        });

        setNodes(formattedNodes);
        setTotalStaked(totalS.toLocaleString());
      } catch (err) {
        console.error("Nodes load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24">
      <Header />
      
      <main className="pt-24 max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
           <div>
              <h1 className="text-xl font-bold text-slate-800">Network Nodes</h1>
              <p className="text-sm text-slate-500 mt-1">PoA Authority Nodes & Community Validators</p>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Nodes</p>
                 <p className="text-lg font-black text-blue-600">{nodes.filter(n => n.isActive).length}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Staked</p>
                 <p className="text-lg font-black text-emerald-600">{totalStaked} AGRI</p>
              </div>
           </div>
        </div>

        {/* Use Case Advice Banner */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
           <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0">
                 <Activity size={20} />
              </div>
              <div className="space-y-1">
                 <h3 className="text-sm font-bold text-emerald-900">Agriculture Use Case Strategy</h3>
                 <p className="text-xs text-emerald-700 leading-relaxed max-w-3xl">
                    Nodes in fwd LIFEchain act as **Digital Auditors**. In an agricultural context, these nodes represent Co-ops, Government Auditors, and Logistics hubs. 
                    They verify harvest batch hashes (GPS + Time) and use their **Reputation Score** to provide weighted validation of food safety certificates.
                 </p>
              </div>
           </div>
        </div>

        {/* Nodes Table */}
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <tr>
                       <th className="px-6 py-4">Validator / Node Name</th>
                       <th className="px-6 py-4">Role</th>
                       <th className="px-6 py-4">Wallet Address</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Reputation</th>
                       <th className="px-6 py-4 text-right">Staked Balance</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {loading ? (
                       Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                             <td colSpan={6} className="px-6 py-8 bg-slate-50/20"></td>
                          </tr>
                       ))
                    ) : (
                       nodes.map((node, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${node.isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                      <Server size={14} />
                                   </div>
                                   <div>
                                      <p className="font-bold text-slate-800">{node.name}</p>
                                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{node.type}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase">
                                   {node.role}
                                </span>
                             </td>
                             <td className="px-6 py-4">
                                <Link href={`/explorer/address/${node.address}`} className="text-blue-600 font-mono text-xs hover:underline">
                                   {node.address.substring(0, 10)}...{node.address.substring(38)}
                                </Link>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <div className={`w-2 h-2 rounded-full ${node.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                   <span className={`text-xs font-bold ${node.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                      {node.isActive ? 'Active & Sealing' : 'Standby'}
                                   </span>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <ShieldCheck size={14} className={node.reputation > 80 ? 'text-blue-500' : 'text-slate-300'} />
                                   <span className="font-bold">{node.reputation}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-right font-black text-slate-900">
                                {node.staked.toLocaleString()} AGRI
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
           <Info size={12} />
           Active status is verified by checking the last 50 blocks from rpc.fwdlife.vn
        </div>

      </main>
      <Footer />
    </div>
  );
}
