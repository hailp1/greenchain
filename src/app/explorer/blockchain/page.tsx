'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/store/nosql-sim';
import { 
  Globe, Search, Layers, Zap, Activity, TrendingUp, 
  BarChart3, ShieldCheck, Database, Clock
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BlockchainPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const s = await db.getCollection('network_stats');
      setStats(s[0]);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-[#111b11] text-white border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/explorer" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl">AgriChain<span className="text-emerald-500 text-xs ml-1 uppercase tracking-widest">Explorer</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
             <Link href="/explorer" className="hover:text-white transition-colors">Home</Link>
             <Link href="/explorer/blocks" className="hover:text-white transition-colors">Blocks</Link>
             <Link href="/explorer/blockchain" className="text-emerald-400">Blockchain</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-12">
           <h1 className="text-4xl font-black tracking-tighter mb-4">Blockchain Overview</h1>
           <p className="text-slate-500 max-w-2xl leading-relaxed font-light">Báo cáo tình trạng sức khỏe và các thông số vận hành thực tế của mạng lưới AgriChain Core.</p>
        </div>

        {/* Real-time Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Network Hashrate", value: "254.2 TH/s", trend: "+5.2%", icon: Zap, color: "text-blue-500" },
             { label: "Active Addresses", value: "842,109", trend: "+12.4%", icon: Globe, color: "text-emerald-500" },
             { label: "Total Transactions", value: "1.2 Billion", trend: "+2.1M/day", icon: Activity, color: "text-amber-500" },
             { label: "Total Staked Value", value: "$450.2M", trend: "APR 8.4%", icon: ShieldCheck, color: "text-purple-500" }
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-900/5"
             >
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} mb-6 shadow-sm`}>
                   <stat.icon size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-xs font-bold text-emerald-500">{stat.trend}</p>
             </motion.div>
           ))}
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-900/5">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h3 className="text-xl font-bold mb-1">Transaction History (14 Days)</h3>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Biểu đồ tần suất giao dịch xác thực nông sản</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400">
                       <TrendingUp size={12} className="text-emerald-500" /> STABLE GROWTH
                    </div>
                 </div>
                 
                 {/* Simulated Chart Bars */}
                 <div className="h-64 flex items-end gap-3 px-4">
                    {[40, 60, 45, 70, 85, 55, 90, 65, 80, 95, 75, 100, 85, 110].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 1 }}
                        className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg group relative"
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {h}k
                         </div>
                      </motion.div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-6 px-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    <span>14 Days Ago</span>
                    <span>Today</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-900/5">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                          <Database size={20} />
                       </div>
                       <h4 className="text-sm font-bold uppercase tracking-widest">Storage Status</h4>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <div className="flex justify-between mb-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase">IPFS Utilization</span>
                             <span className="text-[10px] font-bold text-slate-900">82%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: '82%' }}></div>
                          </div>
                       </div>
                       <div>
                          <div className="flex justify-between mb-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase">Ledger Size</span>
                             <span className="text-[10px] font-bold text-slate-900">1.4 TB</span>
                          </div>
                          <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{ width: '65%' }}></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-900/5">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                          <Clock size={20} />
                       </div>
                       <h4 className="text-sm font-bold uppercase tracking-widest">Block Time</h4>
                    </div>
                    <div className="text-center py-4">
                       <h2 className="text-4xl font-black text-slate-900 mb-2">12.0s</h2>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Average Confirmation</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-20"></div>
                 <h3 className="text-xl font-bold mb-8 relative z-10">Network Supply</h3>
                 <div className="space-y-6 relative z-10">
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Circulating Supply</p>
                       <p className="text-2xl font-black">125,000,000 AGRI</p>
                    </div>
                    <div className="h-[1px] bg-white/10"></div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Max Supply</p>
                       <p className="text-2xl font-black">500,000,000 AGRI</p>
                    </div>
                    <div className="h-[1px] bg-white/10"></div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Burnt (Deflationary)</p>
                       <p className="text-2xl font-black text-rose-400">1,402,112 AGRI</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-900/5">
                 <h3 className="text-lg font-bold mb-6">Latest Updates</h3>
                 <div className="space-y-6">
                    {[
                      { title: "Hardfork v3.1 Successful", date: "2 days ago", type: "System" },
                      { title: "New Validator in Lam Dong", date: "5 days ago", type: "Network" },
                      { title: "IPFS Cluster Upgrade", date: "1 week ago", type: "Storage" }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                         <div className="w-1.5 h-auto bg-emerald-500 rounded-full"></div>
                         <div>
                            <p className="text-xs font-bold text-slate-900">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[8px] font-black text-slate-300 uppercase">{item.date}</span>
                               <span className="text-[8px] font-black text-blue-500 uppercase">{item.type}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-8 py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all">
                    View Network Logs
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
