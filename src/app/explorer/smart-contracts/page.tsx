'use client';

import { useState } from 'react';
import { 
  Globe, ShieldCheck, FileCode, Lock, 
  ExternalLink, CheckCircle2, Search, Menu, X, Terminal, Cpu
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartContractsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const contracts = [
    { name: "AgriChain Core Registry", address: "0x7a2d4E813F0C5...f9e1", type: "Main Logic", audit: "CertiK Verified" },
    { name: "Product Identity NFT (ERC-721)", address: "0x9c3dE41F3B2a...e4a2", type: "Asset Issuance", audit: "OpenZeppelin Audit" },
    { name: "Validator Staking V2", address: "0x1a2b3c4d5e6f...a1b2", type: "Consensus", audit: "Quantstamp Verified" },
    { name: "Sustainability Oracle", address: "0x4e5f6g7h8i9j...k1l2", type: "Oracle Data", audit: "Internal Audit" }
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
             <Link href="/explorer/smart-contracts" className="text-emerald-400">Smart Contracts</Link>
             <Link href="/explorer/resources" className="hover:text-white transition-colors">Resources</Link>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
             {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-16">
           <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Smart <span className="text-emerald-500">Contracts</span></h1>
           <p className="text-slate-500 text-sm max-w-2xl">Danh sách các hợp đồng thông minh đã được kiểm chứng và triển khai trên mạng lưới AgriChain Core.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           {contracts.map((contract, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 group hover:border-emerald-500/20 transition-all"
             >
                <div className="flex justify-between items-start mb-8">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <FileCode size={28} />
                   </div>
                   <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                         {contract.audit}
                      </span>
                   </div>
                </div>
                <div className="space-y-4 mb-8">
                   <h3 className="text-xl font-black text-natural-900 tracking-tight">{contract.name}</h3>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group-hover:bg-emerald-50/50 transition-colors">
                      <code className="text-xs font-mono font-bold text-slate-500">{contract.address}</code>
                      <ExternalLink size={14} className="text-slate-300 group-hover:text-emerald-500" />
                   </div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type: {contract.type}</span>
                   <Link href={`/explorer/${contract.address}`} className="text-[10px] font-black text-emerald-500 hover:underline">READ CONTRACT</Link>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="p-12 rounded-[3rem] bg-natural-900 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5"><Lock size={120} /></div>
           <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-black tracking-tighter mb-6 uppercase italic">Security & Audits</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">Tất cả các hợp đồng thông minh trên AgriChain đều phải trải qua quy trình kiểm tra mã nguồn (Code Audit) nghiêm ngặt bởi các đơn vị bảo mật hàng đầu trước khi được triển khai lên Mainnet.</p>
              <div className="flex flex-wrap gap-4">
                 <button className="px-8 py-4 bg-emerald-500 text-natural-950 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all">
                    VIEW AUDIT REPORTS
                 </button>
                 <button className="px-8 py-4 bg-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                    SUBMIT BUG BOUNTY
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
