'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye } from 'lucide-react';

export default function PrivacyPage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest">
              <Lock size={14} />
              <span>Data Protection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-natural-950 tracking-tighter uppercase italic">
              Chính sách <span className="text-emerald-600">Bảo mật</span>
            </h1>
            <p className="text-slate-500 font-medium">Cập nhật lần cuối: Ngày 07 tháng 05 năm 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">01</span>
                Thu thập Thông tin
              </h2>
              <p>
                fwd LIFEchain chỉ thu thập các thông tin cần thiết để định danh thực thể trên mạng lưới Blockchain, bao gồm: Địa chỉ ví (MetaMask), tên doanh nghiệp/hộ sản xuất, và các chứng chỉ chất lượng liên quan. Chúng tôi không thu thập thông tin cá nhân nhạy cảm ngoài phạm vi xác thực chuỗi cung ứng.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">02</span>
                Lưu trữ trên Blockchain
              </h2>
              <p>
                Dữ liệu về lô hàng (Batch Data) sau khi được xác thực sẽ được băm (hash) và lưu trữ vĩnh viễn trên sổ cái phi tập trung. Tính chất của Blockchain là không thể xóa bỏ, do đó các thông tin này sẽ được bảo tồn để phục vụ mục đích truy xuất và kiểm chứng cộng đồng.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">03</span>
                Bảo mật Tài khoản
              </h2>
              <p>
                Chúng tôi sử dụng cơ chế xác thực Web3 và Supabase Auth để đảm bảo an toàn tài khoản. Người dùng tự chịu trách nhiệm bảo quản khóa bí mật (Private Key) của ví cá nhân. fwd LIFEchain không bao giờ yêu cầu bạn cung cấp khóa bí mật.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">04</span>
                Quyền của Chủ thể Dữ liệu
              </h2>
              <p>
                Bạn có quyền yêu cầu trích xuất dữ liệu liên quan đến thực thể của mình hoặc yêu cầu hỗ trợ kỹ thuật khi có sai sót trong quá trình đồng bộ hóa dữ liệu off-chain.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
