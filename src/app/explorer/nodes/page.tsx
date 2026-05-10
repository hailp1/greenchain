'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Globe, Search, Cpu, Activity, ShieldCheck, 
  MapPin, Zap, TrendingUp, Filter, Server,
  Database, Layers, BarChart3, Lock, ChevronRight,
  ExternalLink, Code, FileText
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { FWD_STAKING_ADDRESS } from '@/lib/contracts/config';
import FWDStakingArtifact from '@/artifacts/contracts/FWDStaking.sol/FWDStaking.json';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NodesPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalStakedReal, setTotalStakedReal] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        
        // Fetch Real-time Staking Data
        try {
           const stakingContract = new ethers.Contract(FWD_STAKING_ADDRESS, FWDStakingArtifact.abi, provider);
           const total = await stakingContract.totalStaked();
           setTotalStakedReal(ethers.formatEther(total));
        } catch (e) {
           setTotalStakedReal("3,000,000"); // Fallback
        }

        const genesisNodes = [
          {
            id: '0x6e10c6c7647Db4533e0960AC5e6f8Acdf502685b',
            name: 'Core Authority Node 01',
            location: 'Mekong Agri-Hub, VN',
            status: 'ACTIVE (SEALING)',
            uptime: '100.00%',
            staked: '1,000,000',
            apr: 'Genesis'
          },
          {
            id: '0x3C4662Fa2E7C02bD386dF6e418d1317110fC7358',
            name: 'Audit Authority Node 02',
            location: 'Singapore Central, SG',
            status: 'ACTIVE (SIGNING)',
            uptime: '100.00%',
            staked: '1,000,000',
            apr: 'Genesis'
          },
          {
            id: '0xC0647Cc5FEf44d5696e559ae305a07B03710E060',
            name: 'Retail Authority Node 03',
            location: 'Tokyo Digital, JP',
            status: 'ACTIVE (SIGNING)',
            uptime: '100.00%',
            staked: '1,000,000',
            apr: 'Genesis'
          }
        ];

        const { data } = await supabase
          .from('entities')
          .select('*')
          .order('reputation_score', { ascending: false });
          
        if (data) {
          const formatted = data.map((entity: any) => ({
            id: entity.wallet_address || entity.id,
            name: entity.name,
            location: entity.role === 'FARM' ? 'Regional Hub' : 'Corporate Node',
            status: 'ACTIVE',
            uptime: `${(Math.min(99.99, entity.reputation_score + 10)).toFixed(2)}%`,
            staked: Number(entity.staked_balance || 0).toLocaleString(),
            apr: '+12.4%'
          }));
          setNodes([...genesisNodes, ...formatted]);
        } else {
          setNodes(genesisNodes);
        }
      } catch (err) {
        console.error("Error fetching nodes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Header />
      
      {/* Premium Dark Hero */}
      <section className="pt-40 pb-32 bg-[#020617] text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 0.5px, transparent 0)', backgroundSize: '64px 64px' }}></div>
         </div>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3"></div>
         
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                     <Server size={14} className="text-blue-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">PoA Network Infrastructure</span>
                  </motion.div>
                  
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                     Decentralized <br /><span className="text-blue-500">Nodes</span>
                  </h1>
                  <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl italic leading-relaxed">
                     The backbone of fwd LIFEchain. Global authority nodes ensuring cryptographic truth and agricultural data integrity.
                  </p>
                  
                   <div className="grid grid-cols-2 gap-6 max-w-md">
                     <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-3xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Value Locked</p>
                        <p className="text-3xl font-black text-white italic">84.2M <span className="text-xs text-blue-500">AGRI</span></p>
                     </div>
                     <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-3xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Nodes</p>
                        <p className="text-3xl font-black text-emerald-400 italic">1,204</p>
                     </div>
                  </div>
               </div>

               <div className="relative flex justify-center items-center">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
                  <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                     className="relative w-80 h-80 md:w-[500px] md:h-[500px] rounded-full border border-white/5 flex items-center justify-center p-20"
                  >
                     <Globe className="w-full h-full text-blue-600/10" strokeWidth={0.5} />
                     {[...Array(8)].map((_, i) => (
                        <motion.div 
                           key={i}
                           className="absolute w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                           style={{ 
                              top: `${50 + 40 * Math.sin(i * (Math.PI / 4))}%`,
                              left: `${50 + 40 * Math.cos(i * (Math.PI / 4))}%`
                           }}
                        />
                     ))}
                  </motion.div>
               </div>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 relative z-20 space-y-16 pb-24">
         
         {/* Validator Registry Table */}
         <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-10 md:p-14 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Authority <span className="text-blue-600">Registry</span></h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Verified cryptographic sealing & signing infrastructure</p>
               </div>
               
               <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                     <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder="Filter by node address..." 
                       className="bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-full md:w-64"
                     />
                  </div>
                  <button className="px-6 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-950/20">
                     Technical Docs
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Authority Node</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Location</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Stake (AGRI)</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Yield</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading ? (
                        <tr>
                           <td colSpan={6} className="px-10 py-24 text-center">
                              <RefreshCw size={32} className="text-blue-500 animate-spin mx-auto mb-4" />
                              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Auditing Network Nodes...</span>
                           </td>
                        </tr>
                     ) : nodes.map((node, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                                    <Cpu size={28} />
                                 </div>
                                 <div>
                                    <p className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{node.name}</p>
                                    <p className="text-[10px] font-mono font-bold text-slate-400 mt-1">{node.id.substring(0, 18)}...</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex items-center gap-2">
                                 <MapPin size={14} className="text-slate-300" />
                                 <span className="text-sm font-bold text-slate-700">{node.location}</span>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                 {node.status}
                              </span>
                           </td>
                           <td className="px-10 py-8">
                              <div className="space-y-2">
                                 <div className="flex justify-between items-center text-[10px] font-black">
                                    <span className="text-slate-400 uppercase">Uptime</span>
                                    <span className="text-emerald-600">{node.uptime}</span>
                                 </div>
                                 <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: node.uptime }} className="h-full bg-emerald-500" />
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <p className="text-lg font-black text-slate-900 tracking-tight">{node.staked}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Voting Power</p>
                           </td>
                           <td className="px-10 py-8 text-right">
                              <span className="text-sm font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                 {node.apr}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Call to Action */}
         <section className="bg-slate-950 rounded-[4rem] p-16 md:p-24 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 0.5px, transparent 0)', backgroundSize: '48px 48px' }}></div>
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                     Secure the <br /><span className="text-blue-500">Agri-Ledger</span>
                  </h2>
                  <p className="text-slate-400 text-lg font-medium italic leading-relaxed">
                     Operate an authority node to earn AGRI rewards while securing the absolute truth of global agricultural origin.
                  </p>
                  <div className="flex flex-wrap gap-4">
                     <Link href="/explorer/nodes/become-validator" className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:scale-105 transition-all">Become Authority</Link>
                     <Link href="/about" className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">View Specs</Link>
                  </div>
               </div>
               <div className="hidden lg:flex justify-center">
                  <div className="w-80 h-80 bg-blue-600/20 rounded-[4rem] border border-blue-500/30 flex items-center justify-center p-10 rotate-12 group-hover:rotate-6 transition-transform duration-700">
                     <Layers size={160} className="text-blue-500" />
                  </div>
               </div>
            </div>
         </section>

      </main>
      
      <Footer />
    </div>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
