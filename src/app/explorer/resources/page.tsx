'use client';

import { useState } from 'react';
import { 
  Globe, Search, FileText, Book, Code, ShieldCheck, 
  Layers, Zap, Cpu, ArrowRight, Download, Terminal,
  BookOpen, Lock, Server, Database, Activity, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Header />
      
      {/* Premium Hero Section */}
      <section className="pt-40 pb-24 bg-[#020617] text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 0.5px, transparent 0)', backgroundSize: '48px 48px' }}></div>
         </div>
         <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                     <BookOpen size={12} className="text-blue-400" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Knowledge Base & SDK</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">Resource <span className="text-blue-500">Center</span></h1>
                  <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl italic">
                     Technical specifications, developer documentation, and transparency reports for the fwd LIFEchain ecosystem.
                  </p>
               </div>
               
               <div className="flex items-center gap-4">
                  <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
                     Technical Whitepaper
                  </button>
               </div>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20 space-y-16 pb-24">
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Network Whitepaper v3.1", 
                desc: "Deep-dive into Proof-of-Authority consensus, validator sealing logic, and the AGRI token economy.", 
                icon: FileText, 
                color: "text-blue-500", 
                bg: "bg-blue-50",
                href: "/docs" 
              },
              { 
                title: "Smart Contract Suite", 
                desc: "Full ABI documentation and interaction guides for the Agri-Anchor and Staking protocols.", 
                icon: Code, 
                color: "text-emerald-500", 
                bg: "bg-emerald-50",
                href: "/explorer/apis" 
              },
              { 
                title: "Audit & Integrity Report", 
                desc: "Quarterly forensic audits confirming the immutable link between physical crops and blockchain states.", 
                icon: ShieldCheck, 
                color: "text-amber-500", 
                bg: "bg-amber-50",
                href: "/explorer/network" 
              },
              { 
                title: "Node Infrastructure", 
                desc: "Step-by-step technical guide for setting up and securing Geth PoA sealing nodes.", 
                icon: Terminal, 
                color: "text-purple-500", 
                bg: "bg-purple-50",
                href: "/docs" 
              },
              { 
                title: "Visual Identity Kit", 
                desc: "Institutional branding assets, including vector logos, typography, and design system tokens.", 
                icon: Layers, 
                color: "text-rose-500", 
                bg: "bg-rose-50",
                href: "/docs" 
              },
              { 
                title: "Protocol Governance", 
                desc: "Guidelines for technical improvement proposals (FWD-TIP) and community voting procedures.", 
                icon: Globe, 
                color: "text-blue-600", 
                bg: "bg-blue-50/50",
                href: "/explorer/governance" 
              }
            ].map((res, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 group transition-all"
              >
                 <div className={`w-16 h-16 rounded-2xl ${res.bg} flex items-center justify-center ${res.color} mb-8 group-hover:scale-110 transition-transform`}>
                    <res.icon size={28} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-4">{res.title}</h3>
                 <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium italic">{res.desc}</p>
                 <Link href={res.href} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                    Access Resource <ArrowRight size={14} />
                 </Link>
              </motion.div>
            ))}
         </div>

         {/* Integration Section */}
         <section className="p-12 md:p-20 bg-slate-950 rounded-[4rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
               <Database size={400} className="translate-x-1/2 -translate-y-1/4" />
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Zap size={20} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Developer SDK v1.0.4</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">Start <br /><span className="text-blue-500">Integrating</span></h2>
                  <p className="text-slate-400 text-lg font-medium italic leading-relaxed">
                     Automate agricultural data anchors via our high-performance SDK. Designed for institutional-grade reliability and low-latency sealing.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                     <button className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 hover:scale-105 transition-all flex items-center gap-3">
                        <Download size={18} /> Download SDK
                     </button>
                     <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                        Technical Specs
                     </button>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="bg-black/40 backdrop-blur-3xl rounded-[2rem] border border-white/5 p-8 font-mono text-sm leading-relaxed overflow-hidden relative">
                     <div className="flex items-center gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                        <span className="text-[10px] text-slate-500 ml-2 font-sans font-bold uppercase tracking-widest">fwd-lifechain-terminal</span>
                     </div>
                     <p className="text-blue-400 mb-2">$ npm install @fwd-life/sdk</p>
                     <p className="text-slate-500 italic mb-4">// Initialize secure authority connection</p>
                     <p className="text-emerald-400">const chain = await FwdLife.connect({'{'}</p>
                     <p className="text-emerald-400 pl-4">network: 'Mainnet-PoA',</p>
                     <p className="text-emerald-400 pl-4">apiKey: process.env.FWD_KEY</p>
                     <p className="text-emerald-400">{'}'});</p>
                     <p className="text-slate-500 italic mt-4">// Anchor agricultural batch ID</p>
                     <p className="text-emerald-400">await chain.anchor('AGRI-BATCH-001');</p>
                     
                     <div className="absolute top-4 right-8 text-white/5 pointer-events-none">
                        <Code size={120} />
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </main>
      
      <Footer />
    </div>
  );
}
