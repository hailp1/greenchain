'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Quote, ShieldCheck, Heart, Award, 
  MapPin, BookOpen, Microscope, Sparkles
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a2f1a]">
      <Header />
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <header className="mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <span>Developed by NCS Lê Phúc Hải</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-natural-950 tracking-tighter leading-[1.1] italic uppercase">
              The Philosophy <br />
              <span className="text-emerald-500">fwd LIFEchain</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-2xl font-light leading-relaxed max-w-3xl border-l-4 border-emerald-500 pl-6 py-2">
              "Our ambition is to transparently unlock the value of Vietnamese agricultural products by bridging blockchain technology with digital trust."
            </p>
          </motion.div>
        </header>

        {/* Founder Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="relative"
           >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                 <img 
                   src="https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?w=800&q=80" 
                   alt="Mekong Delta Inspiration" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="space-y-8"
           >
              <div className="space-y-4">
                 <h2 className="text-3xl font-black text-natural-950 tracking-tight uppercase italic flex items-center gap-3">
                    <MapPin className="text-emerald-500" /> Origins
                 </h2>
                 <p className="text-slate-600 leading-relaxed font-light italic">
                    Born in the fertile Mekong Delta, NCS Lê Phúc Hải deeply understands the challenges farmers face in realizing the true market value of their produce worldwide.
                 </p>
              </div>

              <div className="space-y-4">
                 <h2 className="text-3xl font-black text-natural-950 tracking-tight uppercase italic flex items-center gap-3">
                    <BookOpen className="text-emerald-500" /> Academic Mission
                 </h2>
                 <p className="text-slate-600 leading-relaxed font-light">
                    fwd LIFEchain is more than an application; it is a core component of a Ph.D. research project leveraging **Signaling Theory** and the **S-O-R model** to reshape consumer perception of clean, high-quality agricultural products.
                 </p>
              </div>
           </motion.div>
        </section>

        {/* Theoretical Framework */}
        <section className="bg-natural-900 rounded-[4rem] p-12 md:p-20 text-white mb-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Microscope size={120} /></div>
           <div className="relative z-10 space-y-12">
              <div className="max-w-2xl">
                 <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-6">Scientific <span className="text-emerald-500">Foundations</span></h2>
                 <p className="text-slate-400 font-light leading-relaxed">
                    The system is engineered to resolve information asymmetry between producers and consumers.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <h3 className="text-xl font-black text-emerald-400 mb-4 uppercase tracking-tight">Signaling Theory</h3>
                    <p className="text-sm text-slate-300 font-light leading-relaxed italic">
                       Blockchain acts as a powerful "Signal", enabling enterprises to transparently certify quality and provenance commitments that cannot be forged.
                    </p>
                 </div>
                 <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <h3 className="text-xl font-black text-emerald-400 mb-4 uppercase tracking-tight">S-O-R Model</h3>
                    <p className="text-sm text-slate-300 font-light leading-relaxed italic">
                       Stimuli from blockchain data influence the psychological state (Organism), fostering trust that drives the response (Choice) of selecting green, sustainable products.
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* Values */}
        <section className="text-center space-y-20">
           <div className="space-y-4">
              <h2 className="text-4xl font-black text-natural-950 tracking-tighter uppercase italic">Core Values</h2>
              <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "Transparency", desc: "Absolute transparency from farm to table.", icon: ShieldCheck },
                { title: "Humanity", desc: "Putting people and farmers' dedication at the core.", icon: Heart },
                { title: "Excellence", desc: "Pursuing the highest quality standards.", icon: Award }
              ].map((v, i) => (
                <div key={i} className="space-y-6">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-slate-900/5 flex items-center justify-center text-emerald-500 mx-auto border border-slate-50">
                      <v.icon size={32} />
                   </div>
                   <h3 className="text-xl font-black text-natural-950 uppercase italic tracking-tight">{v.title}</h3>
                   <p className="text-slate-500 text-sm font-light leading-relaxed">{v.desc}</p>
                </div>
              ))}
           </div>
        </section>

        <footer className="mt-40 text-center space-y-8">
           <div className="inline-flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-[0.3em]">
              <Sparkles size={16} /> fwd LIFEchain Research Project
           </div>
           <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              Đề tài nghiên cứu ứng dụng công nghệ Chuỗi khối trong ngành Nông sản Việt Nam
           </p>
        </footer>
      </main>
      <Footer />
    </div>
  );
}
