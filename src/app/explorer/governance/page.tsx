'use client';

import { useState } from 'react';
import { 
  Globe, Vote, FileText, CheckCircle2, XCircle, 
  Clock, TrendingUp, Users, Menu, X, ShieldCheck, Activity
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function GovernancePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'passed' | 'failed'>('active');

  const proposals = [
    {
      id: "AGP-12",
      title: "Nâng cấp thuật toán AI Trust v4.0",
      desc: "Tích hợp mô hình học máy mới để phát hiện gian lận trong nhật ký canh tác kỹ thuật số.",
      status: "active",
      votes: { yes: 78, no: 12, abstain: 10 },
      endTime: "2 ngày còn lại"
    },
    {
      id: "AGP-11",
      title: "Mở rộng mạng lưới Node tại khu vực Miền Trung",
      desc: "Tăng cường hạ tầng blockchain tại Ninh Thuận và Bình Thuận để hỗ trợ sản phẩm Nho và Táo.",
      status: "passed",
      votes: { yes: 92, no: 5, abstain: 3 },
      endTime: "Đã kết thúc"
    },
    {
      id: "AGP-10",
      title: "Giảm 10% phí Gas cho giao dịch NFT Chứng nhận",
      desc: "Khuyến khích các hộ nông dân nhỏ lẻ tham gia số hóa nguồn gốc sản phẩm.",
      status: "passed",
      votes: { yes: 85, no: 8, abstain: 7 },
      endTime: "Đã kết thúc"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
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
             <Link href="/explorer/governance" className="text-emerald-400">Governance</Link>
             <Link href="/explorer/nodes" className="hover:text-white transition-colors">Nodes</Link>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
             {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
           <div>
              <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Governance <span className="text-emerald-500">Portal</span></h1>
              <p className="text-slate-500 text-sm max-w-2xl">Trao quyền quyết định tương lai của AgriChain cho cộng đồng validator và người nắm giữ AGRI token.</p>
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-3 bg-natural-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-natural-900/20">
                 CREATE PROPOSAL
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Active Proposals", value: "3", icon: Vote },
             { label: "Total Votes Cast", value: "1.2M", icon: Users },
             { label: "Avg Turnout", value: "68%", icon: Activity },
             { label: "AGRI Staked", value: "42.5M", icon: ShieldCheck }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <stat.icon size={20} className="text-emerald-500 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-lg font-black text-slate-900">{stat.value}</p>
             </div>
           ))}
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
           <div className="flex border-b border-slate-50 p-6 gap-8 bg-slate-50/30">
              {['active', 'passed', 'failed'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   {tab} PROPOSALS
                </button>
              ))}
           </div>
           <div className="p-8 space-y-6">
              {proposals.filter(p => p.status === activeTab || (activeTab === 'passed' && p.status === 'passed')).map((p, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[2rem] border border-slate-100 hover:border-emerald-500/20 transition-all group"
                >
                   <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-3">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-black text-slate-400">{p.id}</span>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
                               {p.status}
                            </span>
                         </div>
                         <h3 className="text-xl font-black tracking-tight text-natural-900">{p.title}</h3>
                         <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">{p.desc}</p>
                      </div>
                      <div className="w-full md:w-64 space-y-4">
                         <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-emerald-500">YES: {p.votes.yes}%</span>
                            <span className="text-rose-500">NO: {p.votes.no}%</span>
                         </div>
                         <div className="h-2 bg-slate-50 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-500" style={{ width: `${p.votes.yes}%` }}></div>
                            <div className="h-full bg-rose-500" style={{ width: `${p.votes.no}%` }}></div>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> {p.endTime}</span>
                            <button className="text-[10px] font-black text-emerald-500 hover:underline">VIEW DETAILS</button>
                         </div>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
