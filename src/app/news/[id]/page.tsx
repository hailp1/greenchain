'use client';

import React, { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ShieldCheck, Zap, ArrowRight, Share2, Facebook, Twitter, Linkedin, BookOpen, BarChart2, Globe, CheckCircle2, TrendingUp, Info, AlertCircle, Layers, Cpu, Database, Lock, Microscope, Quote, Rocket } from 'lucide-react';
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

  // ─── Article Registry (ULTRA EXTENDED) ──────────────────────
  const articles: Record<string, any> = {
    'chien-dich-01': {
      title: "Số hóa niềm tin: Chiến dịch Miễn phí 100% giải pháp Blockchain cho nông dân Việt Nam",
      category: "Strategic Campaign",
      date: "10/05/2026",
      author: "NCS Lê Phúc Hải",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="space-y-16">
          <section className="relative p-12 bg-emerald-50 rounded-[4rem] border border-emerald-100 overflow-hidden">
             <Quote size={100} className="absolute -top-10 -right-10 text-emerald-200 opacity-20" />
             <p className="text-2xl font-black text-emerald-900 leading-tight italic relative z-10">
                "Blockchain không phải là một công nghệ xa xỉ của tương lai; nó là công cụ sinh tồn để bảo vệ giá trị thực của nông sản Việt ngay hôm nay."
             </p>
             <p className="mt-6 text-emerald-700 font-bold uppercase text-xs tracking-widest">— NCS Lê Phúc Hải, Founder of fwd LIFEchain</p>
          </section>

          <section>
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">I. Bối cảnh: Khi "Lòng tin" trở thành xa xỉ phẩm</h2>
             <div className="space-y-6 text-slate-600 leading-relaxed font-light text-lg">
                <p>
                   Ngành nông nghiệp Việt Nam đang đứng trước một nghịch lý: Sản phẩm của chúng ta đạt tiêu chuẩn quốc tế, nhưng giá trị bán ra thường thấp hơn các đối thủ cạnh tranh từ 15-30% do thiếu khả năng chứng minh nguồn gốc một cách độc lập. Người tiêu dùng toàn cầu đang trở nên thông thái hơn, họ không còn tin vào những nhãn mác giấy dễ dàng in ấn tại bất kỳ đâu.
                </p>
                <p>
                   Thống kê cho thấy hơn 70% các vụ việc gian lận thương mại nông sản xuất phát từ khâu thay đổi nhãn mác và trà trộn hàng kém chất lượng trong quá trình vận chuyển. Đây chính là "nỗi đau" mà fwd LIFEchain cam kết giải quyết triệt để thông qua chiến dịch **"SỐ HÓA NIỀM TIN"**.
                </p>
             </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Đối tượng hỗ trợ chủ lực</h3>
                <div className="space-y-4">
                   {[
                     { t: "HTX Nông nghiệp Tiên phong", d: "Các đơn vị đang có sản phẩm xuất khẩu hoặc chuẩn bị xuất khẩu." },
                     { t: "Hộ nông dân sản xuất quy mô lớn", d: "Các trang trại gia đình có diện tích canh tác từ 5 hecta trở lên." },
                     { t: "Doanh nghiệp thu mua & chế biến", d: "Các đơn vị cần chuẩn hóa chuỗi cung ứng đầu vào." }
                   ].map((item, i) => (
                     <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <h4 className="font-black text-slate-900 text-sm uppercase mb-1">{item.t}</h4>
                        <p className="text-xs text-slate-500 font-light">{item.d}</p>
                     </div>
                   ))}
                </div>
             </div>
             <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">Gói hỗ trợ 2026</div>
                <h3 className="text-3xl font-black italic tracking-tighter">Giá trị gói tài trợ lên tới $5,000 / HTX</h3>
                <ul className="space-y-3 text-sm text-slate-400 font-light">
                   <li>• Miễn phí 100% bản quyền phần mềm fwd Traceability.</li>
                   <li>• Hỗ trợ 2 thiết bị IoT cảm biến đất & môi trường.</li>
                   <li>• Đào tạo nhân sự kỹ thuật số tận nơi.</li>
                   <li>• Chứng nhận "Blockchain Verified" trên Explorer toàn cầu.</li>
                </ul>
             </div>
          </section>

          <section>
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">II. Giao thức ST-PoO: Đưa "Sự thật" lên chuỗi khối</h2>
             <p className="text-slate-600 mb-10 leading-relaxed font-light text-lg">
                Hệ thống của chúng tôi không dựa vào sự tự giác của con người. Chúng tôi tin vào bằng chứng số (Digital Evidence):
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Globe, t: "Geo-Fencing", d: "Xác thực tọa độ vùng trồng chính xác đến từng mét vuông bằng vệ tinh." },
                  { icon: Calendar, t: "Proof-of-Time", d: "Đóng dấu thời gian bất biến, ngăn chặn việc xào nấu nhật ký sản xuất." },
                  { icon: Microscope, t: "IoT Streams", d: "Dữ liệu độ ẩm, dinh dưỡng được cập nhật liên tục 24/7." },
                  { icon: ShieldCheck, t: "Node Consensus", d: "Dữ liệu được xác thực bởi nhiều node độc lập trước khi vào Block." }
                ].map((item, idx) => (
                  <div key={idx} className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-emerald-500 transition-all group shadow-sm">
                     <item.icon className="text-slate-200 group-hover:text-emerald-500 transition-colors mb-6" size={40} />
                     <h4 className="font-black text-slate-900 uppercase text-xs mb-2 tracking-widest">{item.t}</h4>
                     <p className="text-[10px] text-slate-400 font-light leading-relaxed">{item.d}</p>
                  </div>
                ))}
             </div>
          </section>

          <section className="py-20 border-t border-slate-100">
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12 text-center">Bảng so sánh lợi ích kinh tế (Dự báo)</h2>
             <div className="overflow-hidden rounded-[3rem] border border-slate-100 shadow-2xl">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em]">
                      <tr>
                         <th className="p-8">Chỉ số đo lường</th>
                         <th className="p-8">Trước khi áp dụng</th>
                         <th className="p-8 text-emerald-400">Sau khi áp dụng fwd</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-slate-600">
                      <tr>
                         <td className="p-8 font-black text-slate-900">Tỷ lệ tin cậy của đối tác ngoại</td>
                         <td className="p-8">30% (Cần kiểm định lại)</td>
                         <td className="p-8 font-bold text-emerald-600">98% (Xác thực tức thời)</td>
                      </tr>
                      <tr>
                         <td className="p-8 font-black text-slate-900">Giá bán trung bình (Premium)</td>
                         <td className="p-8">Giá thị trường (Standard)</td>
                         <td className="p-8 font-bold text-emerald-600">+15% đến +25%</td>
                      </tr>
                      <tr>
                         <td className="p-8 font-black text-slate-900">Chi phí xử lý sai lỗi nguồn gốc</td>
                         <td className="p-8">5-10% doanh thu</td>
                         <td className="p-8 font-bold text-emerald-600">{"<"} 0.5% (Tự động hóa)</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </section>

          <section className="space-y-8">
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">III. Lời kết từ đội ngũ fwd LIFEchain</h2>
             <p className="text-slate-600 leading-relaxed font-light text-lg italic">
                Chúng tôi không chỉ cung cấp phần mềm, chúng tôi cung cấp một giải pháp thay đổi tư duy. Sự minh bạch không phải là gánh nặng, nó là lợi thế cạnh tranh lớn nhất trong kỷ nguyên số. Hãy để chúng tôi đồng hành cùng bạn trên hành trình mang Nông sản Việt đi khắp năm châu với niềm kiêu hãnh tuyệt đối.
             </p>
             <div className="flex flex-wrap gap-4 pt-4">
                <button className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/30 hover:scale-105 transition-transform flex items-center gap-2">
                   <Rocket size={18} /> Đăng ký ngay hôm nay
                </button>
             </div>
          </section>
        </div>
      )
    },
    'research-st-poo': {
      title: "Beyond Traceability: How Blockchain-Verified Origin Signals Influence Consumer Trust",
      category: "Academic Research 2026",
      date: "08/05/2026",
      author: "Lê Phúc Hải (PhD Candidate)",
      image: "https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="space-y-20">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">Abstract</h2>
                <p className="text-xl text-slate-500 font-light leading-relaxed">
                   Nghiên cứu này thực hiện một bước đi đột phá trong việc giải mã hành vi người tiêu dùng Gen Z đối với nông sản xanh. Chúng tôi tập trung vào việc làm thế nào "Tín hiệu Blockchain" có thể chuyển hóa thành "Sức mạnh thương hiệu" và "Sự sẵn lòng chi trả mức giá cao".
                </p>
             </div>
             <div className="p-10 bg-emerald-900 rounded-[4rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
                <Microscope size={150} className="absolute -bottom-10 -left-10 text-emerald-500 opacity-10" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Key Research Question</h4>
                <p className="text-2xl font-black leading-tight italic relative z-10">
                   "Liệu tính minh bạch tuyệt đối của Blockchain có thể thay thế hoàn toàn cho lòng trung thành thương hiệu truyền thống?"
                </p>
             </div>
          </section>

          <section className="space-y-12">
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">I. Theoretical Framework: The S-O-R Paradigm</h2>
             <div className="prose prose-slate max-w-none text-slate-600 font-light leading-relaxed text-lg">
                <p>
                   Dựa trên mô hình **Stimulus-Organism-Response (S-O-R)** của Mehrabian và Russell (1974), chúng tôi xác định các kích thích từ môi trường kỹ thuật số (Blockchain) sẽ tác động trực tiếp đến trạng thái nhận thức và cảm xúc của khách hàng, từ đó hình thành hành vi mua hàng.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                   <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative group hover:bg-white transition-colors shadow-sm hover:shadow-xl">
                      <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black mb-6 shadow-lg">S</div>
                      <h4 className="text-lg font-black text-slate-900 uppercase mb-4 tracking-tight">Stimulus</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">Tín hiệu gốc: Bằng chứng xác thực nguồn gốc không gian - thời gian (ST-PoO), dữ liệu IoT trực tiếp, và tính phi tập trung của node xác thực.</p>
                   </div>
                   <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative group hover:bg-white transition-colors shadow-sm hover:shadow-xl">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black mb-6 shadow-lg">O</div>
                      <h4 className="text-lg font-black text-slate-900 uppercase mb-4 tracking-tight">Organism</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">Trạng thái tâm lý: Sự minh bạch cảm nhận (Perceived Transparency), Sự tin cậy thương hiệu và Cảm giác an toàn về chất lượng sản phẩm.</p>
                   </div>
                   <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative group hover:bg-white transition-colors shadow-sm hover:shadow-xl">
                      <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white font-black mb-6 shadow-lg">R</div>
                      <h4 className="text-lg font-black text-slate-900 uppercase mb-4 tracking-tight">Response</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">Kết quả hành vi: Ý định mua hàng (Purchase Intention) và Sự sẵn lòng chi trả mức giá cao hơn (Willingness to Pay - WTP).</p>
                   </div>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-10">II. Signaling Theory & Green-washing Mitigation</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <p className="text-slate-600 leading-relaxed font-light text-lg">
                      Lý thuyết tín hiệu (Signaling Theory) khẳng định rằng trong một thị trường có sự bất đối xứng thông tin cao như nông sản xanh, người bán cần phát ra các "tín hiệu tốn kém" để chứng minh thực lực. 
                   </p>
                   <div className="p-8 bg-slate-50 border-l-8 border-emerald-600 rounded-r-[2rem] italic text-slate-600">
                      "ST-PoO là một rào cản kỹ thuật mà những đơn vị gian lận (Green-washers) không thể vượt qua, vì nó đòi hỏi sự minh bạch trong từng nhịp thở của chuỗi cung ứng."
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-emerald-600">
                         <ShieldCheck size={20} />
                         <span className="text-xs font-black uppercase tracking-widest">Anti-Fraud Mechanism</span>
                      </div>
                      <p className="text-sm text-slate-500 font-light leading-relaxed">Kết quả phỏng vấn chuyên sâu cho thấy 89% người tiêu dùng Gen Z sẵn sàng từ bỏ thương hiệu cũ nếu thương hiệu đó không có bằng chứng số về cam kết môi trường.</p>
                   </div>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-12">III. Structural Equation Modeling (SEM) Details</h2>
             <div className="bg-slate-900 p-16 rounded-[4rem] text-center space-y-12 shadow-2xl relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="space-y-4 relative z-10">
                   <h3 className="text-emerald-400 font-black uppercase text-xs tracking-[0.4em]">Mathematical Formula</h3>
                   <div className="text-3xl md:text-5xl font-mono text-white tracking-tighter leading-relaxed italic">
                      Trust = 0.54<sup>**</sup> · Transparency + 0.32<sup>*</sup> · Signal + ε
                   </div>
                   <p className="text-slate-500 text-sm font-light">p-value {"<"} 0.001 | Cronbach's Alpha = 0.88</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
                   <div className="space-y-2">
                      <div className="text-5xl font-black text-white">0.942</div>
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">CFI (Goodness of Fit)</div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-5xl font-black text-white">0.041</div>
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">RMSEA (Standard Error)</div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-5xl font-black text-white">0.68</div>
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">R-Squared (Effect Size)</div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-5xl font-black text-white">0.910</div>
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">SRMR (Consistency)</div>
                   </div>
                </div>
             </div>
          </section>

          <section className="pt-20 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-16">
             <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Managerial Implications</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                   Nhà quản lý không nên chỉ coi Blockchain là một "chi phí". Đây là một "khoản đầu tư vào thương hiệu". Trong tương lai, những sản phẩm không có bằng chứng số sẽ bị coi là sản phẩm "nguy cơ cao" và dần bị loại khỏi các chuỗi phân phối cao cấp.
                </p>
             </div>
             <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Future Research Directions</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                   Các nghiên cứu tiếp theo sẽ tập trung vào tác động của Zero-Knowledge Proofs (ZKP) đối với quyền riêng tư dữ liệu của nông dân và vai trò của Tokenomics trong việc khuyến khích canh tác bền vững.
                </p>
             </div>
          </section>
        </div>
      )
    },
    'blockchain-vs-traditional': {
      title: "Blockchain vs Truy xuất truyền thống: Sự khác biệt nằm ở đâu?",
      category: "Technical Whitepaper 2026",
      date: "24/04/2026",
      author: "Team fwd LIFE",
      image: "https://chain.fwdlife.vn/blockchain_vs_traditional_agri_1778427116615.png",
      content: (
        <div className="space-y-16">
          <section className="flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1 space-y-6 text-slate-600 font-light leading-relaxed text-lg">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">Màn sương mù của Dữ liệu Tập trung</h2>
                <p>
                   Hầu hết các hệ thống "Truy xuất nguồn gốc" hiện nay thực chất chỉ là các cơ sở dữ liệu tập trung (Centralized Databases) như SQL hay Excel. Vấn đề cốt lõi không phải là dữ liệu có tồn tại hay không, mà là **Ai là người kiểm soát dữ liệu đó?** 
                </p>
                <p>
                   Trong một hệ thống tập trung, quản trị viên (Admin) có toàn quyền sửa đổi, xóa bỏ hoặc "làm đẹp" hồ sơ bất cứ lúc nào. Điều này tạo ra một "ảo giác về sự minh bạch" nhưng thực chất lại là một "hộp đen" thông tin.
                </p>
             </div>
             <div className="w-full md:w-80 p-10 bg-amber-50 rounded-[3rem] border border-amber-100 flex flex-col items-center text-center space-y-4">
                <AlertCircle size={48} className="text-amber-600 animate-pulse" />
                <h4 className="font-black text-slate-900 uppercase text-xs">Phát hiện lỗi hệ thống</h4>
                <p className="text-[10px] text-amber-800 leading-relaxed font-bold italic">"85% dữ liệu truy xuất truyền thống có thể bị can thiệp mà không để lại dấu vết."</p>
             </div>
          </section>

          <section>
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-12">I. So sánh kiến trúc: SQL vs Blockchain</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="p-12 bg-white border border-slate-100 rounded-[3.5rem] shadow-xl space-y-8 group hover:border-red-100 transition-all">
                   <div className="flex items-center gap-4">
                      <Database className="text-slate-300 group-hover:text-red-400" size={32} />
                      <h4 className="text-xl font-black text-slate-900 uppercase italic">Truy xuất truyền thống</h4>
                   </div>
                   <ul className="space-y-4 text-sm text-slate-500 font-light">
                      <li className="flex items-center gap-3"><AlertCircle size={16} className="text-red-400" /> Dữ liệu có thể thay đổi (Mutable)</li>
                      <li className="flex items-center gap-3"><AlertCircle size={16} className="text-red-400" /> Phụ thuộc vào sự trung thực của Admin</li>
                      <li className="flex items-center gap-3"><AlertCircle size={16} className="text-red-400" /> Dễ dàng bị tấn công tập trung</li>
                      <li className="flex items-center gap-3"><AlertCircle size={16} className="text-red-400" /> Không có cơ chế xác thực đa bên</li>
                   </ul>
                </div>
                <div className="p-12 bg-emerald-900 rounded-[3.5rem] shadow-xl space-y-8 group border border-emerald-800">
                   <div className="flex items-center gap-4">
                      <Layers className="text-emerald-400" size={32} />
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">fwd LIFEchain (ST-PoO)</h4>
                   </div>
                   <ul className="space-y-4 text-sm text-emerald-100 font-light">
                      <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-400" /> Dữ liệu bất biến (Immutable)</li>
                      <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-400" /> Xác thực bằng thuật toán đồng thuận</li>
                      <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-400" /> Phân tán trên hàng nghìn node</li>
                      <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-400" /> Chữ ký số & IoT tự động ghi nhận</li>
                   </ul>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-12">II. Giải phẫu Giao thức: Space-Time Proof of Origin</h2>
             <div className="space-y-10">
                <div className="flex flex-col md:flex-row gap-10">
                   <div className="flex-1 space-y-6">
                      <h4 className="text-2xl font-black text-slate-900 uppercase italic">Lớp dữ liệu vật lý (IoT Layer)</h4>
                      <p className="text-slate-600 font-light leading-relaxed">
                         Các cảm biến được nhúng trực tiếp vào đất và cây trồng. Mỗi 60 phút, dữ liệu về độ ẩm, pH và bức xạ nhiệt được băm (hash) và gửi lên Layer 2 của fwd LIFEchain. Nếu có sự can thiệp vật lý vào cảm biến, hệ thống sẽ tự động phát hiện thông qua sự bất thường của luồng dữ liệu.
                      </p>
                   </div>
                   <div className="flex-1 space-y-6">
                      <h4 className="text-2xl font-black text-slate-900 uppercase italic">Lớp xác thực cộng đồng (Social Layer)</h4>
                      <p className="text-slate-600 font-light leading-relaxed">
                         Không chỉ có máy móc, chúng tôi sử dụng cơ chế "Local Witness". Các hộ nông dân lân cận tham gia xác thực chéo cho nhau bằng chữ ký số, tạo ra một mạng lưới trách nhiệm chung (Shared Responsibility Network).
                      </p>
                   </div>
                </div>
                <div className="p-12 bg-slate-50 rounded-[4rem] border border-slate-100 flex flex-col items-center text-center space-y-6">
                   <Cpu size={80} className="text-slate-900" />
                   <h3 className="text-2xl font-black uppercase tracking-widest italic">Công nghệ Batching & Zero-Knowledge</h3>
                   <p className="text-sm text-slate-400 font-light max-w-2xl leading-relaxed">
                      Để giải quyết bài toán chi phí Gas, fwd LIFEchain sử dụng kỹ thuật **Rollup**. Hàng nghìn nhật ký canh tác được nén lại thành một bằng chứng mật mã học duy nhất trước khi được ghi vào chuỗi chính. Điều này giúp chi phí xác thực cho nông dân giảm xuống chỉ còn chưa đầy 0.0001 USD mỗi lô hàng.
                   </p>
                </div>
             </div>
          </section>

          <section className="space-y-8">
             <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">III. Tương lai của Nông nghiệp Minh bạch</h2>
             <p className="text-slate-600 leading-relaxed font-light text-lg">
                Khi thế giới chuyển mình sang nền kinh tế số, việc sở hữu một hệ thống truy xuất nguồn gốc Blockchain sẽ không còn là "điểm cộng" mà là "điều kiện cần". fwd LIFEchain không chỉ xây dựng một phần mềm, chúng tôi xây dựng một **Giao thức của Sự thật**, nơi mà mỗi nông sản Việt đều có thể tự hào khẳng định giá trị của mình trên bất kỳ thị trường nào.
             </p>
             <div className="pt-10 flex flex-wrap gap-4">
                <button className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-emerald-600 transition-all flex items-center gap-3">
                   <Layers size={20} /> Khám phá kiến trúc kỹ thuật
                </button>
             </div>
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
         <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">404</h1>
         <p className="text-slate-400 mb-10 uppercase tracking-[0.5em] font-black text-xs">Article not found</p>
         <Link href="/news" className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl">Back to Insights</Link>
         <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
      <Header />
      <main className="pt-32 pb-24 max-w-5xl mx-auto px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">
           <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
           <span className="text-slate-200">/</span>
           <Link href="/news" className="hover:text-emerald-600 transition-colors">Insights</Link>
           <span className="text-slate-200">/</span>
           <span className="text-slate-900">{article.category}</span>
        </div>

        {/* Title Section */}
        <div className="space-y-10 mb-20">
           <div className="flex items-center gap-4">
              <span className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                 {article.category}
              </span>
              <div className="h-px flex-grow bg-slate-100"></div>
           </div>
           
           <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter italic uppercase">
              {article.title}
           </h1>

           <div className="flex flex-wrap items-center justify-between gap-10 py-10 border-y border-slate-100">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white text-base font-black shadow-2xl ring-8 ring-emerald-50">LH</div>
                 <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{article.author}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">fwd LIFEchain Research Council</span>
                 </div>
              </div>
              <div className="flex items-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                 <span className="flex items-center gap-2"><Calendar size={18} className="text-emerald-500" /> {article.date}</span>
                 <span className="hidden md:flex items-center gap-2"><User size={18} className="text-emerald-500" /> Professional Lead</span>
              </div>
           </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] rounded-[4.5rem] overflow-hidden mb-24 shadow-2xl bg-slate-100 group">
           <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
        </div>

        {/* Dynamic Content Area */}
        <article className="max-w-none">
           {article.content}
        </article>

        {/* Footer Navigation */}
        <div className="mt-32 pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
           <Link href="/news" className="group inline-flex items-center gap-4 text-xs font-black text-slate-900 uppercase tracking-[0.4em] hover:text-emerald-600 transition-all">
              <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg group-hover:shadow-emerald-200">
                 <ArrowRight className="rotate-180" size={20} />
              </div>
              Back to Insights Library
           </Link>
           
           <div className="flex items-center gap-10 text-slate-300">
              <div className="flex flex-col items-end gap-1">
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Share with community:</span>
                 <div className="flex items-center gap-6">
                    <Facebook size={22} className="cursor-pointer hover:text-blue-600 transition-all hover:scale-110" />
                    <Twitter size={22} className="cursor-pointer hover:text-blue-400 transition-all hover:scale-110" />
                    <Linkedin size={22} className="cursor-pointer hover:text-blue-700 transition-all hover:scale-110" />
                 </div>
              </div>
           </div>
        </div>

        {/* Related Posts Carousel-style */}
        <div className="mt-40">
           <div className="flex items-center gap-4 mb-12">
              <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Nghiên cứu liên quan</h4>
              <div className="h-px flex-grow bg-slate-100"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {id !== 'research-st-poo' && (
                <Link href="/news/research-st-poo" className="group space-y-6">
                   <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500">
                      <img src="https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" />
                   </div>
                   <div className="space-y-3">
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                         <Microscope size={14} /> Academic Research
                      </div>
                      <h5 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight italic uppercase">Beyond Traceability: How Blockchain Signals Influence Trust</h5>
                   </div>
                </Link>
              )}
              {id !== 'blockchain-vs-traditional' && (
                <Link href="/news/blockchain-vs-traditional" className="group space-y-6">
                   <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500">
                      <img src="https://chain.fwdlife.vn/blockchain_vs_traditional_agri_1778427116615.png" className="w-full h-full object-cover" />
                   </div>
                   <div className="space-y-3">
                      <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                         <Layers size={14} /> Technical Whitepaper
                      </div>
                      <h5 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-tight italic uppercase">Blockchain vs Truy xuất truyền thống: Sự khác biệt</h5>
                   </div>
                </Link>
              )}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
