'use client';

import React, { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ShieldCheck, Zap, ArrowRight, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
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

  // Content for the specific article
  if (id === 'chien-dich-01' || id === 'so-hoa-niem-tin-nong-san-viet') {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <Header />
        <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
              <Link href="/" className="hover:text-emerald-600">Home</Link>
              <span>/</span>
              <Link href="/news" className="hover:text-emerald-600">News</Link>
              <span>/</span>
              <span className="text-slate-900">Chiến dịch nông dân</span>
           </div>

           <div className="space-y-8 mb-12">
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Public Campaign
                 </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                 Số hóa niềm tin: Miễn phí 100% giải pháp Blockchain cho nông dân Việt Nam
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">LH</div>
                    <div className="flex flex-col">
                       <span className="text-xs font-black text-slate-900">NCS Lê Phúc Hải</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Founder of fwd LIFEchain</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> 10 Tháng 5, 2026</span>
                 </div>
              </div>
           </div>

           <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden mb-16 shadow-2xl bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" 
                alt="Blockchain Agriculture" 
                className="w-full h-full object-cover"
              />
           </div>

           <article className="prose prose-slate prose-lg max-w-none">
              <p className="text-xl font-medium text-slate-700 mb-8 border-l-4 border-emerald-500 italic">
                 Hành trình mang công nghệ Blockchain về với những cánh đồng Việt Nam.
              </p>
              <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-6">1. Minh bạch là sức mạnh</h2>
              <p>
                 Chúng tôi tin rằng tương lai của nông sản Việt nằm ở sự minh bạch. Với fwd LIFEchain, mỗi nông dân đều có thể chứng minh giá trị sản phẩm của mình.
              </p>
              <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-6">2. Giải pháp ST-PoO</h2>
              <p>
                 Công nghệ ST-PoO giúp xác thực nguồn gốc không gian - thời gian, đảm bảo sản phẩm thực sự đến từ vùng trồng đã đăng ký.
              </p>
           </article>

           <div className="mt-12 flex items-center justify-between">
              <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:gap-4 transition-all">
                 <ArrowRight className="rotate-180" /> Quay lại News
              </Link>
           </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Default 404 state within the dynamic page
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
