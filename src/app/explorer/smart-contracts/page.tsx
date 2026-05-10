'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Code2, Lock, GitBranch, ExternalLink, Cpu, Database, Eye } from 'lucide-react';

export default function SmartContractsPage() {
  const contracts = [
    {
      name: "AGRI Asset Token",
      address: "0xbE85Cf9DDB93d9ea677e95599779B400437899E8",
      version: "v2.1.4 (Audited)",
      description: "The core utility and governance token of the fwd LIFEchain ecosystem. Implements ERC-20 with specialized burn and reputation-staking logic.",
      features: ["Reputation Burning", "Validator Staking", "Governance Voting"]
    },
    {
      name: "Supply Chain Provenance",
      address: "0x7a916D6493B8eB5C98f6A7B13F390518B928423a",
      version: "v1.0.2",
      description: "Handles the immutable anchoring of agricultural data. Connects batch IDs to IoT-verified metadata for end-to-end traceability.",
      features: ["Batch Identity", "Metadata Anchoring", "IoT Integration"]
    },
    {
      name: "Reputation Engine",
      address: "0x5c8e223d6a2e4c8e5e8e2e2e2e2e2e2e2e2e2e2e",
      version: "v0.9.5 (Beta)",
      description: "Calculates trust scores for producers based on historical fulfillment, consumer reviews, and third-party audit results.",
      features: ["S-O-R Logic", "Trust Scoring", "Audit Anchors"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-24 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                 Decentralized Logic
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
                 Core <span className="text-blue-600">Smart Contracts</span>
              </h1>
              <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
                 The fwd LIFEchain protocol is powered by a suite of immutable, audited smart contracts that enforce 
                 transparency and integrity across the entire agricultural value chain.
              </p>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Mode</p>
                 <p className="text-sm font-black text-emerald-600">PRODUCTION</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
                 <ShieldCheck size={24} />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
           {contracts.map((contract, i) => (
              <div key={i} className="group relative">
                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[2.5rem] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                 <div className="relative bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                       {/* Left side: Info */}
                       <div className="lg:col-span-7 space-y-8">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-slate-900">{contract.name}</h2>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded border border-slate-200">{contract.version}</span>
                             </div>
                             <p className="text-slate-600 leading-relaxed font-light text-lg italic">
                                "{contract.description}"
                             </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {contract.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                   <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600">
                                      <Code2 size={12} />
                                   </div>
                                   <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{feature}</span>
                                </div>
                             ))}
                          </div>

                          <div className="pt-6 flex flex-wrap gap-4">
                             <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all">
                                <Code2 size={14} />
                                View Source
                             </button>
                             <button className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                Audit Report
                             </button>
                          </div>
                       </div>

                       {/* Right side: Technical Metadata */}
                       <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment Address</h4>
                             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group/addr">
                                <code className="text-xs font-mono text-blue-600 break-all">{contract.address}</code>
                                <ExternalLink size={14} className="text-slate-300 group-hover/addr:text-blue-500 transition-colors shrink-0 ml-4" />
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                                <Lock size={16} className="text-slate-400" />
                                <p className="text-[9px] font-black text-slate-400 uppercase">State</p>
                                <p className="text-xs font-bold text-emerald-600 uppercase">Immutable</p>
                             </div>
                             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                                <GitBranch size={16} className="text-slate-400" />
                                <p className="text-[9px] font-black text-slate-400 uppercase">Compiler</p>
                                <p className="text-xs font-bold text-slate-900 uppercase">Solc 0.8.19</p>
                             </div>
                          </div>

                          <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Flow</span>
                                <span className="text-[9px] font-bold text-slate-400">Security Layer 4</span>
                             </div>
                             <div className="flex gap-2">
                                {[1,2,3,4,5].map(i => (
                                   <div key={i} className={`h-1.5 flex-grow rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                                ))}
                             </div>
                             <p className="text-[10px] text-slate-500 italic">
                                Multi-sig controlled (3-of-5) for critical upgrades and state changes.
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        <section className="mt-32 p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden">
           <div className="relative z-10 space-y-8 max-w-3xl">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                 <Lock size={32} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight leading-tight">
                 Zero-Knowledge <br /> Proof Integration
              </h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                 We are currently auditing our <strong>v3.0 protocol</strong> which integrates ZK-Snarks. 
                 This will allow producers to prove compliance with organic standards without revealing proprietary farm coordinates or yield data.
              </p>
              <div className="flex gap-4">
                 <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                    Read Whitepaper
                 </button>
              </div>
           </div>
           {/* Abstract background */}
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent"></div>
           <div className="absolute bottom-0 right-0 p-12 opacity-10">
              <Cpu size={240} className="text-blue-500" />
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
