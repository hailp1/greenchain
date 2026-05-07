'use client';

import { useState } from 'react';
import { 
  Globe, Search, FileText, Book, Code, ShieldCheck, 
  Layers, Zap, Cpu, ArrowRight, Download, Terminal
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function ResourcesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
             <Link href="/explorer/blocks" className="hover:text-white transition-colors">Blocks</Link>
             <Link href="/explorer/transactions" className="hover:text-white transition-colors">Transactions</Link>
             <Link href="/explorer/nodes" className="hover:text-white transition-colors">Nodes</Link>
             <Link href="/explorer/resources" className="text-emerald-400">Resources</Link>
          </div>
          <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="md:hidden p-2 text-slate-400 hover:text-white"
           >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#1a251a] border-b border-white/5 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                 <Link href="/explorer" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Home</Link>
                 <Link href="/explorer/blocks" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Blocks</Link>
                 <Link href="/explorer/transactions" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Transactions</Link>
                 <Link href="/explorer/nodes" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-white/5">Nodes</Link>
                 <Link href="/explorer/resources" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-emerald-400">Resources</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-12">
           <h1 className="text-4xl font-black tracking-tighter mb-4">Resources & Documentation</h1>
           <p className="text-slate-500 max-w-2xl leading-relaxed font-light">Tất cả tài liệu kỹ thuật, hướng dẫn tích hợp và báo cáo minh bạch của hệ sinh thái AgriChain được lưu trữ tại đây.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { title: "Whitepaper v3.0", desc: "Chi tiết về thuật toán đồng thuận Proof-of-Trust và mô hình kinh tế Token AGRI.", icon: FileText, color: "text-emerald-500", href: "/docs" },
             { title: "Smart Contract API", desc: "Hướng dẫn tích hợp SDK cho nông trại và nhà máy đóng gói.", icon: Code, color: "text-blue-500", href: "/explorer/apis" },
             { title: "Transparency Report", desc: "Báo cáo kiểm toán hàng quý về tính minh bạch chuỗi cung ứng.", icon: ShieldCheck, color: "text-amber-500", href: "/explorer/network" },
             { title: "Node Setup Guide", desc: "Hướng dẫn cài đặt và vận hành Validator Node trên Linux.", icon: Terminal, color: "text-purple-500", href: "/docs" },
             { title: "AgriChain Brand Kit", desc: "Logo, font và tài liệu thiết kế chuẩn của hệ sinh thái.", icon: Layers, color: "text-rose-500", href: "/docs" },
             { title: "Governance Portal", desc: "Tham gia biểu quyết cho các đề xuất nâng cấp mạng lưới.", icon: Globe, color: "text-emerald-600", href: "/explorer/governance" }
           ].map((res, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -10 }}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-900/5 hover:border-emerald-500/20 transition-all group"
             >
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${res.color} mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                   <res.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{res.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-light">{res.desc}</p>
                <Link href={res.href} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">
                   READ MORE <ArrowRight size={14} />
                </Link>
             </motion.div>
           ))}
        </div>

        {/* Integration Section */}
        <section className="mt-20 p-8 md:p-16 bg-[#111b11] rounded-[3rem] text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
              <Code size={400} className="translate-x-1/2 -translate-y-1/4" />
           </div>
           <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Zap size={20} />
                 </div>
                 <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Developer SDK</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">Bắt đầu tích hợp chuỗi cung ứng của bạn</h2>
              <p className="text-slate-400 leading-relaxed mb-10 font-light">Chúng tôi cung cấp các API mạnh mẽ để các doanh nghiệp nông nghiệp có thể tự động hóa việc đẩy dữ liệu lên Blockchain từ các cảm biến IOT.</p>
              
              <div className="bg-black/50 p-6 rounded-2xl border border-white/10 font-mono text-sm text-emerald-400 mb-8">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 </div>
                 <p className="mb-1">npm install @agrichain/sdk</p>
                 <p className="text-slate-500">// Initialize the secure node connection</p>
                 <p>const node = await AgriChain.connect('MAINNET');</p>
              </div>

              <button className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-bold shadow-2xl shadow-emerald-500/30 hover:bg-emerald-400 transition-all active:scale-95 flex items-center gap-3">
                 <Download size={20} /> DOWNLOAD SDK
              </button>
           </div>
        </section>
      </main>
    </div>
  );
}
