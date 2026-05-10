'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Terminal, Code2, Copy, Play, Database, Globe, Lock, ShieldCheck, Zap } from 'lucide-react';

export default function APIDocsPage() {
  const endpoints = [
    {
      method: "GET",
      path: "/v1/explorer/latest-blocks",
      desc: "Retrieve the sequence of the most recently validated blocks in the LIFEchain network.",
      params: ["limit: number", "offset: number"],
      response: `{ "success": true, "blocks": [...] }`
    },
    {
      method: "POST",
      path: "/v1/supply-chain/anchor",
      desc: "Anchor a cryptographic hash of agricultural product metadata directly onto the blockchain.",
      params: ["hash: string", "metadata: object", "signature: string"],
      response: `{ "txHash": "0x...", "confirmed": true }`
    },
    {
      method: "GET",
      path: "/v1/reputation/score/:address",
      desc: "Calculate the real-time reputation score of a specific producer based on on-chain data points.",
      params: ["address: string"],
      response: `{ "score": 98.4, "rank": "Emerald" }`
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <Header />
      
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Content */}
        <div className="lg:col-span-7 space-y-16">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                 Developer Gateway
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                 Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Future</span> of Ag-Tech
              </h1>
              <p className="text-lg text-slate-400 font-light leading-relaxed max-w-2xl">
                 Integrate fwd LIFEchain's cryptographic truth into your own applications. Our robust API suite allows you to verify provenance, 
                 query reputation, and anchor data with institutional-grade reliability.
              </p>
           </div>

           <div className="space-y-12">
              <div className="flex items-center gap-4 text-white">
                 <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                    <Database size={20} />
                 </div>
                 <h2 className="text-2xl font-black uppercase tracking-tight">Core Endpoints</h2>
              </div>

              <div className="space-y-8">
                 {endpoints.map((endpoint, i) => (
                    <div key={i} className="group p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <span className={`px-2 py-1 rounded text-[10px] font-black ${endpoint.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                {endpoint.method}
                             </span>
                             <code className="text-sm font-mono text-white font-bold">{endpoint.path}</code>
                          </div>
                          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                             <Copy size={14} />
                          </button>
                       </div>
                       <p className="text-sm text-slate-400 leading-relaxed italic">
                          "{endpoint.desc}"
                       </p>
                       <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Parameters</p>
                          <div className="flex flex-wrap gap-2">
                             {endpoint.params.map((p, idx) => (
                                <span key={idx} className="px-2 py-1 bg-slate-950 rounded-md text-[10px] font-mono text-slate-400 border border-slate-800">{p}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Code Samples & Sandbox */}
        <div className="lg:col-span-5 relative">
           <div className="sticky top-32 space-y-8">
              {/* SDK Card */}
              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-black border border-slate-800 shadow-2xl space-y-8 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Terminal size={120} className="text-blue-500" />
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                       <Play size={16} fill="white" />
                    </div>
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Live Sandbox</span>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-500 uppercase">JavaScript SDK</span>
                       <span className="text-[9px] text-emerald-400 font-bold">Stable v2.0.1</span>
                    </div>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs leading-relaxed overflow-x-auto">
                       <p className="text-slate-500">{'// Initialize SDK'}</p>
                       <p className="text-emerald-400"><span className="text-blue-400">const</span> chain = <span className="text-purple-400">new</span> LIFEchain(<span className="text-yellow-400">'API_KEY_001'</span>);</p>
                       <br />
                       <p className="text-slate-500">{'// Anchor harvest data'}</p>
                       <p className="text-white">await chain.anchor({'{'}</p>
                       <p className="text-white pl-4">productId: <span className="text-yellow-400">'VN-DALT-001'</span>,</p>
                       <p className="text-white pl-4">qualityHash: <span className="text-yellow-400">'0x7f2a...'</span></p>
                       <p className="text-white">{'}'});</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                          <Globe size={16} className="text-blue-400" />
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latency</p>
                          <p className="text-xs font-bold text-white uppercase">42ms</p>
                       </div>
                       <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                          <ShieldCheck size={16} className="text-emerald-400" />
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security</p>
                          <p className="text-xs font-bold text-white uppercase">AES-256</p>
                       </div>
                    </div>
                    <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/5 hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                       Generate API Key
                       <Zap size={14} fill="currentColor" />
                    </button>
                 </div>
              </div>

              {/* Status Section */}
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">API Status: Operational</span>
                 </div>
                 <span className="text-[9px] font-bold text-slate-500 uppercase underline cursor-pointer">View Incident History</span>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
