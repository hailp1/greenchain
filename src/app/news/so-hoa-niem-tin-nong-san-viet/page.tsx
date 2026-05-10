'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ShieldCheck, Zap, ArrowRight, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function NewsDetailPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* SEO Metadata (Mental representation, Next.js handles this in layout/head) */}
      {/* Title: Số hóa niềm tin: Miễn phí Blockchain cho nông dân Việt Nam | fwd LIFEchain */}
      {/* Desc: fwd LIFEchain khởi động chiến dịch miễn phí 100% giải pháp Blockchain nông nghiệp cho nông dân Việt Nam. Nâng tầm giá trị nông sản qua công nghệ ST-PoO. */}
      
      <Header />
      
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        {/* Article Header */}
        <div className="space-y-8 mb-12">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                 Chiến dịch cộng đồng
              </span>
              <div className="h-px flex-grow bg-slate-100"></div>
           </div>
           
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
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
                 <div className="flex items-center gap-2">
                    <Share2 size={14} />
                    <Facebook size={14} className="cursor-pointer hover:text-blue-600" />
                    <Twitter size={14} className="cursor-pointer hover:text-blue-400" />
                    <Linkedin size={14} className="cursor-pointer hover:text-blue-700" />
                 </div>
              </div>
           </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
           <img 
             src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200" 
             alt="Blockchain trong nông nghiệp Việt Nam" 
             className="w-full h-full object-cover"
           />
        </div>

        {/* Content Section - SEO Optimized */}
        <article className="prose prose-slate prose-lg max-w-none">
           <p className="text-xl font-light leading-relaxed text-slate-600 mb-8 italic border-l-4 border-emerald-500 pl-6">
              "Sự minh bạch không chỉ là một tính năng kỹ thuật, đó là nền tảng của niềm tin. Với fwd LIFEchain, chúng tôi muốn trao quyền cho mỗi người nông dân Việt Nam khả năng chứng minh giá trị sản phẩm của mình trước toàn thế giới."
           </p>

           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-12 mb-6">
              Bối cảnh: Bẫy "giải cứu" và nỗi lo nguồn gốc
           </h2>
           <p>
              Nông nghiệp Việt Nam đang đứng trước một nghịch lý: Sản phẩm của chúng ta cực kỳ chất lượng, nhưng giá trị thương hiệu lại chưa cao. Người tiêu dùng trong và ngoài nước luôn đặt câu hỏi về tính minh bạch của nguồn gốc thực phẩm. Những chiến dịch "giải cứu" nông sản liên tục diễn ra là hệ quả của việc thiếu sự kết nối niềm tin trực tiếp giữa người sản xuất và người tiêu dùng.
           </p>

           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-12 mb-6">
              Giải pháp: fwd LIFEchain và Giao thức ST-PoO
           </h2>
           <p>
              Nhằm giải quyết triệt để vấn đề này, fwd LIFEchain chính thức khởi động chiến dịch hỗ trợ <strong>miễn phí 100%</strong> cài đặt hệ thống Blockchain cho các HTX và hộ nông dân trên toàn quốc. Trái tim của giải pháp là giao thức <strong>ST-PoO (Spatial-Temporal Proof of Origin)</strong>.
           </p>
           <ul>
              <li><strong>Minh bạch tuyệt đối:</strong> Mọi thông tin thu hoạch được xác thực qua GPS và IoT.</li>
              <li><strong>Bất biến:</strong> Dữ liệu khi đã lên Blockchain không thể bị sửa đổi bởi bất kỳ cá nhân nào.</li>
              <li><strong>Nâng tầm giá trị:</strong> Sản phẩm có bằng chứng Blockchain dễ dàng đạt được niềm tin tại các thị trường khó tính như EU, Mỹ.</li>
           </ul>

           <div className="my-12 p-8 bg-emerald-900 rounded-[2.5rem] text-white space-y-6 shadow-xl relative overflow-hidden">
              <ShieldCheck size={120} className="absolute -top-10 -right-10 text-emerald-800 opacity-50" />
              <h3 className="text-2xl font-black uppercase tracking-tight relative z-10">Đăng ký tham gia ngay hôm nay</h3>
              <p className="text-emerald-100 font-light relative z-10 leading-relaxed">
                 Chúng tôi cam kết hỗ trợ toàn bộ chi phí triển khai ban đầu cho 50 hộ nông dân và HTX đăng ký sớm nhất trong tháng 5/2026. Hãy trở thành những người tiên phong trong cuộc cách mạng nông nghiệp số.
              </p>
              <button className="px-8 py-4 bg-white text-emerald-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all relative z-10 shadow-lg">
                 Đăng ký tư vấn miễn phí
              </button>
           </div>

           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-12 mb-6">
              Kết luận: Tương lai của nông sản Việt là sự minh bạch
           </h2>
           <p>
              Blockchain không còn là một khái niệm xa vời. Với fwd LIFEchain, chúng tôi đang hiện thực hóa nó trên những cánh đồng Việt Nam. Hãy cùng chúng tôi nâng tầm nông nghiệp Việt vươn ra biển lớn bằng chính sức mạnh của sự thật và công nghệ.
           </p>
        </article>

        {/* Tags Section */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
           {['Blockchain nông nghiệp', 'Truy xuất nguồn gốc', 'fwd LIFEchain', 'Nông nghiệp số', 'ST-PoO'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                 #{tag}
              </span>
           ))}
        </div>

        {/* Back Link */}
        <div className="mt-12">
           <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:gap-4 transition-all">
              <ArrowRight className="rotate-180" /> Quay lại danh sách tin tức
           </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
