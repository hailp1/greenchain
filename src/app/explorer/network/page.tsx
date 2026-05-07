'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, Zap, Activity, ShieldCheck, Server, 
  TrendingUp, Clock, Database, Menu, X, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function NetworkPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    tps: "45.2",
    nodes: "1,420",
    blockTime: "12.2s",
    totalStaked: "42.5M AGRI",
    uptime: "99.99%",
    marketCap: "$298.4B"
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      {/* Explorer Header */}
      <header className="bg-[#111b11] text-white border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl">AgriChain<span className="text-emerald-500 text-xs ml-1 uppercase tracking-widest">Explorer</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
             <Link href="/explorer" className="hover:text-white transition-colors">Home</Link>
             <Link href="/explorer/blocks" className="hover:text-white transition-colors">Blocks</Link>
             <Link href="/explorer/transactions" className="hover:text-white transition-colors">Transactions</Link>
             <Link href="/explorer/nodes" className="hover:text-white transition-colors">Nodes</Link>
             <Link href="/explorer/network" className="text-emerald-400">Network</Link>
          </div>

          <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="md:hidden p-2 text-slate-400 hover:text-white"
           >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#1a251a] border-b border-white/5 overflow-hidden">
              <div className="p-6 flex flex-col gap-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                 <Link href="/explorer" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                 <Link href="/explorer/blocks" onClick={() => setIsMobileMenuOpen(false)}>Blocks</Link>
                 <Link href="/explorer/transactions" onClick={() => setIsMobileMenuOpen(false)}>Transactions</Link>
                 <Link href="/explorer/nodes" onClick={() => setIsMobileMenuOpen(false)}>Nodes</Link>
                 <Link href="/explorer/network" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-400">Network</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-12">
           <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Network <span className="text-emerald-500">Analytics</span></h1>
           <p className="text-slate-500 text-sm max-w-2xl">Dữ liệu thời gian thực về sức khỏe và hiệu năng của mạng lưới AgriChain Core V3 Mainnet.</p>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
           {[
             { label: "TPS", value: stats.tps, icon: Activity, color: "text-blue-500" },
             { label: "Nodes", value: stats.nodes, icon: Server, color: "text-emerald-500" },
             { label: "Block Time", value: stats.blockTime, icon: Clock, color: "text-amber-500" },
             { label: "Total Staked", value: stats.totalStaked, icon: Zap, color: "text-purple-500" },
             { label: "Uptime", value: stats.uptime, icon: ShieldCheck, color: "text-emerald-400" },
             { label: "Network Cap", value: stats.marketCap, icon: TrendingUp, color: "text-rose-500" }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5">
                <stat.icon size={20} className={`${stat.color} mb-4`} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-lg font-black text-slate-900">{stat.value}</p>
             </div>
           ))}
        </div>

        {/* Global Node Distribution */}
        <div className="bg-[#111b11] rounded-[3rem] p-12 mb-12 relative overflow-hidden border border-white/5">
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #34d399 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 className="text-3xl font-black text-white tracking-tighter mb-6 uppercase italic">Node Distribution</h2>
                 <p className="text-slate-400 mb-8 leading-relaxed">Mạng lưới AgriChain được phân bổ chiến lược tại các trung tâm nông nghiệp và logistics toàn cầu, đảm bảo độ trễ thấp và tính sẵn sàng cao.</p>
                 <div className="space-y-4">
                    {[
                      { region: "Vietnam (South)", count: 420, percent: 30 },
                      { region: "Vietnam (North)", count: 310, percent: 22 },
                      { region: "Europe Hub", count: 280, percent: 20 },
                      { region: "USA Distribution", count: 210, percent: 15 },
                      { region: "Others", count: 200, percent: 13 }
                    ].map((reg, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-300">{reg.region}</span>
                            <span className="text-emerald-400">{reg.count} Nodes</span>
                         </div>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${reg.percent}%` }} transition={{ duration: 1, delay: i*0.1 }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></motion.div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="flex justify-center">
                 <div className="w-80 h-80 rounded-full border border-emerald-500/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 animate-ping"></div>
                    <Globe size={160} className="text-emerald-500 opacity-20" />
                    <Activity size={40} className="text-emerald-500 absolute" />
                 </div>
              </div>
           </div>
        </div>

        {/* Network Health Logs */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                 <Database size={16} className="text-emerald-500" />
                 Live Network Logs
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-500 animate-pulse">● Connected to Node #VN-01</span>
           </div>
           <div className="p-8 font-mono text-[11px] space-y-3 max-h-[300px] overflow-y-auto bg-slate-900 text-emerald-400/80">
              <p>[08:42:01] New block minted: #19482415 (Validator: AgriNode_VN_01)</p>
              <p>[08:42:05] Consensus reached for transaction 0x5e1b...b8e0 (128 confirmations)</p>
              <p>[08:42:08] Node sync completed: Ninh_Hoà_Safe (Height: 19482415)</p>
              <p className="text-white/40">[08:42:12] Heartbeat sent to all validator nodes...</p>
              <p>[08:42:15] New block minted: #19482416 (Validator: Lâm_Đồng_Core)</p>
              <p>[08:42:20] 45 transactions pending in memory pool...</p>
              <p className="text-blue-400">[08:42:25] AI Trust Audit initiated for Block #19482416</p>
           </div>
        </div>
      </main>
    </div>
  );
}
