'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Award, 
  MapPin, BookOpen, Microscope, Sparkles, BarChart3, Globe
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a2f1a] font-sans selection:bg-emerald-100">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 pt-40 pb-32">
        {/* Institutional Hero */}
        <header className="mb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
               <Award size={14} />
               <span>PhD Research Project · Le Phuc Hai</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-natural-950 tracking-tighter leading-[0.95] uppercase italic">
              Strategic <br />
              <span className="text-emerald-500">Framework</span>
            </h1>
            <div className="max-w-3xl space-y-6">
              <p className="text-xl md:text-3xl font-light text-slate-600 leading-tight border-l-8 border-emerald-500 pl-8 py-4">
                "fwd LIFEchain is an institutional ecosystem engineered to eliminate information asymmetry in global agricultural trade through the convergence of Blockchain architecture and AI-driven telemetry."
              </p>
            </div>
          </motion.div>
        </header>

        {/* Strategic Vision Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-40 items-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative"
           >
              <div className="aspect-video lg:aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white group">
                 <img 
                   src="/fwd_global_reach_supply_chain_1778393933803.png" 
                   alt="Agricultural Supply Chain" 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                 />
                 <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-all"></div>
              </div>
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="space-y-12"
           >
              <div className="space-y-6">
                 <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                    <Globe size={24} />
                 </div>
                 <h2 className="text-4xl font-black text-natural-950 tracking-tight uppercase italic">Global Reach</h2>
                 <p className="text-slate-600 leading-relaxed text-lg font-light">
                    The platform bridges local production expertise with international supply chain standards. By implementing a decentralized ledger, fwd LIFEchain ensures that premium Vietnamese agricultural products meet the rigorous transparency requirements of global markets.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <BarChart3 size={24} />
                 </div>
                 <h2 className="text-4xl font-black text-natural-950 tracking-tight uppercase italic">Methodological Rigor</h2>
                 <p className="text-slate-600 leading-relaxed text-lg font-light">
                    This initiative transcends standard logistics applications. It serves as the primary experimental artifact for PhD research into digital trust, integrating advanced statistical models to validate the impact of blockchain-verified signals on global consumer behavior.
                 </p>
              </div>
           </motion.div>
        </section>

        {/* Theoretical Framework - Scholarly Deep Dive */}
        <section className="mb-40 space-y-16">
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-natural-950 tracking-tighter uppercase italic">Institutional Architecture</h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">A visual representation of digital trust and supply chain flow</p>
           </div>
           
           <div className="bg-white rounded-[4rem] p-4 md:p-12 border border-slate-100 shadow-2xl relative overflow-hidden group">
              <div className="aspect-[21/9] rounded-[3rem] overflow-hidden border border-slate-100 relative">
                 <img 
                   src="/fwd_research_model_diagram_1778393563507.png" 
                   alt="FWD LIFEchain Research Model" 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
           </div>
        </section>

        <section className="bg-natural-900 rounded-[5rem] p-12 md:p-24 text-white mb-40 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none"><Microscope size={240} /></div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5 space-y-8">
                 <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">Academic <br /><span className="text-emerald-500">Foundation</span></h2>
                 <p className="text-slate-400 text-lg font-light leading-relaxed">
                    The architecture is built upon validated scholarly frameworks to ensure that every blockchain interaction translates into measurable digital trust.
                 </p>
                 <div className="pt-8 flex gap-8">
                    <div className="flex flex-col">
                       <span className="text-3xl font-black text-white">99%</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Data Integrity</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-3xl font-black text-white">Real-time</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Signal Velocity</span>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group">
                    <h3 className="text-xl font-black text-emerald-400 mb-6 uppercase tracking-tight flex items-center gap-2">
                       <span className="w-8 h-[1px] bg-emerald-500"></span> Signaling Theory
                    </h3>
                    <p className="text-sm text-slate-300 font-light leading-relaxed italic">
                       In a market of asymmetric information, blockchain acts as a high-fidelity 'Signal'. We leverage cryptography to certify quality and provenance, reducing perceived risk for institutional buyers.
                    </p>
                 </div>
                 <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group">
                    <h3 className="text-xl font-black text-emerald-400 mb-6 uppercase tracking-tight flex items-center gap-2">
                       <span className="w-8 h-[1px] bg-emerald-500"></span> S-O-R Model
                    </h3>
                    <p className="text-sm text-slate-300 font-light leading-relaxed italic">
                       Digital stimuli (Stimulus) processed through the blockchain influence the psychological state of the user (Organism), fostering the cognitive trust necessary for the adoption of green agricultural products (Response).
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* Strategic Pillars */}
        <section className="space-y-24">
           <div className="text-center space-y-6">
              <h2 className="text-5xl font-black text-natural-950 tracking-tighter uppercase italic">Strategic Pillars</h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Driving value across the agricultural value chain</p>
              <div className="w-32 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { title: "Transparency", desc: "Implementing absolute provenance from origin to end-consumer through immutable ledgers.", icon: ShieldCheck, color: "text-emerald-500" },
                { title: "Scalability", desc: "Designed for high-throughput institutional trade and multi-national supply chain integration.", icon: BarChart3, color: "text-blue-500" },
                { title: "Standardization", desc: "Aligning local production with global ISO and environmental social governance (ESG) metrics.", icon: Award, color: "text-purple-500" }
              ].map((v, i) => (
                <div key={i} className="group p-8 rounded-[3rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-slate-100">
                   <div className={`w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center ${v.color} mb-8 group-hover:scale-110 transition-transform`}>
                      <v.icon size={40} />
                   </div>
                   <h3 className="text-2xl font-black text-natural-950 uppercase italic tracking-tight mb-4">{v.title}</h3>
                   <p className="text-slate-500 text-base font-light leading-relaxed">{v.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Institutional Contact */}
        <footer className="mt-48 pt-20 border-t border-slate-100 text-center space-y-12">
           <div className="inline-flex items-center gap-4 px-6 py-3 bg-emerald-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-emerald-600/30">
              <Sparkles size={16} /> Research Integration Phase
           </div>
           <div className="max-w-2xl mx-auto">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-widest leading-loose">
                PhD Dissertation Focus: "Application of Blockchain Technology in the Vietnamese Agricultural Supply Chain" <br />
                Academic Liaison: PhD Candidate Le Phuc Hai · Research Artifact v2.1
              </p>
           </div>
        </footer>
      </main>
      
      <Footer />
    </div>
  );
}
