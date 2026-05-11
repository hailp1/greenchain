'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Cookie, Activity } from 'lucide-react';

export default function CookiePage() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest">
              <Cookie size={14} />
              <span>User Experience</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-natural-950 tracking-tighter uppercase italic">
              Chính sách <span className="text-amber-600">Cookies</span>
            </h1>
            <p className="text-slate-500 font-medium">Cập nhật lần cuối: Ngày 07 tháng 05 năm 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">01</span>
                Cookies là gì?
              </h2>
              <p>
                Cookies là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập Green Chain. Chúng giúp hệ thống ghi nhớ trạng thái đăng nhập và các tùy chỉnh giao diện để cung cấp trải nghiệm mượt mà hơn.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">02</span>
                Cách chúng tôi sử dụng Cookies
              </h2>
              <p>
                Chúng tôi sử dụng cookies cho các mục đích:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Xác thực:</strong> Duy trì phiên đăng nhập và kết nối với ví MetaMask.</li>
                <li><strong>Phân tích:</strong> Theo dõi lưu lượng truy cập ẩn danh để cải thiện cấu trúc của Blockchain Explorer.</li>
                <li><strong>Tùy chọn:</strong> Ghi nhớ ngôn ngữ và chế độ hiển thị ưa thích của bạn.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-natural-900 uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">03</span>
                Quản lý Cookies
              </h2>
              <p>
                Hầu hết các trình duyệt cho phép bạn kiểm soát cookies thông qua cài đặt của chúng. Tuy nhiên, nếu bạn từ chối cookies, một số tính năng như tự động kết nối ví hoặc duy trì phiên làm việc trên Portal có thể không hoạt động ổn định.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
