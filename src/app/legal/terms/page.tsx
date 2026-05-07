'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Lock } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a2f1a]">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-natural-900 text-white text-[10px] font-black uppercase tracking-widest">
              <FileText size={14} />
              <span>Legal Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-natural-950 tracking-tighter uppercase italic">
              Điều khoản <span className="text-emerald-600">Sử dụng</span>
            </h1>
            <p className="text-slate-500 font-medium">Cập nhật lần cuối: Ngày 07 tháng 05 năm 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">01</span>
                Chấp nhận Điều khoản
              </h2>
              <p>
                Bằng việc truy cập và sử dụng nền tảng fwd LIFEchain, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định tại đây. Nền tảng này được vận hành như một phần của dự án nghiên cứu khoa học, nhằm mục đích minh bạch hóa chuỗi cung ứng nông sản.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">02</span>
                Quyền Sở hữu Trí tuệ
              </h2>
              <p>
                Toàn bộ nội dung, thuật toán mã hóa, và cấu trúc dữ liệu trên fwd LIFEchain thuộc sở hữu của NCS Lê Phúc Hải và dự án nghiên cứu. Việc sao chép hoặc sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn bản là vi phạm bản quyền.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">03</span>
                Trách nhiệm Người dùng
              </h2>
              <p>
                Người dùng (bao gồm Nhà sản xuất và Cơ quan kiểm định) chịu trách nhiệm hoàn toàn về tính xác thực của dữ liệu đưa lên Blockchain. Mọi hành vi gian lận dữ liệu sẽ bị ghi vết vĩnh viễn trên sổ cái và có thể dẫn đến việc khóa tài khoản thực thể.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">04</span>
                Giới hạn Trách nhiệm
              </h2>
              <p>
                Vì đây là hệ thống đang trong giai đoạn nghiên cứu và thử nghiệm (Research Prototype), chúng tôi không chịu trách nhiệm về bất kỳ tổn thất trực tiếp hay gián tiếp nào phát sinh từ việc sử dụng nền tảng trong các giao dịch thương mại thực tế bên ngoài phạm vi thử nghiệm.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
