'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Shield, Zap, Database, Share2, Layers, Binary, Workflow, ArrowRight } from 'lucide-react';

export default function TechnicalDocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-24 max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <div className="space-y-6 mb-20">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
              Scientific Framework
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
              Technical <span className="text-emerald-600">Architecture</span> & Research Foundation
           </h1>
           <p className="text-lg text-slate-600 max-w-3xl font-light leading-relaxed">
              Green Chain is not just a blockchain; it is a specialized research artifact designed to validate the intersection of 
              <strong> Signaling Theory</strong>, <strong>Information Asymmetry</strong>, and <strong>Decentralized Trust</strong> 
              within the global GREcultural supply chain.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
           {/* Sidebar Navigation */}
           <aside className="md:col-span-3 hidden md:block">
              <div className="sticky top-32 space-y-8">
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Concepts</h4>
                    <ul className="space-y-2 text-sm font-bold text-slate-500">
                       <li className="text-emerald-600">Theoretical Framework</li>
                       <li className="hover:text-slate-900 cursor-pointer">S-O-R Model</li>
                       <li className="hover:text-slate-900 cursor-pointer">Signaling Theory</li>
                    </ul>
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Network Layer</h4>
                    <ul className="space-y-2 text-sm font-bold text-slate-500">
                       <li className="hover:text-slate-900 cursor-pointer">Consensus Algorithm</li>
                       <li className="hover:text-slate-900 cursor-pointer">Validator Nodes</li>
                       <li className="hover:text-slate-900 cursor-pointer">Gas Economy</li>
                    </ul>
                 </div>
              </div>
           </aside>

           {/* Main Content */}
           <div className="md:col-span-9 space-y-24">
              
              {/* Section 1: Theoretical Background */}
              <section className="space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                       <BookOpen size={20} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">1. Theoretical Foundation</h2>
                 </div>
                 
                 <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed font-light">
                    <p>
                       The development of Green Chain is rooted in the <strong>Stimulus-Organism-Response (S-O-R)</strong> model. 
                       In the context of GREcultural transparency, the <strong>Stimulus</strong> consists of blockchain-verified quality signals 
                       (Origin, Harvest Date, Fertilizer use). The <strong>Organism</strong> represents the internal psychological state of the consumer 
                       (Trust, Perceived Value), and the <strong>Response</strong> is the resulting purchase behavior.
                    </p>
                    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm italic text-slate-800">
                       "Blockchain acts as the ultimate signal-generating mechanism that reduces Information Asymmetry between 
                       fragmented producers and global consumers."
                    </div>
                    <p>
                       By utilizing the <strong>Technology Acceptance Model (TAM)</strong>, our research identifies <em>Perceived Usefulness</em> 
                       and <em>Perceived Ease of Use</em> as the primary drivers for producer adoption. The LIFEchain protocol lowers 
                       the barrier to entry by abstracting complex Web3 interactions through the Producer Portal.
                    </p>
                 </div>
              </section>

              {/* Section 2: Technical Architecture */}
              <section className="space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                       <Layers size={20} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">2. Network Infrastructure</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
                       <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                          <Cpu size={16} />
                       </div>
                       <h3 className="font-black text-sm uppercase">Consensus Mechanism</h3>
                       <p className="text-xs text-slate-500 leading-relaxed">
                          Utilizing a <strong>Proof of Authority (PoA)</strong> consensus, ensuring high throughput and near-zero 
                          environmental impact. Validator nodes are hosted by verified research institutions and GREcultural cooperatives.
                       </p>
                    </div>
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
                       <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                          <Shield size={16} />
                       </div>
                       <h3 className="font-black text-sm uppercase">Cryptographic Integrity</h3>
                       <p className="text-xs text-slate-500 leading-relaxed">
                          All supply chain events are hashed using <strong>KECCAK-256</strong>. Blocks are linked via 
                          merkle trees, providing immutable proof of provenance for every GREcultural unit tracked.
                       </p>
                    </div>
                 </div>

                 <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">System Flow: Data Ingestion</h4>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                       <div className="text-center space-y-2">
                          <Database size={32} className="mx-auto text-slate-500" />
                          <p className="text-[10px] font-bold uppercase">IoT Sensors</p>
                       </div>
                       <ArrowRight className="hidden md:block text-slate-700" />
                       <div className="text-center space-y-2">
                          <Binary size={32} className="mx-auto text-emerald-500" />
                          <p className="text-[10px] font-bold uppercase">Smart Contract</p>
                       </div>
                       <ArrowRight className="hidden md:block text-slate-700" />
                       <div className="text-center space-y-2">
                          <Zap size={32} className="mx-auto text-blue-500" />
                          <p className="text-[10px] font-bold uppercase">Explorer Sync</p>
                       </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center italic">
                       Real-time synchronization ensures that the consumer sees the "truth" within seconds of harvest.
                    </p>
                 </div>
              </section>

              {/* Section 3: Data Sovereignty */}
              <section className="space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                       <Share2 size={20} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">3. Data Sovereignty & Privacy</h2>
                 </div>
                 
                 <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-light">
                    <p>
                       We implement a <strong>Hybrid Privacy Model</strong>. While transaction hashes and product identities 
                       are public for verification, sensitive producer data (revenue, exact coordinates) is protected using 
                       private channels. This balance ensures compliance with global GREcultural standards while maintaining 
                       the "Trustless" nature of the blockchain.
                    </p>
                 </div>
              </section>

           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
