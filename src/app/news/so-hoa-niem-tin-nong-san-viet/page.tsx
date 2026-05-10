'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ShieldCheck, Zap, ArrowRight, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

import { supabase } from '@/lib/supabase';

export default function NewsDetailPage() {
  // Auth Isolation: Ensure this page never redirects to portal
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
       // Just listen, do not redirect
       console.log("[News] Auth event ignored to stay on public page:", event);
    });
    return () => subscription.unsubscribe();
  }, []);
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        {/* Breadcrumb - SEO & UX */}
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
                 Public Campaign - No Login Required
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
              <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-slate-400">
                 <span className="flex items-center gap-1.5"><Calendar size={14} /> 10 Tháng 5, 2026</span>
              </div>
           </div>
        </div>

        <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden mb-16 shadow-2xl bg-slate-100">
           <img 
             src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" 
             alt="Blockchain Agriculture Vietnam" 
             className="w-full h-full object-cover"
           />
        </div>

        <article className="prose prose-slate prose-lg max-w-none">
           <div className="text-xl font-medium leading-relaxed text-slate-700 mb-10 pl-6 border-l-4 border-emerald-500 italic">
              Chiến dịch "SỐ HÓA NIỀM TIN" nhằm mục tiêu hỗ trợ nông dân Việt Nam tiếp cận công nghệ Blockchain để minh bạch hóa nguồn gốc nông sản, nâng tầm giá trị trên thị trường quốc tế.
           </div>

           <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-6 tracking-tight">1. Tại sao lại là Blockchain cho Nông dân?</h2>
           <p>
              Vấn đề lớn nhất của nông sản Việt không phải là chất lượng, mà là <strong>Niềm tin</strong>. Blockchain giúp tạo ra một cuốn sổ cái bất biến, ghi lại mọi quy trình từ hạt giống đến bàn ăn.
           </p>

           <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-6 tracking-tight">2. Chương trình hỗ trợ 100%</h2>
           <p>
              Chúng tôi cam kết miễn phí toàn bộ chi phí cài đặt, vận hành và đào tạo cho các HTX nông nghiệp. Hệ thống bao gồm:
           </p>
           <ul className="space-y-2">
              <li>Mã QR định danh duy nhất cho từng lô hàng.</li>
              <li>Xác thực vị trí vùng trồng bằng GPS thời gian thực.</li>
              <li>Hỗ trợ xuất khẩu với dữ liệu minh bạch chuẩn EU/Mỹ.</li>
           </ul>

           <div className="my-16 p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
              <Zap size={100} className="absolute -top-10 -right-10 text-emerald-500 opacity-20" />
              <h3 className="text-2xl font-black uppercase mb-4 relative z-10">Liên hệ ngay</h3>
              <p className="text-slate-400 mb-8 relative z-10 leading-relaxed">
                 Đội ngũ fwd LIFEchain sẵn sàng khảo sát và hỗ trợ trực tiếp tại vườn nhà bạn.
              </p>
              <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 relative z-10">
                 Đăng ký tư vấn miễn phí
              </button>
           </div>

           <h2 className="text-2xl font-black text-slate-900 uppercase mt-12 mb-6 tracking-tight">3. Tầm nhìn 2030</h2>
           <p>
              Chúng tôi muốn xây dựng một mạng lưới nông sản Việt minh bạch, nơi mà "Sự thật" là giá trị cạnh tranh cốt lõi.
           </p>
        </article>

        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
           {['Blockchain', 'Agriculture', 'fwdLIFEchain', 'Minh Bach'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                 #{tag}
              </span>
           ))}
        </div>

        <div className="mt-12 flex items-center justify-between">
           <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:gap-4 transition-all">
              <ArrowRight className="rotate-180" /> Xem các bài viết khác
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
