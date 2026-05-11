'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Landmark, Users, Vote, PieChart, ShieldCheck, Scale, Gavel, Globe } from 'lucide-react';

export default function GovernancePage() {
  const proposals = [
    {
      id: "GC-GP-001",
      title: "Transition to Research Validator Consensus",
      status: "ACTIVE",
      votes: "4.2M GRE",
      ends: "2d 14h",
      desc: "Proposal to transition the consensus mechanism from static validator sets to a dynamic set based on academic research contributions and reputation scores."
    },
    {
      id: "GC-GP-002",
      title: "Update GRE Token Burn Mechanism",
      status: "PASSED",
      votes: "12.8M GRE",
      ends: "Ended 4 days ago",
      desc: "Implement a dynamic burn rate for transactions initiated by large-scale agricultural exporters to maintain token scarcity and utility."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-24 max-w-6xl mx-auto px-6">
        {/* Governance Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
           <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                 Decentralized Authority
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                 Shaping the <span className="text-purple-600">Protocol</span> Together
              </h1>
              <p className="text-lg text-slate-600 font-light leading-relaxed">
                 Green Chain is governed by its community of producers, researchers, and validators. Our decentralized 
                 governance framework ensures that the protocol evolves to meet the actual needs of the global agricultural market.
              </p>
              <div className="flex gap-4">
                 <button className="px-8 py-4 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20">
                    Submit Proposal
                 </button>
                 <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                    Governance Dashboard
                 </button>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                 <Users size={32} className="text-blue-500" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Voters</p>
                 <p className="text-3xl font-black text-slate-900">2,842</p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                 <Vote size={32} className="text-emerald-500" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Staked</p>
                 <p className="text-3xl font-black text-slate-900">42.5M</p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                 <Landmark size={32} className="text-purple-500" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proposals</p>
                 <p className="text-3xl font-black text-slate-900">124</p>
              </div>
              <div className="p-8 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl">
                 <ShieldCheck size={32} className="text-blue-400" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Health</p>
                 <p className="text-3xl font-black text-emerald-400">99.9%</p>
              </div>
           </div>
        </div>

        {/* Governance Process */}
        <section className="mb-32">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tight">The <span className="text-purple-600">Decision</span> Process</h2>
              <p className="text-slate-500 max-w-2xl mx-auto italic">"From research hypothesis to network implementation."</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                 { title: "Discussion", icon: Scale, color: "blue", desc: "Ideas are first presented on our research forum for community peer-review." },
                 { title: "Snapshot", icon: PieChart, color: "emerald", desc: "A soft-vote is taken to gauge community sentiment using off-chain signatures." },
                 { title: "On-Chain Vote", icon: Gavel, color: "purple", desc: "Binding final votes are cast on-chain, requiring a 66% super-majority to pass." }
              ].map((step, i) => (
                 <div key={i} className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all space-y-6 group">
                    <div className={`w-14 h-14 bg-${step.color}-50 text-${step.color}-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                       <step.icon size={28} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">{step.desc}</p>
                 </div>
              ))}
           </div>
        </section>

        {/* Active Proposals */}
        <section className="space-y-12">
           <div className="flex justify-between items-end">
              <div className="space-y-2">
                 <h2 className="text-2xl font-black uppercase tracking-tight">Active Proposals</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Governance Dashboard v1.2</p>
              </div>
              <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
           </div>

           <div className="space-y-6">
              {proposals.map((prop, i) => (
                 <div key={i} className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-purple-300 transition-all group">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                       <div className="space-y-4 md:w-2/3">
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{prop.id}</span>
                             <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${prop.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {prop.status}
                             </span>
                          </div>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors">{prop.title}</h3>
                          <p className="text-sm text-slate-500 leading-relaxed font-light">{prop.desc}</p>
                       </div>
                       
                       <div className="md:w-1/3 bg-slate-50 rounded-2xl p-6 flex flex-col justify-between border border-slate-100">
                          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                             <span>Voting Power</span>
                             <span>Time Left</span>
                          </div>
                          <div className="flex justify-between items-end">
                             <div>
                                <p className="text-xl font-black text-slate-900">{prop.votes}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase">Supportive</p>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black text-slate-900">{prop.ends}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Protocol Clock</p>
                             </div>
                          </div>
                          <div className="mt-6">
                             <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[78%]"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        <section className="mt-32 p-16 bg-white border border-slate-200 rounded-[3rem] shadow-2xl relative overflow-hidden text-center space-y-8">
           <Globe size={80} className="mx-auto text-blue-100 absolute -top-10 -left-10 opacity-50" />
           <div className="max-w-3xl mx-auto space-y-6 relative z-10">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Global Research DAO</h2>
              <p className="text-lg text-slate-600 font-light leading-relaxed">
                 We are expanding our validator set to include international agricultural research centers. 
                 If your institution is interested in securing the global food supply chain, join our research network.
              </p>
              <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                 Apply for Validator Node
              </button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
