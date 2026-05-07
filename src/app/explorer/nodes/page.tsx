'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/store/nosql-sim';
import { 
  Globe, Search, Cpu, Activity, ShieldCheck, 
  MapPin, Zap, TrendingUp, Filter, Server
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function NodesPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const n = await db.getCollection('nodes');
      setNodes(n);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      {/* Premium Header */}
      <header className="bg-[#0a0f0a] text-white border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={20} />
            </div>
            <span className="font-black tracking-tighter text-2xl uppercase italic">AgriChain<span className="text-emerald-500 text-[10px] ml-1 uppercase not-italic tracking-[0.3em]">Network</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
             <Link href="/explorer" className="hover:text-white transition-colors">Home</Link>
             <Link href="/explorer/blocks" className="hover:text-white transition-colors">Blocks</Link>
             <Link href="/explorer/transactions" className="hover:text-white transition-colors">Transactions</Link>
             <Link href="/explorer/nodes" className="text-emerald-400">Nodes</Link>
             <Link href="/explorer/resources" className="hover:text-white transition-colors">Resources</Link>
          </div>

          <div className="flex items-center gap-4">
             <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black hover:bg-white/10 transition-all">
                <Search size={14} /> SEARCH NODES
             </button>
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white"
              >
                 {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-[#0a0f0a] border-b border-white/5 p-8 flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
            >
               <Link href="/explorer" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
               <Link href="/explorer/blocks" onClick={() => setIsMobileMenuOpen(false)}>Blocks</Link>
               <Link href="/explorer/nodes" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-400">Nodes</Link>
               <Link href="/explorer/resources" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Network Overview Hero */}
      <section className="bg-[#0a0f0a] text-white pt-16 pb-32 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #34d399 0.5px, transparent 0)', backgroundSize: '64px 64px' }}></div>
         </div>
         
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6"
                  >
                     <Zap size={12} /> Global Validator Status
                  </motion.div>
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.9] mb-8">
                    Decentralized <br /><span className="text-emerald-500">Infrastructure</span>
                  </h1>
                  <p className="text-slate-400 text-lg font-light leading-relaxed mb-12 max-w-xl">
                    Mạng lưới phi tập trung toàn cầu của AgriChain đảm bảo tính minh bạch và bất biến của dữ liệu nông sản ngay từ điểm thu hoạch đầu tiên.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Staked</p>
                        <p className="text-3xl font-black">42.5M <span className="text-emerald-500">AGRI</span></p>
                     </div>
                     <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg Uptime</p>
                        <p className="text-3xl font-black text-blue-400">99.98%</p>
                     </div>
                  </div>
               </div>

               <div className="relative">
                  {/* Interactive Map Visual */}
                  <div className="aspect-square relative flex items-center justify-center">
                     <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
                     <div className="relative w-full h-full rounded-full border border-white/5 flex items-center justify-center">
                        <Globe size={300} className="text-emerald-500 opacity-5" strokeWidth={0.5} />
                        
                        {/* Animated Nodes */}
                        {[...Array(6)].map((_, i) => (
                          <motion.div 
                            key={i}
                            animate={{ 
                              scale: [1, 2, 1],
                              opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{ 
                              duration: 3 + i, 
                              repeat: Infinity,
                              delay: i * 0.5
                            }}
                            className="absolute w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                            style={{ 
                              top: `${50 + 35 * Math.sin(i * 1.1)}%`, 
                              left: `${50 + 35 * Math.cos(i * 1.1)}%` 
                            }}
                          />
                        ))}
                        
                        {/* Global Lines */}
                        <div className="absolute inset-0 rounded-full border border-emerald-500/10 rotate-45"></div>
                        <div className="absolute inset-0 rounded-full border border-blue-500/10 -rotate-12"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 relative z-20 pb-24">
         <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row justify-between items-end gap-6 bg-white">
               <div>
                  <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-3">Live Validator Registry</h3>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">Active Network Nodes</h2>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-500">
                     <Filter size={14} /> FILTER BY REGION
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50/50">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Validator Node</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Region</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Status</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Voting Power</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incentives</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {nodes.map((node, i) => (
                       <motion.tr 
                         key={i} 
                         initial={{ opacity: 0, y: 10 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: i * 0.05 }}
                         className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                       >
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-natural-900 group-hover:text-white transition-all shadow-sm">
                                   <Cpu size={24} />
                                </div>
                                <div>
                                   <p className="text-base font-black text-slate-900 mb-1">{node.name}</p>
                                   <p className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                                      {node.id.toUpperCase()}
                                   </p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                   <MapPin size={14} className="text-slate-300" />
                                   <span className="text-sm font-bold text-slate-700">{node.location}</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Global East-1</span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                <Activity size={12} className="animate-pulse" /> {node.status}
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black">
                                   <span className="text-slate-400 uppercase">Uptime</span>
                                   <span className="text-emerald-600">{node.uptime}</span>
                                </div>
                                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                   <motion.div 
                                     initial={{ width: 0 }}
                                     whileInView={{ width: node.uptime }}
                                     className="h-full bg-emerald-500"
                                   />
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <p className="text-sm font-black text-slate-900">{node.staked}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AGRI Tokens</p>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex flex-col items-end gap-2">
                                <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-2">
                                   <TrendingUp size={12} /> +12.4%
                                </span>
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Est. APR</span>
                             </div>
                          </td>
                       </motion.tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Become a Validator CTA */}
         <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="mt-16 p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-natural-900 to-black text-white relative overflow-hidden group"
         >
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
               <Cpu size={400} className="translate-x-1/2 -translate-y-1/4" />
            </div>
            
            <div className="relative z-10 max-w-3xl">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase mb-8">
                 Secure the <br /><span className="text-emerald-500">Future of Agriculture</span>
               </h2>
               <p className="text-slate-400 text-lg font-light leading-relaxed mb-12">
                 Tham gia vào mạng lưới xác thực phi tập trung của AgriChain. Bắt đầu vận hành Node của riêng bạn để bảo vệ tính minh bạch của chuỗi cung ứng và nhận phần thưởng từ hệ sinh thái.
               </p>
               <div className="flex flex-wrap gap-6">
                  <Link href="/explorer/nodes/become-validator" className="px-10 py-5 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3">
                     <Server size={18} /> Get Started Now
                  </Link>
                  <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                     View Technical Docs
                  </button>
               </div>
            </div>
         </motion.div>
      </main>
    </div>
  );
}
