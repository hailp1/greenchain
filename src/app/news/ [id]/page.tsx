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
             Chiến dịch "SỐ HÓA NIỀM TIN" là nỗ lực lớn nhất từ trước đến nay của fwd LIFEchain nhằm xóa bỏ rào cản thông tin giữa người sản xuất và người tiêu dùng thông qua sức mạnh của sổ cái phi tập trung.
          </p>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">1. Bối cảnh: Nghịch lý của nông sản Việt</h2>
             <p className="text-slate-600 leading-relaxed">
                Việt Nam sở hữu những vùng trồng nông sản chất lượng hàng đầu thế giới, từ cà phê Lâm Đồng đến lúa gạo miền Tây. Tuy nhiên, giá trị kinh tế thu về thường không tương xứng do thiếu sự minh bạch trong quy trình. Người tiêu dùng sẵn sàng trả giá cao hơn cho sự "an tâm", nhưng các hệ thống truy xuất nguồn gốc truyền thống (dùng giấy tờ hoặc QR code tĩnh) dễ bị làm giả, dẫn đến sự xói mòn niềm tin.
             </p>
          </section>

          <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
             <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="text-emerald-600" /> Lợi ích khi ứng dụng Blockchain
             </h3>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Minh bạch 100% quy trình từ hạt giống",
                  "Chống gian lận vùng trồng bằng GPS",
                  "Tăng giá trị sản phẩm lên 20-30%",
                  "Mở cửa thị trường xuất khẩu EU/Mỹ",
                  "Xây dựng thương hiệu cá nhân cho nông dân",
                  "Dữ liệu bất biến, không thể sửa xóa"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                     <CheckCircle2 size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
                     <span>{item}</span>
                  </li>
                ))}
             </ul>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">2. Giải pháp kỹ thuật: ST-PoO Protocol</h2>
             <p className="text-slate-600 leading-relaxed mb-6">
                Trái tim của chiến dịch là giao thức **Space-Time Proof of Origin (ST-PoO)**. Thay vì chỉ dán nhãn, chúng tôi sử dụng mạng lưới thiết bị IoT và xác thực cộng đồng để tạo ra một "Dấu vân tay số" cho mỗi lô hàng:
             </p>
             <div className="space-y-4">
                <div className="flex gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                   <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-black shrink-0">01</div>
                   <div>
                      <h4 className="font-black text-slate-900 uppercase text-sm">Geo-Fencing Verification</h4>
                      <p className="text-sm text-slate-500 font-light mt-1">Tự động khóa vùng dữ liệu khi thiết bị ra khỏi ranh giới vườn đã đăng ký.</p>
                   </div>
                </div>
                <div className="flex gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                   <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black shrink-0">02</div>
                   <div>
                      <h4 className="font-black text-slate-900 uppercase text-sm">Real-time IoT Logging</h4>
                      <p className="text-sm text-slate-500 font-light mt-1">Ghi nhận độ ẩm, nhiệt độ và lịch trình chăm sóc trực tiếp lên chuỗi khối (On-chain).</p>
                   </div>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">3. Lộ trình triển khai 2026-2030</h2>
             <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                <div className="relative">
                   <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                   <h4 className="font-black text-slate-900 uppercase text-sm">Giai đoạn 1 (2026): Thử nghiệm thực địa</h4>
                   <p className="text-sm text-slate-500 mt-1 font-light italic">Kết nối 50 HTX tiên phong tại Lâm Đồng và Đắk Lắk.</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                   <h4 className="font-black text-slate-900 uppercase text-sm">Giai đoạn 2 (2027-2028): Mở rộng quy mô</h4>
                   <p className="text-sm text-slate-500 mt-1 font-light italic">Tích hợp hệ thống thanh toán thông minh (Smart Contract) cho nông dân.</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                   <h4 className="font-black text-slate-900 uppercase text-sm">Giai đoạn 3 (2030): Hệ sinh thái toàn diện</h4>
                   <p className="text-sm text-slate-500 mt-1 font-light italic">Số hóa 1 triệu hộ nông dân Việt Nam trên nền tảng fwd LIFEchain.</p>
                </div>
             </div>
          </section>

          <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500 opacity-20 blur-3xl"></div>
             <h3 className="text-2xl font-black uppercase mb-4 relative z-10">Đăng ký tham gia ngay</h3>
             <p className="text-slate-400 mb-8 relative z-10 leading-relaxed font-light">
                Nếu bạn là chủ HTX hoặc hộ nông dân đang muốn tìm giải pháp xuất khẩu, hãy để chúng tôi đồng hành cùng bạn. Miễn phí hoàn toàn phí hạ tầng cho 100 đăng ký đầu tiên.
             </p>
             <div className="flex flex-wrap gap-4 relative z-10">
                <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
                   Đăng ký tư vấn
                </button>
                <button className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                   Tải brochure kỹ thuật
                </button>
             </div>
          </div>
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
          <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6 relative overflow-hidden">
             <Info size={120} className="absolute -bottom-10 -right-10 text-slate-200 opacity-30" />
             <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen size={24} className="text-emerald-600" /> Abstract & Introduction
             </h3>
             <p className="text-slate-600 leading-relaxed font-light italic text-lg">
                This study investigates the psychological mechanism of how blockchain-backed proof of origin serves as a high-fidelity signal to mitigate information asymmetry in the agricultural market. Using the Stimulus-Organism-Response (S-O-R) framework, we analyze the mediating role of perceived transparency.
             </p>
          </div>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">1. Theoretical Framework: Signaling Theory</h2>
             <p className="text-slate-600 leading-relaxed mb-6">
                According to Spence (1973), a signal must be "costly" to be credible. In the digital age, simple labels are no longer costly signals due to ease of forgery. Our research positions the **ST-PoO Protocol** as a "Superior Signal" because its decentralized validation process requires significant technical and social overhead, making it "Hard-to-Fake".
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                   <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Traditional Signals</h4>
                   <ul className="space-y-2 text-sm text-slate-500">
                      <li>• Paper Certificates (Static)</li>
                      <li>• Brand Narratives (Subjective)</li>
                      <li>• Centralized QR Links (Mutable)</li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">Blockchain Signals (ST-PoO)</h4>
                   <ul className="space-y-2 text-sm text-slate-500">
                      <li>• Real-time IoT Validation</li>
                      <li>• Immutable Ledger Proofs</li>
                      <li>• Decentralized Consensus</li>
                   </ul>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">2. Methodology: 2x2 Experimental Design</h2>
             <p className="text-slate-600 leading-relaxed mb-6">
                We conducted a controlled experimental study with N=450 participants, divided into four treatment groups based on the level of blockchain signal granularity:
             </p>
             <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-900 font-black uppercase text-[10px] tracking-widest">
                      <tr>
                         <th className="p-4">Group ID</th>
                         <th className="p-4">Condition</th>
                         <th className="p-4">Signal Type</th>
                      </tr>
                   </thead>
                   <tbody className="text-slate-600 font-light divide-y divide-slate-100">
                      <tr>
                         <td className="p-4 font-bold">Group A</td>
                         <td className="p-4">Control</td>
                         <td className="p-4">Standard QR Code (Static URL)</td>
                      </tr>
                      <tr>
                         <td className="p-4 font-bold text-emerald-600">Group B</td>
                         <td className="p-4">Experimental</td>
                         <td className="p-4">Blockchain Explorer (ST-PoO Data)</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">3. Structural Equation Modeling (SEM)</h2>
             <p className="text-slate-600 leading-relaxed mb-8">
                To validate our hypotheses, we used Partial Least Squares SEM (PLS-SEM). The model fitness was assessed using CFI (>0.92) and RMSEA (<0.06).
             </p>
             <div className="p-10 bg-slate-900 rounded-[3rem] text-center shadow-xl space-y-6">
                <div className="inline-block px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">Statistical Model</div>
                <div className="text-2xl md:text-3xl font-mono text-emerald-400 leading-relaxed">
                   Trust = 0.54 · Transparency + 0.32 · Signal_Integrity + ε
                </div>
                <p className="text-slate-500 text-xs italic font-light">
                   R² = 0.68 (68% variance in Brand Trust explained by the model)
                </p>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">4. Discussion & Contribution</h2>
             <p className="text-slate-600 leading-relaxed">
                Our findings confirm that blockchain signals don't just "prove" the origin; they fundamentally change the consumer's cognitive processing of brand value. This research contributes to both *Journal of Marketing Technology* and *Sustainability Science* by providing an empirical bridge between cryptographic truth and consumer psychology.
             </p>
          </section>

          <section className="pt-10 border-t border-slate-100">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">References</h4>
             <ul className="text-[10px] text-slate-400 font-light space-y-2 uppercase leading-relaxed">
                <li>• Spence, M. (1973). Job Market Signaling. Quarterly Journal of Economics.</li>
                <li>• Le Phuc Hai (2026). The ST-PoO Protocol: Decentralized Trust in Agriculture.</li>
                <li>• Verbeke, W. (2005). Agriculture and the consumer: Information asymmetry and trust.</li>
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
           <Link href="/" className="hover:text-emerald-600">Home</Link>
           <span>/</span>
           <Link href="/news" className="hover:text-emerald-600">News</Link>
           <span>/</span>
           <span className="text-slate-900 uppercase">{article.category}</span>
        </div>

        <div className="space-y-8 mb-12">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                 {article.category}
              </span>
              <div className="h-px flex-grow bg-slate-100"></div>
           </div>
           
           <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight italic">
              {article.title}
           </h1>

           <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100">
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

        <div className="mt-20 flex items-center justify-between pt-12 border-t border-slate-100">
           <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:gap-4 transition-all">
              <ArrowRight className="rotate-180" /> Khám phá các Insights khác
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
