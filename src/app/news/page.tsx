'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Share2, ShieldCheck, Zap, BookOpen, Layers, Globe } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function NewsIndexPage() {
  // Auth Isolation
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
       console.log("[NewsIndex] Auth event ignored:", event);
    });
    return () => subscription.unsubscribe();
  }, []);

  const news = [
    {
      id: "chien-dich-01",
      title: "Số hóa niềm tin: Miễn phí 100% giải pháp Blockchain cho nông dân Việt Nam",
      excerpt: "Chiến dịch 'Nâng tầm nông sản Việt' chính thức khởi động, mang công nghệ ST-PoO đến với các HTX và hộ nông dân tiên phong trên khắp 63 tỉnh thành...",
      date: "10/05/2026",
      author: "Lê Phúc Hải",
      category: "Campaign",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200",
      icon: Zap,
      color: "text-emerald-500",
      readingTime: "12 min read"
    },
    {
      id: "research-st-poo",
      title: "Beyond Traceability: How Blockchain-Verified Origin Signals Influence Consumer Trust",
      excerpt: "Một công trình nghiên cứu sâu về mô hình S-O-R và Lý thuyết Tín hiệu (Signaling Theory) áp dụng trong việc minh bạch hóa nguồn gốc nông sản bằng Blockchain...",
      date: "08/05/2026",
      author: "Lê Phúc Hải",
      category: "Academic",
      image: "https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=80&w=1200",
      icon: BookOpen,
      color: "text-blue-500",
      readingTime: "15 min read"
    },
    {
      id: "blockchain-vs-traditional",
      title: "Blockchain vs Truy xuất truyền thống: Sự khác biệt nằm ở đâu?",
      excerpt: "Phân tích kỹ thuật chuyên sâu về kiến trúc dữ liệu phi tập trung, tính bất biến và khả năng chống gian lận của Green Chain so với các giải pháp tập trung cũ...",
      date: "24/04/2026",
      author: "Team fwd LIFE",
      category: "Technical",
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1200",
      icon: Layers,
      color: "text-amber-500",
      readingTime: "10 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                 <Globe size={14} className="text-emerald-500" /> Research & Insights
              </div>
              <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.9]">
                 fwd <span className="text-emerald-500">Insights</span>
              </h1>
           </div>
           <p className="text-slate-400 max-w-md text-sm font-light leading-relaxed border-l border-slate-200 pl-8">
              Nơi hội tụ những báo cáo chiến lược, nghiên cứu học thuật và cập nhật công nghệ mới nhất về hệ sinh thái Green Chain.
           </p>
        </div>

        {/* Featured Post */}
        <div className="mb-32">
           <Link href={`/news/${news[0].id}`} className="group relative block overflow-hidden rounded-[4rem] bg-white shadow-2xl border border-slate-100">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                 <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                    <img src={news[0].image} alt="Featured" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent"></div>
                    <div className="absolute top-10 left-10 p-4 bg-white/90 backdrop-blur rounded-full flex items-center gap-3 shadow-xl">
                       <Zap className="text-emerald-500" size={18} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Featured Campaign</span>
                    </div>
                 </div>
                 <div className="p-12 md:p-20 flex flex-col justify-center space-y-8">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">{news[0].category}</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{news[0].readingTime}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight group-hover:text-emerald-600 transition-colors italic uppercase">
                       {news[0].title}
                    </h2>
                    <p className="text-slate-500 font-light text-xl leading-relaxed">
                       {news[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg">LH</div>
                          <div className="flex flex-col">
                             <span className="text-sm font-black uppercase text-slate-900 tracking-tight">{news[0].author}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Strategist</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 text-emerald-600">
                          <span className="text-xs font-black uppercase tracking-widest">Read Article</span>
                          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                       </div>
                    </div>
                 </div>
              </div>
           </Link>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
           {news.slice(1).map((item, i) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1, duration: 0.6 }}
               viewport={{ once: true }}
             >
                <Link href={`/news/${item.id}`} className="group space-y-8 block">
                   <div className="relative aspect-[16/10] overflow-hidden rounded-[3.5rem] shadow-xl bg-white border border-slate-100">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute top-8 left-8 px-5 py-2.5 bg-white/95 backdrop-blur shadow-sm rounded-full flex items-center gap-3">
                         {React.createElement(item.icon, { className: item.color, size: 16 })}
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">{item.category}</span>
                      </div>
                   </div>
                   <div className="space-y-4 px-4">
                      <div className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                         <span>{item.date}</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                         <span>{item.readingTime}</span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 leading-[1.1] group-hover:text-emerald-600 transition-colors uppercase italic tracking-tighter">
                         {item.title}
                      </h3>
                      <p className="text-slate-400 text-base font-light leading-relaxed line-clamp-3">
                         {item.excerpt}
                      </p>
                      <div className="pt-6 flex items-center gap-3 text-xs font-black text-slate-900 uppercase tracking-widest group-hover:gap-5 transition-all">
                         Tiếp tục đọc <ArrowRight size={16} className="text-emerald-500" />
                      </div>
                   </div>
                </Link>
             </motion.div>
           ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
