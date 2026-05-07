'use client';

import { useState } from 'react';
import { 
  Globe, Zap, ShieldCheck, Cpu, Server, 
  ArrowRight, Check, AlertCircle, Terminal, 
  Database, Activity, Lock, Wallet
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function BecomeValidatorPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: "Hardware Requirements", icon: Cpu },
    { id: 2, title: "Staking AGRI", icon: Wallet },
    { id: 3, title: "Node Configuration", icon: Terminal },
    { id: 4, title: "Final Activation", icon: Zap }
  ];

  const handleNext = () => {
    if (step < 4) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(step + 1);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-[#111b11] text-white border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/explorer" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
               <Globe size={18} />
            </div>
            <span className="font-black tracking-tighter text-xl">AgriChain<span className="text-emerald-500 text-xs ml-1 uppercase tracking-widest">Explorer</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
             <Link href="/explorer" className="hover:text-white transition-colors">Home</Link>
             <Link href="/explorer/nodes" className="hover:text-white transition-colors">Nodes</Link>
             <Link href="#" className="text-emerald-400">Join Network</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-16">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 mb-6"
           >
              <ShieldCheck size={12} /> SECURE THE NETWORK
           </motion.div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Trở thành Validator</h1>
           <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
             Tham gia vận hành mạng lưới AgriChain để bảo mật dữ liệu chuỗi cung ứng và nhận phần thưởng khối từ hệ sinh thái.
           </p>
        </div>

        {/* Multi-step Progress Bar */}
        <div className="relative mb-20">
           <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2"></div>
           <div className="relative flex justify-between">
              {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 transition-all duration-500 border-2 ${
                     step >= s.id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white border-slate-200 text-slate-400'
                   }`}>
                      {step > s.id ? <Check size={20} /> : <s.icon size={20} />}
                   </div>
                   <span className={`absolute -bottom-8 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                     step >= s.id ? 'text-slate-900' : 'text-slate-400'
                   }`}>
                      {s.title}
                   </span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-900/5 overflow-hidden min-h-[500px] flex flex-col">
           <div className="flex-grow p-8 md:p-16">
              <AnimatePresence mode="wait">
                 {isSubmitting ? (
                   <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="h-full flex flex-col items-center justify-center py-20"
                   >
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mb-8"
                      ></motion.div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Authenticating with AgriChain Core...</p>
                   </motion.div>
                 ) : (
                   <motion.div
                     key={step}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-10"
                   >
                      {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-6">
                              <h3 className="text-2xl font-bold">Cấu hình phần cứng tối thiểu</h3>
                              <p className="text-slate-500 font-light leading-relaxed">
                                Để đảm bảo mạng lưới vận hành ổn định, node của bạn cần đáp ứng các thông số kỹ thuật sau để xử lý hàng ngàn giao dịch mỗi giây.
                              </p>
                              <div className="space-y-4">
                                 {[
                                   { label: "CPU", value: "8 Cores @ 3.5GHz+" },
                                   { label: "RAM", value: "32GB DDR4 ECC" },
                                   { label: "Storage", value: "2TB NVMe SSD (Gen4)" },
                                   { label: "Network", value: "1Gbps Symmetric" }
                                 ].map((spec, i) => (
                                   <div key={i} className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{spec.label}</span>
                                      <span className="text-sm font-black text-slate-900">{spec.value}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                           <div className="bg-[#111b11] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-10">
                                 <Server size={120} />
                              </div>
                              <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-6">Cloud Providers</h4>
                              <p className="text-sm font-light opacity-80 mb-8 leading-relaxed">Chúng tôi khuyến khích sử dụng các dịch vụ hạ tầng chuyên nghiệp để đạt uptime 99.99%.</p>
                              <div className="space-y-3">
                                 {["AWS AgriInstance", "Google Cloud Node", "Azure Blockchain VM"].map((p, i) => (
                                   <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-bold">
                                      <Check size={14} className="text-emerald-400" /> {p}
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="max-w-2xl mx-auto space-y-8">
                           <div className="text-center">
                              <h3 className="text-2xl font-bold mb-4">Ký quỹ (Staking) AGRI</h3>
                              <p className="text-slate-500 font-light leading-relaxed">
                                Validator cần ký quỹ tối thiểu 32,000 AGRI để cam kết vận hành mạng lưới trung thực.
                              </p>
                           </div>
                           
                           <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl text-center relative overflow-hidden group">
                              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                              <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80">Minimum Required Stake</p>
                              <h2 className="text-5xl font-black mb-2">32,000 AGRI</h2>
                              <p className="text-sm opacity-80 font-bold tracking-widest">≈ $79,408.00 USD</p>
                              
                              <div className="mt-10 pt-10 border-t border-white/20 grid grid-cols-2 gap-4">
                                 <div className="text-left">
                                    <p className="text-[9px] font-bold uppercase opacity-60">Estimated APR</p>
                                    <p className="text-lg font-black text-white">8.42%</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[9px] font-bold uppercase opacity-60">Governance Power</p>
                                    <p className="text-lg font-black text-white">1.0x Weight</p>
                                 </div>
                              </div>
                           </div>

                           <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                              <AlertCircle className="text-amber-500 shrink-0" size={24} />
                              <p className="text-xs text-amber-900 leading-relaxed">
                                <span className="font-bold">Lưu ý:</span> Tiền ký quỹ sẽ bị "slashed" (khấu trừ) nếu node của bạn có hành vi gian lận hoặc offline quá lâu làm ảnh hưởng đến tính toàn vẹn của chuỗi cung ứng.
                              </p>
                           </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-8">
                           <div>
                              <h3 className="text-2xl font-bold mb-2">Cấu hình Node phần mềm</h3>
                              <p className="text-slate-500 font-light">Chạy các lệnh sau trên Server của bạn để khởi tạo node xác thực.</p>
                           </div>

                           <div className="bg-slate-900 rounded-3xl p-8 text-emerald-400 font-mono text-sm relative group">
                              <div className="absolute top-4 right-6 flex gap-2">
                                 <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                 <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-slate-500"># 1. Tải về bộ cài đặt AgriChain Core</p>
                                 <p>curl -sSL https://get.agrichain.io | bash</p>
                                 <p className="pt-4 text-slate-500"># 2. Khởi tạo danh tính Validator</p>
                                 <p>agrichain-cli init --name="Lâm_Đồng_Core_02" --network=mainnet</p>
                                 <p className="pt-4 text-slate-500"># 3. Kết nối ví staking</p>
                                 <p>agrichain-cli wallet connect 0x72d...a9e4</p>
                                 <p className="pt-4 text-slate-500"># 4. Bắt đầu quá trình đồng bộ</p>
                                 <p>agrichain-cli node start --sync=full</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { label: "P2P Port", value: "30303", icon: Globe },
                                { label: "RPC Port", value: "8545", icon: Activity },
                                { label: "Security", value: "TLS 1.3", icon: Lock }
                              ].map((item, i) => (
                                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                   <item.icon size={18} className="text-slate-400" />
                                   <div>
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                      <p className="text-sm font-bold text-slate-900 leading-none">{item.value}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="text-center py-10 space-y-8">
                           <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                              <Zap size={48} className="animate-pulse" />
                           </div>
                           <h3 className="text-3xl font-black">Mạng lưới đã sẵn sàng kích hoạt!</h3>
                           <p className="text-slate-500 max-w-lg mx-auto font-light leading-relaxed">
                             Node của bạn đã được cấu hình và lượng AGRI đã được khóa vào Smart Contract. Nhấn kích hoạt để bắt đầu tham gia đồng thuận.
                           </p>
                           
                           <div className="max-w-md mx-auto p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl text-left space-y-4">
                              <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase">Node ID</span>
                                 <span className="text-xs font-mono font-bold">AG-VN-8842-X</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase">Current Block</span>
                                 <span className="text-xs font-bold text-blue-600">19,482,415</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase">Network Status</span>
                                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sychronized ✅</span>
                              </div>
                           </div>
                        </div>
                      )}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>

           <div className="p-8 md:px-16 md:py-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <button 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1 || isSubmitting}
                className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors disabled:opacity-0"
              >
                 QUAY LẠI
              </button>
              
              <button 
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-5 bg-natural-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-natural-900/20 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
              >
                 {step === 4 ? 'KÍCH HOẠT NODE XÁC THỰC' : 'TIẾP TỤC BƯỚC KẾ'}
                 <ArrowRight size={20} />
              </button>
           </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AgriChain Validator Onboarding v3.0</p>
      </footer>
    </div>
  );
}
