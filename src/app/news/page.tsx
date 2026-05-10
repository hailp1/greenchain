'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Share2, ShieldCheck, Zap, BookOpen } from 'lucide-react';
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
      excerpt: "Chiến dịch 'Nâng tầm nông sản Việt' chính thức khởi động, mang công nghệ ST-PoO đến với các HTX và hộ nông dân tiên phong...",
      date: "10/05/2026",
      author: "Lê Phúc Hải",
      category: "Campaign",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600",
      icon: Zap,
      color: "text-emerald-500"
    },
    {
      id: "research-st-poo",
      title: "Beyond Traceability: How Blockchain-Verified Origin Signals Influence Consumer Trust",
      excerpt: "A deep dive into the S-O-R model and Signaling Theory applied to blockchain-verified agricultural products for Q2 journal submission...",
      date: "08/05/2026",
      author: "Lê Phúc Hải",
      category: "Academic",
      image: "https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=80&w=600",
      icon: BookOpen,
      color: "text-blue-500"
    },
    {
      id: "blockchain-vs-traditional",
      title: "Blockchain vs Truy xuất truyền thống: Sự khác biệt nằm ở đâu?",
      excerpt: "Phân tích chuyên sâu về tính bất biến và khả năng chống gian lận của hệ thống phi tập trung so với các giải pháp tập trung...",
      date: "24/04/2026",
      author: "Team fwd LIFE",
      category: "Technical",
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=600",
      icon: ShieldCheck,
      color: "text-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                 Insights & Research
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic">
                 fwd <span className="text-emerald-500">Insights</span>
              </h1>
           </div>
           <p className="text-slate-500 max-w-md text-sm font-light leading-relaxed">
              Cập nhật những chiến dịch mới nhất và các công trình nghiên cứu khoa học về ứng dụng Blockchain trong nông nghiệp hiện đại.
           </p>
        </div>

        {/* Featured Post (Latest) */}
        <div className="mb-24">
           <Link href={`/news/${news[0].id}`} className="group relative block overflow-hidden rounded-[3.5rem] bg-white shadow-2xl border border-slate-100">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                 <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                    <img src={news[0].image} alt="Featured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-emerald-950/20"></div>
                 </div>
                 <div className="p-10 md:p-16 flex flex-col justify-center space-y-6">
                    <div className="flex items-center gap-3">
                       {React.createElement(news[0].icon, { className: news[0].color, size: 16 })}
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{news[0].category}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                       {news[0].title}
                    </h2>
                    <p className="text-slate-500 font-light text-lg leading-relaxed">
                       {news[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-black">LH</div>
                          <span className="text-xs font-black uppercase text-slate-900">{news[0].author}</span>
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{news[0].date}</span>
                    </div>
                 </div>
              </div>
           </Link>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           {news.slice(1).map((item, i) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               viewport={{ once: true }}
             >
                <Link href={`/news/${item.id}`} className="group space-y-6 block">
                   <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-xl bg-white border border-slate-100">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur shadow-sm rounded-full flex items-center gap-2">
                         {React.createElement(item.icon, { className: item.color, size: 14 })}
                         <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">{item.category}</span>
                      </div>
                   </div>
                   <div className="space-y-3 px-2">
                      <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                         {item.title}
                      </h3>
                      <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-2">
                         {item.excerpt}
                      </p>
                      <div className="flex items-center gap-4 pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><Calendar size={12} /> {item.date}</span>
                         <span className="flex items-center gap-1.5"><User size={12} /> {item.author}</span>
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
