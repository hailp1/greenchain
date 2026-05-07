'use client';

import { useState } from 'react';
import { 
  Globe, Code, Terminal, Zap, Book, 
  Copy, CheckCircle2, Search, Menu, X, Cpu, Database
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function APIsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const endpoints = [
    { method: "GET", path: "/api/v3/block/{height}", desc: "Truy vấn thông tin chi tiết của một khối theo chiều cao." },
    { method: "GET", path: "/api/v3/tx/{hash}", desc: "Lấy dữ liệu giao dịch đã được giải mã và trạng thái xác thực." },
    { method: "GET", path: "/api/v3/product/{id}", desc: "Truy xuất toàn bộ hành trình sản phẩm (Product Journey) và mã Hash." },
    { method: "POST", path: "/api/v3/nodes/status", desc: "Cập nhật và kiểm tra trạng thái hoạt động của Validator Node." }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-[#111b11] text-white border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl">AgriChain<span className="text-emerald-500 text-xs ml-1 uppercase tracking-widest">Explorer</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
             <Link href="/explorer" className="hover:text-white transition-colors">Home</Link>
             <Link href="/explorer/apis" className="text-emerald-400">APIs</Link>
             <Link href="/explorer/resources" className="hover:text-white transition-colors">Resources</Link>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
             {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="mb-16">
           <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Developer <span className="text-emerald-500">APIs</span></h1>
           <p className="text-slate-500 text-sm max-w-2xl">Tích hợp dữ liệu blockchain AgriChain trực tiếp vào ứng dụng của bạn thông qua hệ thống API RESTful hiệu suất cao.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
                 <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><Terminal size={16} className="text-emerald-500" /> REST API Endpoints</h2>
                    <span className="text-[10px] font-bold text-slate-400">v3.0.0-stable</span>
                 </div>
                 <div className="p-8 space-y-6">
                    {endpoints.map((api, i) => (
                      <div key={i} className="group p-6 rounded-2xl border border-slate-100 hover:border-emerald-500/20 transition-all">
                         <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                               <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${api.method === 'GET' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>{api.method}</span>
                               <code className="text-xs font-mono font-bold text-natural-900">{api.path}</code>
                            </div>
                            <button onClick={() => handleCopy(api.path)} className="text-slate-300 hover:text-emerald-500 transition-colors">
                               {copied === api.path ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                            </button>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed">{api.desc}</p>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10"><Code size={80} /></div>
                 <h2 className="text-xl font-black mb-6 uppercase italic">Quick Start Code</h2>
                 <pre className="text-xs font-mono text-emerald-400/80 leading-relaxed overflow-x-auto p-6 bg-black/40 rounded-2xl border border-white/5">
{`// Example Fetch using Javascript
const getProductJourney = async (id) => {
  const response = await fetch(\`https://api.agrichain.com/v3/product/\${id}\`);
  const data = await response.json();
  console.log("Verified Journey:", data.nodes);
};

// Response Object
{
  "status": "success",
  "data": {
    "id": "TEA-001",
    "hash": "0x5e1b...b8e0",
    "verified": true
  }
}`}
                 </pre>
              </section>
           </div>

           <div className="space-y-8">
              <div className="p-8 bg-emerald-500 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-500/20">
                 <Zap size={32} className="mb-6" />
                 <h3 className="text-xl font-black mb-2 tracking-tighter uppercase italic">Websocket Support</h3>
                 <p className="text-sm text-emerald-50/80 leading-relaxed mb-8">Lắng nghe các sự kiện mint block và xác nhận giao dịch trong thời gian thực thông qua kết nối WSS.</p>
                 <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">
                    GET API KEY
                 </button>
              </div>

              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
                 <h3 className="text-xs font-black uppercase tracking-widest mb-6">Rate Limits</h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                       <span className="text-xs font-bold text-slate-500">Free Tier</span>
                       <span className="text-xs font-black">10k req/day</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                       <span className="text-xs font-bold text-slate-500">Validator</span>
                       <span className="text-xs font-black">Unlimited</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-500">Response Time</span>
                       <span className="text-xs font-black text-emerald-500">&lt; 50ms</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
