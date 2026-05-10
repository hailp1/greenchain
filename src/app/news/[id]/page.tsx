'use client';

import React, { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Calendar, User, ShieldCheck, Zap, ArrowRight, Share2, Facebook, Twitter, Linkedin, BookOpen, BarChart2, Globe, CheckCircle2, TrendingUp, Info, AlertCircle, Layers, Cpu, Database, Lock } from 'lucide-react';
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

  // ─── Article Registry (EXTENDED CONTENT) ─────────────────────
  const articles: Record<string, any> = {
    'chien-dich-01': {
      title: "Số hóa niềm tin: Chiến dịch Miễn phí 100% giải pháp Blockchain cho nông dân Việt Nam",
      category: "Campaign 2026",
      date: "10/05/2026",
      author: "NCS Lê Phúc Hải",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="space-y-12">
          <p className="text-2xl font-light text-slate-500 leading-relaxed border-l-4 border-emerald-500 pl-8 italic">
             Xây dựng tương lai minh bạch cho nông sản Việt thông qua công nghệ Proof-of-Origin (PoO) phi tập trung.
          </p>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">I. Tầm nhìn chiến lược: Nâng tầm vị thế Nông sản Việt</h2>
             <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                   Trong bối cảnh toàn cầu hóa, nông sản Việt Nam đang đứng trước những cơ hội chưa từng có để thâm nhập vào các thị trường khó tính như EU, Mỹ và Nhật Bản. Tuy nhiên, rào cản lớn nhất không phải là kỹ thuật canh tác, mà là khả năng minh chứng nguồn gốc và chất lượng một cách khách quan. Các hệ thống truy xuất nguồn gốc hiện tại (QR code tĩnh, chứng nhận giấy) đang bộc lộ những lỗ hổng chết người: dễ bị làm giả, dữ liệu có thể bị sửa đổi bởi bên thứ ba và thiếu sự giám sát thời gian thực.
                </p>
                <p>
                   Chiến dịch **"SỐ HÓA NIỀM TIN"** ra đời với sứ mệnh trang bị cho mỗi nông dân Việt Nam một "Cuốn sổ cái số" bất biến, nơi mà từng giọt mồ hôi trên cánh đồng đều được ghi nhận và bảo vệ bởi thuật toán mật mã học.
                </p>
             </div>
          </section>

          <section className="bg-emerald-900 p-12 rounded-[3.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 blur-3xl"></div>
             <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                <CheckCircle2 className="text-emerald-400" /> Cam kết hành động của fwd LIFEchain
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <h4 className="text-emerald-400 font-black text-sm uppercase tracking-widest">Hỗ trợ hạ tầng</h4>
                   <p className="text-sm text-slate-300 font-light">Cung cấp miễn phí 100% thiết bị IoT cơ bản và tài khoản xác thực Blockchain cho 100 HTX đầu tiên.</p>
                </div>
                <div className="space-y-2">
                   <h4 className="text-emerald-400 font-black text-sm uppercase tracking-widest">Đào tạo chuyên sâu</h4>
                   <p className="text-sm text-slate-300 font-light">Tổ chức các lớp tập huấn kỹ thuật số, giúp nông dân làm chủ công nghệ chỉ sau 3 buổi học.</p>
                </div>
                <div className="space-y-2">
                   <h4 className="text-emerald-400 font-black text-sm uppercase tracking-widest">Kết nối thị trường</h4>
                   <p className="text-sm text-slate-300 font-light">Hỗ trợ đưa sản phẩm đã xác thực lên các sàn TMĐT quốc tế và kết nối với các nhà thu mua EU.</p>
                </div>
                <div className="space-y-2">
                   <h4 className="text-emerald-400 font-black text-sm uppercase tracking-widest">Bảo chứng dữ liệu</h4>
                   <p className="text-sm text-slate-300 font-light">Dữ liệu vùng trồng được xác thực bởi cộng đồng node phi tập trung, tạo niềm tin tuyệt đối cho người mua.</p>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-6">II. Giải pháp Kỹ thuật: Proof-of-Origin (PoO)</h2>
             <p className="text-slate-600 mb-8 leading-relaxed">
                Khác với các giải pháp phần mềm thông thường, fwd LIFEchain sử dụng giao thức lớp 2 (Layer 2) chuyên dụng cho nông nghiệp. Dưới đây là quy trình 4 bước số hóa:
             </p>
             <div className="space-y-6">
                {[
                  { title: "Xác thực không gian (Spatial Proof)", desc: "Sử dụng GPS và Geo-fencing để đảm bảo dữ liệu chỉ được ghi nhận khi nông dân đang ở đúng vị trí vườn tràm/vườn cà phê đã đăng ký." },
                  { title: "Xác thực thời gian (Temporal Proof)", desc: "Timestamp bất biến được đóng dấu bởi mạng lưới Node, ngăn chặn việc 'ghi lùi' nhật ký canh tác." },
                  { title: "IoT Data Stream", desc: "Các cảm biến độ ẩm, pH và nhiệt độ đẩy dữ liệu trực tiếp lên Chain, tạo ra một dashboard sống động về quá trình sinh trưởng của cây trồng." },
                  { title: "Định danh duy nhất (Unique Identity)", desc: "Mỗi lô hàng được cấp một NFT (Non-Fungible Token) định danh, đảm bảo không thể trộn lẫn hàng kém chất lượng." }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 p-8 bg-white border border-slate-100 rounded-3xl hover:border-emerald-200 transition-all group">
                     <div className="text-4xl font-black text-slate-100 group-hover:text-emerald-100 transition-colors">0{idx+1}</div>
                     <div>
                        <h4 className="text-lg font-black text-slate-900 uppercase mb-2 tracking-tight">{step.title}</h4>
                        <p className="text-slate-500 font-light leading-relaxed">{step.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          <section className="py-12 border-y border-slate-100">
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-10 text-center italic">Lộ trình triển khai 2026-2030</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4 text-center">
                   <div className="text-4xl font-black text-emerald-500">2026</div>
                   <h5 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Khởi động</h5>
                   <p className="text-sm text-slate-500 font-light">Phủ sóng 50 HTX nông sản xuất khẩu chủ lực tại khu vực Tây Nguyên.</p>
                </div>
                <div className="space-y-4 text-center">
                   <div className="text-4xl font-black text-slate-200">2028</div>
                   <h5 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Tăng tốc</h5>
                   <p className="text-sm text-slate-500 font-light">Số hóa 500 HTX trên toàn quốc, tích hợp hệ thống thanh toán thông minh AGRI-Pay.</p>
                </div>
                <div className="space-y-4 text-center">
                   <div className="text-4xl font-black text-slate-200">2030</div>
                   <h5 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Tiêu chuẩn hóa</h5>
                   <p className="text-sm text-slate-500 font-light">Trở thành tiêu chuẩn xác thực nông sản quốc gia trên nền tảng Blockchain phi tập trung.</p>
                </div>
             </div>
          </section>

          <div className="p-12 bg-slate-900 rounded-[4rem] text-white flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden">
             <Zap size={150} className="absolute -top-10 -left-10 text-emerald-500 opacity-10" />
             <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight relative z-10 leading-tight">
                Bạn đã sẵn sàng để trở thành <br/> <span className="text-emerald-500">Nông dân số 4.0?</span>
             </h3>
             <p className="text-slate-400 max-w-xl font-light leading-relaxed relative z-10">
                Đừng để sản phẩm tâm huyết của bạn bị đánh đồng với hàng kém chất lượng. Hãy tham gia mạng lưới fwd LIFEchain ngay hôm nay để khẳng định giá trị thực của Nông sản Việt.
             </p>
             <div className="flex flex-wrap justify-center gap-6 relative z-10">
                <button className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">
                   Đăng ký khảo sát vùng trồng
                </button>
                <button className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
                   Xem tài liệu kỹ thuật (PDF)
                </button>
             </div>
          </div>
        </div>
      )
    },
    'research-st-poo': {
      title: "Beyond Traceability: How Blockchain-Verified Origin Signals Influence Consumer Trust",
      category: "PhD Research",
      date: "08/05/2026",
      author: "Lê Phúc Hải (PhD Candidate)",
      image: "https://images.unsplash.com/photo-1558444479-c8f01052877a?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="space-y-12">
          <section className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 space-y-6">
             <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <BookOpen size={28} className="text-emerald-600" /> Abstract & Theoretical Foundation
             </h3>
             <p className="text-slate-600 leading-relaxed font-light italic text-xl">
                Nghiên cứu này thực hiện một bước đi tiên phong trong việc kết hợp giữa mật mã học (Cryptography) và tâm lý học hành vi (Behavioral Psychology). Chúng tôi đặt câu hỏi: "Làm thế nào tính bất biến của Blockchain có thể chuyển hóa thành niềm tin tâm lý trong tâm trí người tiêu dùng?"
             </p>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">I. Stimulus-Organism-Response (S-O-R) Model</h2>
             <p className="text-slate-600 leading-relaxed mb-10">
                Mô hình S-O-R giải thích cách thức các yếu tố môi trường (Stimulus) ảnh hưởng đến trạng thái bên trong của con người (Organism), từ đó dẫn đến các hành động cụ thể (Response).
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border-b-4 border-b-emerald-500">
                   <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Stimulus (S)</h4>
                   <h5 className="text-lg font-black text-slate-900 mb-4 uppercase">Blockchain Signals</h5>
                   <p className="text-xs text-slate-500 leading-relaxed">Dữ liệu IoT thời gian thực, Bằng chứng nguồn gốc ST-PoO, Sự minh bạch của sổ cái.</p>
                </div>
                <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border-b-4 border-b-blue-500">
                   <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Organism (O)</h4>
                   <h5 className="text-lg font-black text-slate-900 mb-4 uppercase">Psychological State</h5>
                   <p className="text-xs text-slate-500 leading-relaxed">Sự minh bạch cảm nhận (Perceived Transparency), Niềm tin thương hiệu, Giảm thiểu rủi ro cảm nhận.</p>
                </div>
                <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border-b-4 border-b-amber-500">
                   <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">Response (R)</h4>
                   <h5 className="text-lg font-black text-slate-900 mb-4 uppercase">Consumer Behavior</h5>
                   <p className="text-xs text-slate-500 leading-relaxed">Ý định mua hàng, Sự sẵn lòng chi trả mức giá cao hơn (Willingness to Pay - WTP).</p>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">II. Signaling Theory: ST-PoO as a Costly Signal</h2>
             <div className="space-y-6 text-slate-600 leading-relaxed font-light">
                <p>
                   Trong lý thuyết tín hiệu (Signaling Theory), một tín hiệu chỉ có giá trị khi nó "tốn kém" để tạo ra (Costly Signal). Các nhãn mác thông thường hiện nay là "tín hiệu rẻ tiền" (Cheap Signals) vì bất kỳ ai cũng có thể in ấn và dán lên sản phẩm. 
                </p>
                <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl italic text-emerald-800">
                   "Giao thức ST-PoO biến tính minh bạch thành một tín hiệu tốn kém về mặt kỹ thuật nhưng vô cùng rẻ về mặt vận hành, giúp phân tách sản phẩm cao cấp thực sự khỏi các sản phẩm Green-washing."
                </div>
                <p>
                   Dữ liệu từ thực nghiệm cho thấy người tiêu dùng đánh giá tính tin cậy của dữ liệu Blockchain cao hơn 45% so với các chứng nhận giấy truyền thống, ngay cả khi họ không hiểu hoàn toàn về mặt kỹ thuật.
                </p>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">III. Experimental Design & Results</h2>
             <p className="text-slate-600 mb-8">Nghiên cứu sử dụng thiết kế **2x2 Between-Subjects Experimental Design** trên 450 mẫu ngẫu nhiên:</p>
             <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-lg">
                <table className="w-full text-left">
                   <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                      <tr>
                         <th className="p-6">Đặc điểm đo lường</th>
                         <th className="p-6">Control Group (QR thường)</th>
                         <th className="p-6">fwd LIFEchain Group</th>
                         <th className="p-6">P-Value</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm font-light divide-y divide-slate-100">
                      <tr>
                         <td className="p-6 font-bold text-slate-900">Perceived Transparency</td>
                         <td className="p-6">3.42 / 7.0</td>
                         <td className="p-6 text-emerald-600 font-black">5.89 / 7.0</td>
                         <td className="p-6 font-mono text-xs">{"<"} 0.001</td>
                      </tr>
                      <tr>
                         <td className="p-6 font-bold text-slate-900">Brand Trust</td>
                         <td className="p-6">4.10 / 7.0</td>
                         <td className="p-6 text-emerald-600 font-black">6.12 / 7.0</td>
                         <td className="p-6 font-mono text-xs">{"<"} 0.001</td>
                      </tr>
                      <tr>
                         <td className="p-6 font-bold text-slate-900">Purchase Intention</td>
                         <td className="p-6">3.88 / 7.0</td>
                         <td className="p-6 text-emerald-600 font-black">5.95 / 7.0</td>
                         <td className="p-6 font-mono text-xs">{"<"} 0.005</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">IV. Structural Equation Modeling (SEM) Analysis</h2>
             <p className="text-slate-600 mb-10 leading-relaxed">
                Chúng tôi sử dụng phân tích đa biến để xác định trọng số ảnh hưởng của các biến số. Kết quả cho thấy Sự minh bạch đóng vai trò trung gian hoàn toàn (Full Mediation) giữa Tín hiệu Blockchain và Niềm tin thương hiệu.
             </p>
             <div className="p-12 bg-slate-900 rounded-[4rem] flex flex-col items-center text-center space-y-8 shadow-2xl relative">
                <BarChart2 size={100} className="absolute -bottom-10 -right-10 text-emerald-500 opacity-10" />
                <div className="text-2xl md:text-4xl font-mono text-emerald-400 leading-relaxed tracking-tighter">
                   Trust = 0.54** · Transp + 0.32* · Signal + ε
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full pt-8 border-t border-slate-800">
                   <div className="space-y-1">
                      <div className="text-white font-black text-xl">0.942</div>
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">CFI</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-white font-black text-xl">0.041</div>
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">RMSEA</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-white font-black text-xl">0.910</div>
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">SRMR</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-white font-black text-xl">0.68</div>
                      <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest">R-Squared</div>
                   </div>
                </div>
             </div>
          </section>

          <section className="pt-12 border-t border-slate-100 space-y-6">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">V. Conclusion: From Logistics to Psychology</h3>
             <p className="text-slate-600 leading-relaxed font-light">
                Nghiên cứu này chứng minh rằng Blockchain không chỉ là một công cụ quản lý chuỗi cung ứng (Logistics) mà còn là một công cụ Marketing tâm lý mạnh mẽ. Đối với các sản phẩm nông sản có độ tham gia cao (High-involvement), việc cung cấp bằng chứng kỹ thuật bất biến là con đường ngắn nhất để chinh phục trái tim người tiêu dùng hiện đại.
             </p>
             <div className="flex flex-wrap gap-3">
                {['Signaling Theory', 'S-O-R Model', 'Blockchain Marketing', 'Consumer Trust'].map(tag => (
                   <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                      {tag}
                   </span>
                ))}
             </div>
          </section>
        </div>
      )
    },
    'blockchain-vs-traditional': {
      title: "Blockchain vs Truy xuất truyền thống: Sự khác biệt nằm ở đâu?",
      category: "Technical Analysis",
      date: "24/04/2026",
      author: "Team fwd LIFE",
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="space-y-12">
          <p className="text-2xl font-light text-slate-500 leading-relaxed border-l-4 border-amber-500 pl-8 italic">
             Tại sao SQL Database không đủ để bảo vệ nông sản Việt? Một cái nhìn sâu vào kiến trúc dữ liệu phi tập trung.
          </p>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">I. Lỗ hổng của hệ thống truy xuất truyền thống</h2>
             <p className="text-slate-600 leading-relaxed mb-6 font-light">
                Hầu hết các hệ thống "Truy xuất nguồn gốc" hiện nay tại Việt Nam thực chất chỉ là các Website hiển thị thông tin tĩnh. Dữ liệu được lưu trữ trong các cơ sở dữ liệu tập trung (MySQL, PostgreSQL) do chính doanh nghiệp quản lý. Điều này dẫn đến 3 vấn đề cốt lõi:
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-8 bg-amber-50 rounded-3xl space-y-4">
                   <AlertCircle className="text-amber-600" size={32} />
                   <h4 className="font-black text-slate-900 uppercase text-xs">Khả năng sửa đổi</h4>
                   <p className="text-xs text-slate-600 font-light leading-relaxed">Admin có thể thay đổi ngày thu hoạch hoặc nguồn gốc vùng trồng bất cứ lúc nào để "làm đẹp" hồ sơ.</p>
                </div>
                <div className="p-8 bg-amber-50 rounded-3xl space-y-4">
                   <Lock className="text-amber-600" size={32} />
                   <h4 className="font-black text-slate-900 uppercase text-xs">Thiếu bằng chứng</h4>
                   <p className="text-xs text-slate-600 font-light leading-relaxed">Dữ liệu được nhập thủ công, không có bằng chứng mã hóa đi kèm để xác nhận thời gian thực.</p>
                </div>
                <div className="p-8 bg-amber-50 rounded-3xl space-y-4">
                   <Database className="text-amber-600" size={32} />
                   <h4 className="font-black text-slate-900 uppercase text-xs">Sự độc quyền</h4>
                   <p className="text-xs text-slate-600 font-light leading-relaxed">Người tiêu dùng buộc phải tin vào những gì doanh nghiệp viết ra mà không có bên thứ ba giám sát độc lập.</p>
                </div>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">II. Kiến trúc Blockchain: Niềm tin thông qua thuật toán</h2>
             <p className="text-slate-600 mb-8 leading-relaxed">
                fwd LIFEchain thay thế "Niềm tin vào con người" bằng "Niềm tin vào toán học". Dưới đây là bảng so sánh kỹ thuật:
             </p>
             <div className="overflow-hidden rounded-[3rem] border border-slate-100 shadow-2xl">
                <table className="w-full text-left text-sm font-light">
                   <thead className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest">
                      <tr>
                         <th className="p-6">Tính chất</th>
                         <th className="p-6">Truy xuất truyền thống</th>
                         <th className="p-6 bg-emerald-800">fwd LIFEchain (PoO)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      <tr>
                         <td className="p-6 font-bold text-slate-900">Lưu trữ dữ liệu</td>
                         <td className="p-6 text-slate-500">Tập trung (Centralized)</td>
                         <td className="p-6 text-emerald-600 font-black italic">Phi tập trung (Decentralized)</td>
                      </tr>
                      <tr>
                         <td className="p-6 font-bold text-slate-900">Tính bất biến</td>
                         <td className="p-6 text-slate-500">Có thể sửa/xóa bởi Admin</td>
                         <td className="p-6 text-emerald-600 font-black italic">Bất biến (Immutable)</td>
                      </tr>
                      <tr>
                         <td className="p-6 font-bold text-slate-900">Xác thực thời gian</td>
                         <td className="p-6 text-slate-500">Tự nhập (Manual)</td>
                         <td className="p-6 text-emerald-600 font-black italic">Timestamp mã hóa (Proof-of-Time)</td>
                      </tr>
                      <tr>
                         <td className="p-6 font-bold text-slate-900">Tính minh bạch</td>
                         <td className="p-6 text-slate-500">Hạn chế, nội bộ</td>
                         <td className="p-6 text-emerald-600 font-black italic">Công khai toàn cầu (Explorer)</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </section>

          <section>
             <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">III. Deep Dive: Layer 2 Optimization</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="flex gap-4 items-start">
                      <div className="p-3 bg-slate-900 text-white rounded-xl"><Layers size={20} /></div>
                      <div>
                         <h4 className="font-black text-slate-900 text-sm uppercase">Batching Transactions</h4>
                         <p className="text-xs text-slate-500 font-light mt-1">Để giảm chi phí Gas cho nông dân, chúng tôi gom hàng nghìn nhật ký canh tác vào một lần xác thực (Rollup) lên Mainnet.</p>
                      </div>
                   </div>
                   <div className="flex gap-4 items-start">
                      <div className="p-3 bg-slate-900 text-white rounded-xl"><Cpu size={20} /></div>
                      <div>
                         <h4 className="font-black text-slate-900 text-sm uppercase">ST-PoO Consensus</h4>
                         <p className="text-xs text-slate-500 font-light mt-1">Thuật toán xác thực đa nhân tố: GPS + IoT Sensor + Chữ ký số của chủ vườn.</p>
                      </div>
                   </div>
                </div>
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-center items-center text-center space-y-4">
                   <ShieldCheck size={60} className="text-emerald-500" />
                   <h4 className="text-xl font-black text-slate-900">Security Audit 2026</h4>
                   <p className="text-xs text-slate-400 font-light leading-relaxed italic">
                      "Hệ thống fwd LIFEchain đã vượt qua các bài kiểm thử về khả năng chống tấn công Sybil và bảo vệ tính toàn vẹn của dữ liệu chuỗi cung ứng."
                   </p>
                </div>
             </div>
          </section>

          <section className="p-12 bg-emerald-50 rounded-[4rem] border border-emerald-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
             <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter italic">Từ cơ sở dữ liệu đến Niềm tin số</h3>
                <p className="text-sm text-emerald-700 font-light leading-relaxed">
                   Nếu bạn đang vận hành một hệ thống truy xuất nguồn gốc cũ, đã đến lúc nâng cấp lên Blockchain để bắt kịp xu hướng minh bạch toàn cầu. Đừng để dữ liệu của bạn nằm chết trong Excel.
                </p>
             </div>
             <button className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 whitespace-nowrap">
                Liên hệ nâng cấp hệ thống
             </button>
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
    <div className="min-h-screen bg-white text-slate-900 font-sans">
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
        <div className="space-y-10 mb-16">
           <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                 {article.category}
              </span>
              <div className="h-px flex-grow bg-slate-100"></div>
           </div>
           
           <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.0] tracking-tighter italic uppercase">
              {article.title}
           </h1>

           <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-y border-slate-100">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-black shadow-xl ring-4 ring-emerald-50">LH</div>
                 <div className="flex flex-col">
                    <span className="text-base font-black text-slate-900 uppercase tracking-tight">{article.author}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">fwd LIFEchain Thought Leadership</span>
                 </div>
              </div>
              <div className="flex items-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-2"><Calendar size={16} className="text-emerald-500" /> {article.date}</span>
                 <span className="hidden md:flex items-center gap-2"><User size={16} className="text-emerald-500" /> 12.5k Reads</span>
              </div>
           </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] rounded-[4rem] overflow-hidden mb-20 shadow-2xl bg-slate-100 group">
           <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Dynamic Content */}
        <article className="max-w-none">
           {article.content}
        </article>

        {/* Footer Navigation */}
        <div className="mt-24 pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
           <Link href="/news" className="group inline-flex items-center gap-3 text-xs font-black text-slate-900 uppercase tracking-[0.3em] hover:text-emerald-600 transition-all">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                 <ArrowRight className="rotate-180" size={16} />
              </div>
              Quay lại danh mục Insights
           </Link>
           
           <div className="flex items-center gap-8 text-slate-300">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Share this research:</span>
              <div className="flex items-center gap-5">
                 <Facebook size={20} className="cursor-pointer hover:text-blue-600 transition-all hover:scale-110" />
                 <Twitter size={20} className="cursor-pointer hover:text-blue-400 transition-all hover:scale-110" />
                 <Linkedin size={20} className="cursor-pointer hover:text-blue-700 transition-all hover:scale-110" />
              </div>
           </div>
        </div>

        {/* Recommended Reading */}
        <div className="mt-32 p-16 bg-slate-50 rounded-[4rem] border border-slate-100">
           <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-10 italic">Nghiên cứu liên quan</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {id !== 'research-st-poo' && (
                <Link href="/news/research-st-poo" className="group space-y-4">
                   <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Next Research</div>
                   <h5 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">Beyond Traceability: How Blockchain Signals Influence Trust</h5>
                   <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-2 transition-transform" />
                </Link>
              )}
              {id !== 'blockchain-vs-traditional' && (
                <Link href="/news/blockchain-vs-traditional" className="group space-y-4">
                   <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Technical Deep Dive</div>
                   <h5 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">Blockchain vs Truy xuất truyền thống: Sự khác biệt</h5>
                   <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-2 transition-transform" />
                </Link>
              )}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
