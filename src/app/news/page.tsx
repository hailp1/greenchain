'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Share2, ShieldCheck, Zap } from 'lucide-react';

import { supabase } from '@/lib/supabase';

export default function NewsIndexPage() {
  // Auth Isolation: Ensure this page never redirects to portal
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
       console.log("[NewsIndex] Auth event ignored:", event);
    });
    return () => subscription.unsubscribe();
  }, []);
  const news = [
    {
      id: "so-hoa-niem-tin-nong-san-viet",
      title: "Số hóa niềm tin: Miễn phí 100% giải pháp Blockchain cho nông dân Việt Nam",
      excerpt: "Chiến dịch 'Nâng tầm nông sản Việt' chính thức khởi động, mang công nghệ ST-PoO đến với các HTX và hộ nông dân tiên phong...",
      date: "10/05/2026",
      author: "NCS Lê Phúc Hải",
      category: "Chiến dịch",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "cong-nghe-st-poo-dat-chuan-quoc-te",
      title: "Giao thức ST-PoO: Bước đột phá trong xác thực nguồn gốc nông sản",
      excerpt: "Nghiên cứu mới về sự kết hợp giữa IoT và Blockchain giúp giải quyết bài toán minh bạch cho chuỗi cung ứng nông sản toàn cầu.",
      date: "08/05/2026",
      author: "Research Team",
      category: "Công nghệ",
      image: "https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="space-y-4 mb-16">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tight">
                 News <span className="text-emerald-600">&</span> Insights
              </h1>
              <p className="text-slate-500 max-w-2xl font-medium">
                 Cập nhật những thông tin mới nhất về cuộc cách mạng Blockchain trong nông nghiệp và các nghiên cứu của fwd LIFEchain.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {news.map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="group cursor-pointer"
                 >
                    <Link href={`/news/${item.id}`}>
                       <div className="space-y-6">
                          <div className="relative aspect-[16/9] overflow-hidden rounded-[2.5rem] bg-slate-100">
                             <img 
                               src={item.image} 
                               alt={item.title} 
                               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                             />
                             <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                   {item.category}
                                </span>
                             </div>
                          </div>
                          <div className="space-y-4 px-2">
                             <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Calendar size={12} /> {item.date}</span>
                                <span className="flex items-center gap-1.5"><User size={12} /> By {item.author}</span>
                             </div>
                             <h2 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                                {item.title}
                             </h2>
                             <p className="text-slate-500 leading-relaxed font-light line-clamp-2">
                                {item.excerpt}
                             </p>
                             <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest pt-2">
                                Read Article <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
                             </div>
                          </div>
                       </div>
                    </Link>
                 </motion.div>
              ))}
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
