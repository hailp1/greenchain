'use client';

import React, { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ShieldCheck, Zap, ArrowRight, Share2, Facebook, Twitter, Linkedin, BookOpen, BarChart2, Globe, CheckCircle2, TrendingUp, Info } from 'lucide-react';
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
        <div className="space-y-10">
          <p className="text-xl font-medium text-slate-700 leading-relaxed border-l-4 border-emerald-500 pl-6 italic">
             Chiến dịch "SỐ HÓA NIỀM TIN" là nỗ lực lớn nhất từ trước đến nay của fwd LIFEchain nhằm xóa bỏ rào cản thông tin giữa người sản xuất và người tiêu dùng.
          </p>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">1. Bối cảnh: Nghịch lý của nông sản Việt</h2>
             <p className="text-slate-600 leading-relaxed font-light">
                Việt Nam sở hữu những vùng trồng nông sản chất lượng hàng đầu thế giới. Tuy nhiên, giá trị kinh tế thu về thường không tương xứng do thiếu sự minh bạch trong quy trình. Người tiêu dùng sẵn sàng trả giá cao hơn cho sự "an tâm", nhưng các hệ thống truy xuất nguồn gốc truyền thống dễ bị làm giả.
             </p>
          </section>

          <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
             <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-emerald-600" /> Lợi ích khi ứng dụng Blockchain
             </h3>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Minh bạch 100% quy trình từ hạt giống",
                  "Chống gian lận vùng trồng bằng GPS",
                  "Tăng giá trị sản phẩm lên 20-30%",
                  "Mở cửa thị trường xuất khẩu EU/Mỹ",
                  "Xây dựng thương hiệu cá nhân cho nông dân",
                  "Dữ liệu bất biến, không thể sửa xóa"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                     <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                     <span className="font-medium">{item}</span>
                  </li>
                ))}
             </ul>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">2. Giải pháp kỹ thuật: ST-PoO Protocol</h2>
             <p className="text-slate-600 leading-relaxed mb-8">
                Trái tim của chiến dịch là giao thức **Space-Time Proof of Origin (ST-PoO)**. Thay vì chỉ dán nhãn, chúng tôi sử dụng mạng lưới thiết bị IoT để tạo ra "Dấu vân tay số":
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-black mb-4">01</div>
                   <h4 className="font-black text-slate-900 uppercase text-sm mb-2">Geo-Fencing</h4>
                   <p className="text-xs text-slate-500 font-light leading-relaxed">Tự động xác thực vị trí canh tác dựa trên ranh giới thực địa.</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black mb-4">02</div>
                   <h4 className="font-black text-slate-900 uppercase text-sm mb-2">IoT Logging</h4>
                   <p className="text-xs text-slate-500 font-light leading-relaxed">Dữ liệu môi trường được ghi nhận trực tiếp lên chuỗi khối hàng giờ.</p>
                </div>
             </div>
          </section>

          <section className="p-10 bg-slate-900 rounded-[3rem] text-white">
             <h3 className="text-2xl font-black uppercase mb-6">Lộ trình triển khai</h3>
             <div className="space-y-8">
                <div className="flex gap-4">
                   <div className="w-px h-16 bg-emerald-500/30 relative">
                      <div className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                   </div>
                   <div>
                      <h5 className="font-black text-xs uppercase text-emerald-500">2026: Piloting</h5>
                      <p className="text-sm text-slate-400 font-light mt-1">Kết nối 50 HTX nông nghiệp tiêu biểu tại Lâm Đồng.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-px h-16 bg-slate-700 relative">
                      <div className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-slate-700"></div>
                   </div>
                   <div>
                      <h5 className="font-black text-xs uppercase text-slate-500">2028: Scaling</h5>
                      <p className="text-sm text-slate-400 font-light mt-1">Mở rộng ra toàn quốc với hệ sinh thái thanh toán AGRI.</p>
                   </div>
                </div>
             </div>
          </section>
        </div>
      )
    },
    'research-st-poo': {
      title: "Beyond Traceability: How Blockchain-Verified Origin Signals Influence Consumer Trust",
      category: "Academic Research",
      date: "08/05/2026",
      author: "Lê Phúc Hải (PhD Candidate)",
      image: "https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="space-y-12">
          <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6">
             <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen size={24} className="text-emerald-600" /> Abstract
             </h3>
             <p className="text-slate-600 leading-relaxed font-light italic text-lg">
                Nghiên cứu này khám phá cơ chế tâm lý của việc sử dụng các tín hiệu nguồn gốc được xác thực bằng blockchain như một tín hiệu độ tin cậy cao để giảm thiểu sự bất đối xứng thông tin trong thị trường nông sản.
             </p>
          </div>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">1. Theoretical Framework</h2>
             <p className="text-slate-600 leading-relaxed mb-8">
                Dựa trên **Signaling Theory**, một tín hiệu phải "tốn kém" (costly) mới có thể tin cậy. Giao thức ST-PoO là một "Tín hiệu vượt trội" vì quá trình xác thực phi tập trung của nó đòi hỏi chi phí kỹ thuật cao, khiến việc làm giả trở nên không khả thi.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                   <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4">Stimulus (S)</h4>
                   <p className="text-sm text-slate-600 font-light leading-relaxed">Tín hiệu Blockchain: Dữ liệu IoT thời gian thực, bằng chứng mã hóa bất biến.</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
                   <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">Organism (O)</h4>
                   <p className="text-sm text-slate-600 font-light leading-relaxed">Nhận thức của người tiêu dùng: Sự minh bạch, Chất lượng cảm nhận và Niềm tin thương hiệu.</p>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">2. Experimental Methodology</h2>
             <p className="text-slate-600 leading-relaxed mb-6">
                Nghiên cứu sử dụng thiết kế thực nghiệm **2x2 Between-Subjects** với sự tham gia của 450 người dùng:
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhóm A (Đối chứng)</span>
                   <p className="text-sm font-bold text-slate-900 mt-2 italic">Dùng QR Code truyền thống (Web tĩnh)</p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Nhóm B (Thực nghiệm)</span>
                   <p className="text-sm font-bold text-slate-900 mt-2 italic">Dùng fwd Explorer (Dữ liệu ST-PoO)</p>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">3. Structural Equation Modeling (SEM)</h2>
             <div className="p-10 bg-slate-900 rounded-[3rem] text-center space-y-6">
                <div className="text-2xl md:text-3xl font-mono text-emerald-400">
                   Trust = 0.54 · Transparency + 0.32 · Signal + ε
                </div>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">R² = 0.68 (Mô hình giải thích 68% biến thiên của Niềm tin)</p>
             </div>
          </section>

          <section className="pt-10 border-t border-slate-100">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Tài liệu tham khảo</h4>
             <ul className="text-[10px] text-slate-400 font-light space-y-2 leading-relaxed italic">
                <li>• Spence, M. (1973). Job Market Signaling. Quarterly Journal of Economics.</li>
                <li>• Le Phuc Hai (2026). The ST-PoO Protocol: Decentralized Trust in Agriculture.</li>
             </ul>
          </section>
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
      <main className="pt-32 pb-24 max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
           <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
           <span>/</span>
           <Link href="/news" className="hover:text-emerald-600 transition-colors">News</Link>
           <span>/</span>
           <span className="text-slate-900 uppercase">{article.category}</span>
        </div>

        <div className="space-y-8 mb-16">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                 {article.category}
              </span>
              <div className="h-px flex-grow bg-slate-100"></div>
           </div>
           
           <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight italic uppercase">
              {article.title}
           </h1>

           <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-slate-100">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-emerald-600/20">LH</div>
                 <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{article.author}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">fwd LIFEchain Research Lab</span>
                 </div>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.date}</span>
              </div>
           </div>
        </div>

        <div className="relative aspect-[21/9] rounded-[3.5rem] overflow-hidden mb-16 shadow-2xl bg-slate-100">
           <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
        </div>

        <article className="max-w-none">
           {article.content}
        </article>

        <div className="mt-24 flex items-center justify-between pt-12 border-t border-slate-100">
           <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:gap-4 transition-all">
              <ArrowRight className="rotate-180" /> Khám phá thêm Insights
           </Link>
           <div className="flex items-center gap-6 text-slate-300">
              <Share2 size={18} />
              <Facebook size={18} className="cursor-pointer hover:text-blue-600 transition-colors" />
              <Twitter size={18} className="cursor-pointer hover:text-blue-400 transition-colors" />
              <Linkedin size={18} className="cursor-pointer hover:text-blue-700 transition-colors" />
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
