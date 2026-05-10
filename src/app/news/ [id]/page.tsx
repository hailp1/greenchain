'use client';

import React, { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ShieldCheck, Zap, ArrowRight, Share2, Facebook, Twitter, Linkedin, BookOpen, BarChart2, Globe } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function DynamicNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Auth Isolation
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
       console.log("[NewsDynamic] Auth event ignored:", event);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ─── Article Registry ───────────────────────────────────────
  const articles: Record<string, any> = {
    'chien-dich-01': {
      title: "Số hóa niềm tin: Miễn phí 100% giải pháp Blockchain cho nông dân Việt Nam",
      category: "Campaign",
      date: "10/05/2026",
      author: "NCS Lê Phúc Hải",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200",
      content: (
        <>
          <p className="text-xl font-medium text-slate-700 mb-8 border-l-4 border-emerald-500 pl-6 italic">
             Chiến dịch "SỐ HÓA NIỀM TIN" nhằm mục tiêu hỗ trợ nông dân Việt Nam tiếp cận công nghệ Blockchain để minh bạch hóa nguồn gốc nông sản.
          </p>
          <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-6">1. Tại sao lại là Blockchain cho Nông dân?</h2>
          <p>
             Vấn đề lớn nhất của nông sản Việt không phải là chất lượng, mà là <strong>Niềm tin</strong>. Blockchain giúp tạo ra một cuốn sổ cái bất biến, ghi lại mọi quy trình từ hạt giống đến bàn ăn.
          </p>
          <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-6">2. Giải pháp ST-PoO</h2>
          <p>
             Công nghệ ST-PoO giúp xác thực nguồn gốc không gian - thời gian, đảm bảo sản phẩm thực sự đến từ vùng trồng đã đăng ký.
          </p>
        </>
      )
    },
    'research-st-poo': {
      title: "Beyond Traceability: How Blockchain-Verified Origin Signals Influence Consumer Trust",
      category: "Academic Research",
      date: "08/05/2026",
      author: "Lê Phúc Hải (PhD Candidate)",
      image: "https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="space-y-8">
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
             <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-600" /> Research Abstract
             </h3>
             <p className="text-slate-600 leading-relaxed font-light italic">
                In this research, we position the **ST-PoO Protocol** as the primary Stimulus to measure consumer trust and purchase intention using the S-O-R (Stimulus-Organism-Response) model.
             </p>
          </div>

          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">1. Conceptual Model (S-O-R Focus)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Stimulus (S)</span>
                <p className="text-sm font-bold text-slate-900 mt-2">Blockchain-Verified Origin signals (IoT, Geo-fencing)</p>
             </div>
             <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Organism (O)</span>
                <p className="text-sm font-bold text-slate-900 mt-2">Perceived Transparency, Quality, and Brand Trust</p>
             </div>
             <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Response (R)</span>
                <p className="text-sm font-bold text-slate-900 mt-2">Purchase Intention & Willingness to Pay a Premium</p>
             </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-12">2. Mathematical Modeling</h2>
          <p className="text-slate-600">
             In marketing journals, we use Structural Equation Modeling (SEM) to define the path coefficients:
          </p>
          <div className="p-8 bg-slate-900 rounded-3xl text-center">
             <code className="text-emerald-400 font-mono text-lg">
                Trust = β₁ · Transparency + β₂ · Blockchain_Signal + ε
             </code>
          </div>

          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-12">3. Managerial Implications</h2>
          <p className="text-slate-600">
             The paper provides a technical solution to "Green-washing", advising managers on how to use blockchain as a "Trust-building tool" rather than just a logistics tool.
          </p>
        </div>
      )
    }
  };

  const article = articles[id];

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
         <Header />
         <h1 className="text-6xl font-black text-slate-900 mb-4">404</h1>
         <p className="text-slate-500 mb-8 uppercase tracking-widest font-bold">Article not found</p>
         <Link href="/news" className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Back to Insights</Link>
         <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
           <Link href="/" className="hover:text-emerald-600">Home</Link>
           <span>/</span>
           <Link href="/news" className="hover:text-emerald-600">News</Link>
           <span>/</span>
           <span className="text-slate-900">{article.category}</span>
        </div>

        <div className="space-y-8 mb-12">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                 {article.category}
              </span>
           </div>
           
           <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              {article.title}
           </h1>

           <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">LH</div>
                 <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900">{article.author}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">fwd LIFEchain Author</span>
                 </div>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
              </div>
           </div>
        </div>

        <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden mb-16 shadow-2xl bg-slate-100">
           <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <article className="prose prose-slate prose-lg max-w-none">
           {article.content}
        </article>

        <div className="mt-12 flex items-center justify-between pt-12 border-t border-slate-100">
           <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:gap-4 transition-all">
              <ArrowRight className="rotate-180" /> Quay lại News
           </Link>
           <div className="flex items-center gap-4 text-slate-300">
              <Share2 size={16} />
              <Facebook size={16} className="cursor-pointer hover:text-blue-600" />
              <Twitter size={16} className="cursor-pointer hover:text-blue-400" />
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
