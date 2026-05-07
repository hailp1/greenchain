'use client';

import { useState, useEffect, use } from 'react';
import { db, Product, BlockchainNode } from '@/lib/store/nosql-sim';
import { 
  ArrowLeft, ShieldCheck, MapPin, FileText, ImageIcon, ExternalLink, 
  Hash, Clock, Globe, Fingerprint, Activity, Layers, Sparkles, 
  Leaf, Package, Zap, Thermometer, Droplets, BarChart3, TrendingUp, Heart, Download,
  Box, ChevronRight, Copy, X, QrCode, Check,  Info, ShoppingCart, Factory, Beaker, Truck, Home, CheckCircle2,
  FileCode, Terminal, Code
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedNode, setSelectedNode] = useState<BlockchainNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(true);
  const [showHashModal, setShowHashModal] = useState(false);
  const [showExplorer, setShowExplorer] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { id } = unwrappedParams;
      const data = await db.findOne('products', { id });
      
      // Simulate scanning animation
      setTimeout(() => {
        setIsScanning(false);
        setIsAuditing(true);
        setProduct(data);
        if (data && data.nodes.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
        
        // Start audit progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setAuditProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsAuditing(false);
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#10b981', '#3b82f6', '#fdfcf8']
              });
            }, 800);
          }
        }, 50);
        
        setLoading(false);
      }, 2000);
    };
    fetchData();
  }, [unwrappedParams]);

  if (isScanning) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-natural-900 text-white p-6">
       <motion.div 
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="relative w-32 h-32 md:w-48 md:h-48 mb-8 md:mb-12"
       >
         <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-3xl"></div>
         <motion.div 
           animate={{ top: ['0%', '100%', '0%'] }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-10"
         ></motion.div>
         <div className="absolute inset-4 flex items-center justify-center">
            <Fingerprint size={60} className="md:size-20 text-emerald-400 opacity-50" />
         </div>
       </motion.div>
       <h2 className="text-xl md:text-2xl font-bold mb-2 tracking-tight text-center">Đang truy vấn chuỗi khối...</h2>
       <p className="text-slate-400 text-xs md:text-sm font-light text-center">Vui lòng chờ trong giây lát để xác thực mã định danh.</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf8] p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-natural-900">Không tìm thấy sản phẩm</h1>
        <Link href="/" className="text-natural-500 hover:underline mt-4 inline-block font-bold">Quay lại trang chủ</Link>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#fdfcf8] text-[#1a2f1a] pb-12 md:pb-24">
      {/* Initial Audit Overlay */}
      <AnimatePresence>
        {isAuditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-24 h-24 relative mb-8">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-4 border-slate-100 border-t-emerald-500 rounded-full"
               ></motion.div>
               <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={40} />
               </div>
            </div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic mb-2">Đang đối soát <span className="text-emerald-500">LifeChain</span></h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Xác thực giá trị thông qua Farm · Worth · Driven...</p>
            <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
               <motion.div 
                 className="h-full bg-emerald-500"
                 initial={{ width: 0 }}
                 animate={{ width: `${auditProgress}%` }}
               ></motion.div>
            </div>
            <p className="mt-4 text-[10px] font-mono text-slate-300 uppercase tracking-widest">{auditProgress}% SECURED</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />
      
      {/* Verify Info Bar */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 md:px-6 py-2 mt-20 print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
             <Layers size={10} />
             FWD PROTOCOL: {product.nodes?.[0]?.hash?.substring(0, 10) || '0x...'}...
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
               <Layers size={12} />
               FWD PROTOCOL: {product.nodes?.[0]?.hash?.substring(0, 10) || '0x...'}...
            </div>
            <div className="px-3 py-1.5 md:px-5 md:py-2 rounded-full bg-emerald-500 text-white text-[9px] md:text-[11px] font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2">
              <ShieldCheck size={14} /> XÁC THỰC BLOCKCHAIN
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-12 print:p-0">
        <section className="mb-8 md:mb-16 print:hidden">
                    {/* Interactive Supply Chain Map */}
                    <div className="mb-20">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-natural-900 text-white flex items-center justify-center shadow-lg">
                               <MapPin size={16} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-natural-900 italic">Hành trình Sản phẩm (Geographic Path)</h3>
                         </div>
                         <div className="flex gap-2">
                            {['Authenticated', 'Verified', 'Transparent'].map((badge) => (
                              <div key={badge} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                                 {badge}
                              </div>
                            ))}
                         </div>
                      </div>
                      
                      <div className="relative p-12 md:p-20 rounded-[4rem] bg-natural-50 border border-natural-100 overflow-hidden shadow-inner">
                         {/* Connection Line */}
                         <div className="absolute top-1/2 left-20 right-20 h-[2px] bg-slate-200 -translate-y-1/2 hidden md:block">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '100%' }}
                              transition={{ duration: 2, ease: "easeInOut" }}
                              className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            />
                         </div>

                         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
                            {[
                              { label: "Nông trại", sub: "Lạc Dương", icon: Home, color: "bg-emerald-500" },
                              { label: "Kiểm định", sub: "Lab Test", icon: Beaker, color: "bg-blue-500" },
                              { label: "Nhà máy", sub: "Chế biến", icon: Factory, color: "bg-amber-500" },
                              { label: "Logistics", sub: "Phân phối", icon: Truck, color: "bg-purple-500" },
                              { label: "Cửa hàng", sub: "Retail", icon: ShoppingCart, color: "bg-natural-900" }
                            ].map((step, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className="flex flex-col items-center gap-4 text-center group"
                              >
                                 <div className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl ${step.color} text-white flex items-center justify-center shadow-2xl shadow-slate-900/10 group-hover:-translate-y-2 transition-all relative`}>
                                    <step.icon size={28} />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-lg scale-0 group-hover:scale-100 transition-transform">
                                       <CheckCircle2 size={14} />
                                    </div>
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-natural-900 mb-0.5">{step.label}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{step.sub}</p>
                                 </div>
                              </motion.div>
                            ))}
                         </div>
                      </div>
                    </div>

                    {/* Core Tech Insights Dashboard */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              >
                 {[
                   { 
                     title: "Immutable Ledger", 
                     tech: "BLOCKCHAIN", 
                     desc: "Dữ liệu được khóa vĩnh viễn, không thể chỉnh sửa hay làm giả.",
                     icon: ShieldCheck,
                     color: "text-emerald-500",
                     bg: "bg-emerald-500/5"
                   },
                   { 
                     title: "Live Telemetry", 
                     tech: "IOT NETWORK", 
                     desc: "Thông tin trực tiếp từ cảm biến tại vườn, loại bỏ sai sót con người.",
                     icon: Activity,
                     color: "text-blue-500",
                     bg: "bg-blue-500/5"
                   },
                   { 
                     title: "Quality Audit", 
                     tech: "AI ANALYSIS", 
                     desc: "Trí tuệ nhân tạo kiểm định chất lượng và độ thuần khiết tự động.",
                     icon: Sparkles,
                     color: "text-purple-500",
                     bg: "bg-purple-500/5"
                   }
                 ].map((t, i) => (
                   <div key={i} className={`p-6 rounded-[2rem] ${t.bg} border border-white/10 group hover:bg-white transition-all duration-500 cursor-help relative overflow-hidden`}>
                      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                         <t.icon size={120} />
                      </div>
                      <t.icon className={`${t.color} mb-4`} size={32} />
                      <p className="text-[9px] font-black tracking-[0.2em] uppercase text-slate-400 mb-1">{t.tech}</p>
                      <h4 className="text-sm font-black text-natural-900 uppercase italic mb-2 tracking-tight">{t.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{t.desc}</p>
                   </div>
                 ))}
              </motion.div>

              {/* Action Tabs & Verification */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="space-y-1">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 group cursor-help">
                <Layers size={12} className="text-natural-900" />
                Hệ thống xác thực minh bạch
                <div className="relative group/tooltip">
                   <Info size={10} className="text-slate-300" />
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-natural-900 text-white text-[8px] font-bold rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                      Blockchain ghi lại mọi bước đi của sản phẩm, không thể thay đổi hoặc làm giả.
                   </div>
                </div>
              </h2>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Global Ledger Identity: 0x72a...d94e</p>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 shadow-sm shadow-emerald-500/5">
              <ShieldCheck size={10} />
              SECURED BY ETHEREUM
            </div>
          </div>

          <div className="relative">
            {/* Horizontal Connector Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 hidden lg:block">
              <motion.div 
                animate={{ left: ['-20%', '120%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-10"
              ></motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-20">
              {product.nodes.map((node, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedNode(node)}
                  className={`relative p-5 rounded-[2rem] cursor-pointer transition-all duration-300 border group ${
                    selectedNode === node 
                    ? 'bg-white border-natural-200 shadow-[0_20px_50px_-12px_rgba(26,47,26,0.1)] ring-1 ring-natural-500/10' 
                    : 'bg-white/40 border-slate-100 opacity-60 hover:opacity-100 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                        selectedNode === node 
                        ? 'bg-natural-900 border-natural-900 text-white shadow-lg' 
                        : 'bg-white border-slate-100 text-slate-300'
                      }`}>
                         {i === 0 ? <Package size={16} /> : i === product.nodes.length - 1 ? <Globe size={16} /> : <Zap size={16} />}
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                         {[1,2].map(dot => (
                           <div key={dot} className={`w-1 h-1 rounded-full border border-white ${selectedNode === node ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                         ))}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                       <div className="flex items-center gap-2 mb-0.5">
                          <p className={`text-[7px] font-black uppercase tracking-widest ${selectedNode === node ? 'text-emerald-500' : 'text-slate-400'}`}>{node.type}</p>
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[6px] font-black">
                             <Check size={6} /> SIGNED
                          </div>
                       </div>
                       <h4 className={`text-[11px] font-black truncate ${selectedNode === node ? 'text-natural-900' : 'text-slate-500'}`}>{node.title}</h4>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                       <Clock size={8} className="text-slate-300" />
                       <span className="text-[8px] text-slate-400 font-bold uppercase">
                         {new Date(node.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                       </span>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedNode === node ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 print:hidden">
          
          {/* Left Column: Product Sidebar */}
          <div className="lg:col-span-4 space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {product.image && (
                <div className="mb-6 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl aspect-square bg-white relative group">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {/* High-tech scanning beam */}
                  <motion.div 
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-10 opacity-50"
                  ></motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-natural-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              )}
              <div className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-lg bg-natural-100 text-natural-600 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-3 md:mb-4">
                {product.category}
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-natural-950 mb-6 md:mb-8 tracking-tighter leading-tight">{product.name}</h1>
              
              <div className="space-y-4 md:space-y-6">
                <div className="natural-card p-6 md:p-8 bg-white shadow-xl shadow-natural-900/5 border-natural-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Fingerprint size={60} />
                  </div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 md:mb-6">Thông số kỹ thuật</h3>
                  <div className="space-y-3 md:space-y-4">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-xs md:text-sm border-b border-slate-50 pb-2 md:pb-3 last:border-0 last:pb-0">
                        <span className="text-slate-400 font-medium capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-bold text-natural-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-blue-50 border border-blue-100 flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest">Health Score</p>
                    <p className="text-xs md:text-sm font-bold text-blue-900">100% Nguyên Chất</p>
                  </div>
                </div>

                {product.sustainability && (
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-900 via-emerald-950 to-black text-white shadow-2xl shadow-emerald-900/40 relative overflow-hidden group"
                    >
                       {/* Animated Glow */}
                       <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                       
                       <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 border border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                               <Leaf size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Sustainability Index</span>
                         </div>
                         
                         <div className="flex items-end gap-3 mb-4">
                            <motion.span 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-6xl font-black tracking-tighter"
                            >
                              {product.sustainability.score}
                            </motion.span>
                            <span className="text-xl font-bold text-emerald-400/60 mb-2">/100</span>
                         </div>
                         
                         <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden backdrop-blur-md border border-white/5 p-0.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${product.sustainability.score}%` }}
                              transition={{ duration: 2, ease: "circOut" }}
                              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.5)]"
                            ></motion.div>
                         </div>
                         
                         <div className="mt-8 flex items-center justify-between">
                            <div className="flex -space-x-2">
                               {[1,2,3].map(i => (
                                 <div key={i} className="w-6 h-6 rounded-full border-2 border-emerald-950 bg-emerald-800 flex items-center justify-center">
                                    <ShieldCheck size={10} className="text-emerald-400" />
                                 </div>
                               ))}
                            </div>
                            <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Global Verified</p>
                         </div>
                       </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-natural-900/5 relative overflow-hidden"
                    >
                       <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-natural-50 rounded-full blur-[40px] opacity-50"></div>
                       
                       <div className="relative z-10">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-natural-900 text-white flex items-center justify-center shadow-lg shadow-natural-900/20">
                               <Sparkles size={18} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-natural-900">AI Deep Analysis</span>
                         </div>
                         
                         <div className="relative p-5 bg-natural-50/50 rounded-2xl border border-natural-100/50">
                            <div className="absolute -left-1 top-4 w-1 h-8 bg-natural-900 rounded-full"></div>
                            <p className="text-sm text-natural-900 font-medium leading-relaxed italic">
                              "{product.sustainability.ai_insight}"
                            </p>
                         </div>
                         
                         <div className="mt-8 grid grid-cols-2 gap-4">
                            {[
                              { label: "Carbon", value: product.sustainability.carbon_footprint, icon: Globe },
                              { label: "Water", value: product.sustainability.water_saved, icon: Activity },
                              { label: "Social", value: product.sustainability.social_impact, icon: Heart }
                            ].map((m, i) => (
                              <div key={i} className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-natural-900/20 transition-all hover:shadow-lg">
                                 <div className="flex items-center gap-2 mb-2">
                                    <m.icon size={12} className="text-slate-300" />
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                                 </div>
                                 <p className="text-[10px] font-black text-natural-900 leading-tight">{m.value}</p>
                              </div>
                            ))}
                         </div>
                       </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right Column: Interactive Node Detail Viewer */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedNode && (
                <motion.div 
                  key={selectedNode.id || selectedNode.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[500px] md:min-h-[700px] flex flex-col relative"
                >
                  {/* Immersive Banner */}
                  <div className="h-64 md:h-[400px] relative overflow-hidden group">
                    <motion.img 
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      src={selectedNode.images[0]} 
                      alt={selectedNode.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-natural-950 via-natural-950/40 to-transparent"></div>
                    
                    {/* Floating Tech Elements */}
                    <div className="absolute top-6 right-6 flex gap-2">
                       <div className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          Node #42 Active
                       </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 md:bottom-16 md:left-16 md:right-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                      <div className="max-w-2xl">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex flex-wrap items-center gap-3 mb-4"
                        >
                           <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] border border-white/20">
                             {selectedNode.type}
                           </span>
                           <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/40">
                             Verified Origin
                           </span>
                        </motion.div>
                        <motion.h2 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight italic uppercase"
                        >
                          {selectedNode.title}
                        </motion.h2>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:items-end gap-4"
                      >
                         <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 text-white/90 text-[11px] font-mono shadow-2xl">
                            <Fingerprint size={16} className="text-emerald-400" />
                            <span className="opacity-60">TX:</span> {selectedNode.hash.substring(0, 24)}...
                         </div>
                         <div className="flex items-center gap-6 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-help"><Globe size={12} /> IPFS Secured</span>
                            <span className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-help"><ShieldCheck size={12} /> Signed by Node</span>
                         </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Blockchain Binding Bar */}
                  <div className="bg-emerald-500/5 border-b border-emerald-500/10 p-6 md:px-16 flex flex-wrap items-center justify-between gap-6">
                     <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></div>
                        <div className="space-y-0.5">
                           <span className="block text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em]">DỮ LIỆU ĐƯỢC BẢO CHỨNG BỞI SMART CONTRACT</span>
                           <span className="block text-[9px] font-bold text-emerald-600/40 uppercase tracking-widest">Protocol Version: 2.4.0 • Secured by NCS Ledger</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-12">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Digital Signature</span>
                           <span className="text-xs font-mono text-natural-900 font-bold bg-white px-3 py-1 rounded-lg border border-slate-100">0x7F2...D9C4</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Merkle Proof</span>
                           <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-2">
                              <Check size={12} /> MATCHED
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 flex-grow">
                    {/* Detailed Context */}
                    <div className="space-y-8 md:space-y-12">
                      <div>
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 md:mb-6">Mô tả quy trình</h3>
                        <p className="text-slate-600 leading-relaxed text-xs md:text-sm font-light">
                          {selectedNode.description}
                        </p>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                        <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-natural-50 border border-natural-100 flex items-start gap-4 md:gap-5">
                           <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-natural-500 shadow-sm shrink-0">
                             <MapPin size={20} />
                           </div>
                           <div>
                             <p className="text-[8px] md:text-[10px] font-black text-natural-400 uppercase tracking-widest mb-1">Vị trí thực tế</p>
                             <p className="text-sm md:text-base font-bold text-natural-900 leading-tight">{selectedNode.location}</p>
                             <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-full text-[8px] md:text-[10px] font-mono text-slate-500 border border-slate-100">
                                <Globe size={10} /> {selectedNode.coordinates}
                             </div>
                           </div>
                        </div>

                        {/* Digital Identity Authentication Card */}
                        <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-900/5 group hover:border-emerald-500/20 transition-all">
                           <div className="flex items-center justify-between mb-6">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Identity Proof</p>
                              <div className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-black">
                                 <ShieldCheck size={12} /> AUTHENTICATED
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                 <Fingerprint size={24} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-[11px] font-black text-natural-900">Validator: 0x82f1...a12c</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Multi-sig Identity</p>
                              </div>
                           </div>
                        </div>

                        {/* Network Vital Signs (Telemetry Grid) */}
                        {selectedNode.telemetry && selectedNode.telemetry.length > 0 && (
                          <div className="space-y-6">
                             <div className="flex items-center gap-2 mb-4">
                                <Activity size={14} className="text-emerald-500" />
                                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Network Vital Signs (IoT)</h3>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {selectedNode.telemetry.map((t, idx) => (
                                  <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-900/5 relative overflow-hidden group"
                                  >
                                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Zap size={40} />
                                     </div>
                                     <div className="relative z-10">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.label}</p>
                                        <div className="flex items-end gap-1 mb-4">
                                           <span className="text-3xl font-black text-natural-900 tracking-tighter">{t.data[t.data.length - 1].value}</span>
                                           <span className="text-xs font-bold text-slate-300 mb-1">{t.unit}</span>
                                        </div>
                                        <div className="flex items-end gap-1 h-8">
                                           {t.data.map((d, i) => (
                                             <div 
                                               key={i} 
                                               style={{ height: `${(d.value / Math.max(...t.data.map(v => v.value))) * 100}%` }}
                                               className="flex-1 bg-emerald-500/20 rounded-t-sm group-hover:bg-emerald-500/40 transition-colors"
                                             ></div>
                                           ))}
                                        </div>
                                     </div>
                                  </motion.div>
                                ))}
                             </div>
                          </div>
                        )}

                        <div className="p-6 md:p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black text-white relative overflow-hidden group border border-white/5 shadow-2xl">
                            {/* Scanning pulse */}
                            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none"></div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                              <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                   {[
                                     { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/20" },
                                     { icon: Activity, color: "text-blue-500", bg: "bg-blue-500/20" },
                                     { icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/20" }
                                   ].map((t, i) => (
                                     <div key={i} className={`w-10 h-10 rounded-full ${t.bg} border-2 border-slate-900 flex items-center justify-center shadow-lg`}>
                                        <t.icon size={16} className={t.color} />
                                     </div>
                                   ))}
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Convergence Protocol</p>
                                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic">Blockchain + IoT + AI Secured</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setShowHashModal(true)}
                                className="text-[10px] font-black text-natural-900 bg-emerald-400 px-4 py-2 rounded-xl hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(52,211,153,0.4)] flex items-center gap-2 active:scale-95 w-full md:w-auto justify-center"
                              >
                                <Hash size={14} /> KIỂM CHỨNG ETH
                              </button>
                            </div>
                            <div className="bg-black/50 p-4 rounded-2xl border border-white/5 relative z-10 mb-4">
                               <p className="text-[10px] md:text-sm font-mono text-emerald-400/90 break-all leading-relaxed tracking-wider">
                                 {selectedNode.hash}
                               </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                               <button 
                                 onClick={() => setShowExplorer(true)}
                                 className="py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-2 transition-all border border-white/5"
                               >
                                  <ExternalLink size={12} /> EXPLORER
                               </button>
                               <button 
                                 onClick={() => setShowRawData(true)}
                                 className="py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-2 transition-all border border-white/5"
                               >
                                  <FileCode size={12} /> RAW DATA
                               </button>
                            </div>
                         </div>

                         {/* Network Consensus Proof */}
                         <div className="p-6 rounded-[2rem] bg-natural-900 text-white border border-white/5 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                               <Layers size={40} />
                            </div>
                            <div className="relative z-10">
                               <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-4">Network Consensus Protocol</p>
                               <div className="flex items-center gap-6">
                                  <div className="flex -space-x-2">
                                     {[1,2,3,4].map(i => (
                                       <div key={i} className="w-8 h-8 rounded-full bg-natural-800 border-2 border-natural-900 flex items-center justify-center text-[10px] font-black text-emerald-500">
                                          N{i}
                                       </div>
                                     ))}
                                     <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-natural-900 flex items-center justify-center text-[10px] font-black text-white">
                                        +11
                                     </div>
                                  </div>
                                  <div>
                                     <p className="text-sm font-black">12/15 Nodes Confirmed</p>
                                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Mechanism: Proof of Authority (PoA)</p>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Visual Evidence & Paperwork */}
                    <div className="space-y-8 md:space-y-12">
                      <div>
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 md:mb-6">Bảo chứng kỹ thuật số (Paperwork)</h3>
                        <div className="grid grid-cols-1 gap-2 md:gap-3">
                          {selectedNode.documents.map((doc, i) => (
                            <motion.a 
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              key={i}
                              href={doc.url}
                              className="flex items-center justify-between p-4 rounded-xl md:rounded-2xl bg-white border border-slate-100 hover:border-natural-900 transition-all shadow-sm group"
                            >
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-natural-50 group-hover:text-natural-600 transition-colors shrink-0">
                                   <FileText size={18} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 truncate max-w-[150px] sm:max-w-none">{doc.name}</span>
                              </div>
                              <ExternalLink size={16} className="text-slate-300 group-hover:text-natural-900 shrink-0" />
                            </motion.a>
                          ))}
                        </div>

                        {/* Merkle Binding Certificate */}
                        <div className="mt-6 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                           <div className="flex items-center gap-2 mb-4">
                              <ShieldCheck size={16} className="text-emerald-500" />
                              <span className="text-[10px] font-black text-natural-900 uppercase tracking-widest">Blockchain Binding</span>
                           </div>
                           <div className="space-y-2.5">
                              <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg border border-white">
                                 <span className="text-[8px] font-bold text-slate-400 uppercase">Storage</span>
                                 <span className="text-[9px] font-bold text-blue-500 font-mono">IPFS://QmXo...Z2a</span>
                              </div>
                              <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg border border-white">
                                 <span className="text-[8px] font-bold text-slate-400 uppercase">Verification</span>
                                 <span className="text-[9px] font-bold text-emerald-500">SIGNED & LOCKED 🔒</span>
                              </div>
                           </div>
                        </div>

                        <button className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:border-natural-900 hover:text-natural-900 transition-all flex items-center justify-center gap-2 group">
                           <Download size={16} className="group-hover:animate-bounce" /> XUẤT CHỨNG CHỈ SỐ (PDF)
                        </button>
                      </div>

                      <div>
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 md:mb-6">Hình ảnh lưu trữ</h3>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                          {selectedNode.images.map((img, i) => (
                            <motion.div 
                              key={i} 
                              whileHover={{ scale: 1.05 }}
                              className="aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in"
                            >
                              <img src={img} className="w-full h-full object-cover" alt="Verification Evidence" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col items-center gap-6"
            >
               <div className="h-[1px] w-32 bg-slate-100"></div>
               <Link href="/" className="px-10 py-5 bg-natural-900 text-white rounded-[2rem] font-bold flex items-center gap-3 shadow-2xl shadow-natural-900/30 hover:-translate-y-1 hover:bg-black transition-all active:scale-95 group print:hidden">
                  <QrCode size={20} className="group-hover:rotate-12 transition-transform" /> 
                  <span>QUÉT SẢN PHẨM KHÁC</span>
               </Link>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] print:hidden">End of Blockchain Record</p>
            {/* Premium Digital Product Passport (DPP) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 relative group print:mt-0"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 print:hidden"></div>
              
              <div className="relative p-1 md:p-1.5 rounded-[3rem] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl overflow-hidden print:shadow-none print:border-none print:bg-white print:p-0">
                <div className="bg-natural-900 rounded-[2.8rem] p-8 md:p-12 text-white relative overflow-hidden print:bg-white print:text-black print:p-0 print:rounded-none">
                  
                  {/* Animated Background Grid */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10"></div>

                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-[0.2em]">
                           <ShieldCheck size={14} /> 100% TRACEABLE ORIGIN
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">
                          Digital <span className="text-emerald-500">Passport</span>
                        </h2>
                        <p className="text-slate-400 text-xs md:text-sm max-w-md font-light leading-relaxed">
                          Chứng thư định danh số duy nhất của sản phẩm trên nền tảng AgriChain Core, bảo chứng bởi công nghệ Blockchain và IoT.
                        </p>
                      </div>
                      
                      <div className="w-full md:w-auto p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center gap-4">
                         <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            <QrCode size={112} className="text-natural-900" />
                         </div>
                         <div className="text-center">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Passport ID</p>
                            <p className="text-xs font-mono font-bold text-emerald-400">AGRI-{product.id}-7721</p>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                       {[
                         { label: "Product DNA", value: "Premium Grade AAA", icon: Leaf, color: "text-emerald-400" },
                         { label: "Provenance Proof", value: "Verified Immutable", icon: ShieldCheck, color: "text-blue-400" },
                         { label: "Ecological Impact", value: "Net Zero Path", icon: Sparkles, color: "text-purple-400" }
                       ].map((item, i) => (
                         <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/item">
                            <item.icon size={24} className={`${item.color} mb-4 group-hover/item:scale-110 transition-transform`} />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-white uppercase">{item.value}</p>
                         </div>
                       ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="flex-1 p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20">
                          <div className="flex items-end gap-4 mb-6">
                             <span className="text-6xl font-black tracking-tighter text-emerald-500">9.8</span>
                             <div className="mb-2">
                                <div className="flex items-center gap-2 mb-1">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transparency Score</p>
                                   <div className="relative group/tooltip">
                                      <Info size={10} className="text-slate-300 cursor-help" />
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-natural-900 text-white text-[8px] font-bold rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
                                         Điểm tin cậy được tính toán dựa trên: Tính đầy đủ của dữ liệu (40%), Xác thực chéo từ Node (30%), và Kiểm định độc lập (30%).
                                      </div>
                                   </div>
                                </div>
                                <div className="flex gap-1.5">
                                   {[1,2,3,4,5,6,7,8,9,10].map(s => <div key={s} className={`w-2 h-4 rounded-sm ${s <= 9 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></div>)}
                                </div>
                             </div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                            "Dữ liệu được đối soát chéo từ 128 Node xác thực toàn cầu, đảm bảo tính toàn vẹn tuyệt đối của thông tin nguồn gốc."
                          </p>
                       </div>

                       <div className="w-full md:w-72 flex flex-col gap-3 print:hidden">
                          <button 
                            onClick={() => window.print()}
                            className="w-full py-5 bg-emerald-500 text-natural-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                          >
                            <Download size={16} className="group-hover:translate-y-1 transition-transform" />
                            Xuất Certificate
                          </button>
                          <Link 
                            href={`/explorer/${selectedNode.txHash || selectedNode.hash}`}
                            className="w-full py-5 bg-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Globe size={16} />
                            View on Chain
                          </Link>
                       </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
                     <Fingerprint size={300} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>

      <AnimatePresence>
        {showHashModal && selectedNode && (
          <HashSimulator node={selectedNode} onClose={() => setShowHashModal(false)} />
        )}
        {showExplorer && selectedNode && (
          <TransactionExplorer node={selectedNode} onClose={() => setShowExplorer(false)} />
        )}
        {showRawData && selectedNode && (
          <RawDataModal node={selectedNode} onClose={() => setShowRawData(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}

function TelemetryDashboard({ telemetry }: { telemetry: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
        <Activity size={12} className="text-emerald-500" />
        Thông số vận hành (IOT Telemetry)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {telemetry.map((t, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  {t.label.includes('Nhiệt') ? <Thermometer size={16} /> : t.label.includes('Độ ẩm') ? <Droplets size={16} /> : <BarChart3 size={16} />}
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t.label}</p>
                  <p className="text-lg font-black text-natural-900 leading-none">
                    {t.data[t.data.length - 1].value}{t.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                <TrendingUp size={10} /> STABLE
              </div>
            </div>
            
            {/* Simple Sparkline simulation with SVG */}
            <div className="h-10 w-full flex items-end gap-1 px-1">
              {t.data.map((d: any, idx: number) => {
                const max = Math.max(...t.data.map((item: any) => item.value));
                const min = Math.min(...t.data.map((item: any) => item.value));
                const height = max === min ? 50 : ((d.value - min) / (max - min)) * 70 + 20;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className="flex-1 bg-emerald-500/20 rounded-t-sm relative group"
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-natural-900 text-white text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.value}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[7px] font-mono text-slate-300">{t.data[0].time}</span>
              <span className="text-[7px] font-mono text-slate-300">{t.data[t.data.length - 1].time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HashSimulator({ node, onClose }: { node: BlockchainNode, onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [currentHash, setCurrentHash] = useState('');
  
  const rawData = JSON.stringify({
    id: node.id,
    type: node.type,
    title: node.title,
    location: node.location,
    timestamp: node.timestamp
  }, null, 2);

  useEffect(() => {
    // Step 1: Parse Data
    const t1 = setTimeout(() => setStep(1), 1500);

    // Step 2: Hashing
    let interval: any;
    const t2 = setTimeout(() => {
      setStep(2);
      interval = setInterval(() => {
        setCurrentHash('0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''));
      }, 50);
    }, 3000);

    // Step 3: Match Success
    const t3 = setTimeout(() => {
      clearInterval(interval);
      setCurrentHash(node.hash);
      setStep(3);
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 }, zIndex: 10000 });
    }, 6000);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(interval);
    };
  }, [node]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
               <Activity size={16} />
             </div>
             <div>
               <h3 className="text-white font-bold text-sm tracking-widest uppercase">EVM Node Simulator</h3>
               <p className="text-slate-500 text-[10px] font-mono">Keccak-256 / SHA-256 Verification</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-2"><ArrowLeft size={20} /></button>
        </div>
        
        <div className="p-6 md:p-8 flex-grow flex flex-col gap-6">
           {/* Step 1: Raw Data Block */}
           <div className={`transition-all duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> 1. Khối dữ liệu gốc (Payload)
             </p>
             <pre className="bg-black/50 p-4 rounded-xl text-blue-400 text-xs font-mono overflow-x-auto border border-slate-800">
               {rawData}
             </pre>
           </div>

           {/* Step 2: Hashing process */}
           <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> 2. Chạy thuật toán băm (Merkle Tree Hashing)
             </p>
             <div className="bg-black/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-4">
               <div className="flex items-center gap-4">
                 <Hash size={24} className={step === 2 ? "text-amber-500 animate-spin" : "text-slate-600"} />
                 <p className={`font-mono text-[10px] break-all ${step === 2 ? 'text-amber-400' : 'text-slate-600'}`}>
                   {step >= 2 ? currentHash : 'Waiting for payload...'}
                 </p>
               </div>
               
               {step >= 2 && (
                 <div className="pt-4 border-t border-white/5 grid grid-cols-4 gap-2">
                   {[1,2,3,4].map(i => (
                     <motion.div 
                       key={i}
                       animate={{ opacity: [0.2, 1, 0.2] }}
                       transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                       className="h-1 bg-emerald-500/30 rounded-full"
                     ></motion.div>
                   ))}
                 </div>
               )}
             </div>
           </div>

           {/* Step 3: Result Match */}
           <div className={`transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 3. Kết quả đối chiếu với sổ cái
             </p>
             <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
               {step >= 3 ? (
                 <div className="flex flex-col gap-4">
                   <div className="flex items-start gap-3">
                     <ShieldCheck size={24} className="text-emerald-400 shrink-0" />
                     <div>
                       <p className="text-emerald-400 font-bold text-sm mb-1">Xác minh toàn vẹn dữ liệu thành công!</p>
                       <p className="text-slate-400 text-xs font-light">Chữ ký Hash trùng khớp tuyệt đối với dữ liệu trên mạng lưới. Không có bất kỳ sự thay đổi hay làm giả nào được phát hiện.</p>
                     </div>
                   </div>
                   <div className="mt-2 p-3 bg-black/40 rounded-lg border border-emerald-500/10 text-[10px] font-mono space-y-1.5">
                     <div className="flex justify-between"><span className="text-slate-500">Block Number:</span><span className="text-emerald-400">19,482,041</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Gas Used:</span><span className="text-emerald-400">42,109 Gwei</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Smart Contract:</span><span className="text-emerald-400">0x7a2d4E813F0C5...f9e1</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Network:</span><span className="text-emerald-400">Ethereum Mainnet</span></div>
                   </div>
                 </div>
               ) : (
                 <p className="text-slate-600 text-xs font-mono">Awaiting verification...</p>
               )}
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function RawDataModal({ node, onClose }: { node: any, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-[#0d1117] w-full max-w-2xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
      >
         <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
               <Terminal className="text-emerald-500" size={20} />
               <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Raw Ledger Payload</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-colors">
               <X size={20} />
            </button>
         </div>
         <div className="p-8 max-h-[60vh] overflow-y-auto font-mono text-[11px] leading-relaxed">
            <pre className="text-emerald-400/90 whitespace-pre-wrap">
{`{
  "header": {
    "version": "1.0.0",
    "network": "AgriChain-Mainnet",
    "consensus": "PoA-Consortium"
  },
  "payload": {
    "node_id": "${node?.id || 'NODE-42'}",
    "timestamp": "${node?.timestamp}",
    "origin": "${node?.location}",
    "data_hash": "${node?.hash}",
    "signatures": [
      { "id": "VALIDATOR-01", "sig": "0x${Math.random().toString(16).substring(2)}..." },
      { "id": "PRODUCER-SIG", "sig": "0x${Math.random().toString(16).substring(2)}..." }
    ],
    "metadata": {
      "gps_lock": "${node?.coordinates}",
      "device_integrity": "verified",
      "encryption": "AES-256-GCM"
    }
  }
}`}
            </pre>
         </div>
         <div className="p-8 bg-white/5 border-t border-white/5 flex justify-between items-center">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Public Key Disclosure Protocol</p>
            <button className="px-6 py-2 bg-emerald-500 text-natural-950 rounded-xl text-[10px] font-black hover:bg-emerald-400 transition-all flex items-center gap-2">
               <Download size={14} /> DOWNLOAD JSON
            </button>
         </div>
      </motion.div>
    </motion.div>
  );
}

function TransactionExplorer({ node, onClose }: { node: BlockchainNode, onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const txData = [
    { label: "Transaction Hash", value: node.txHash || "0x7d2a...f1a", icon: Hash, isLink: true },
    { label: "Status", value: "Success", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Block", value: node.blockNumber?.toLocaleString() || "19,482,041", icon: Box, sub: "Confirmed by 42 Nodes" },
    { label: "Timestamp", value: new Date(node.timestamp).toLocaleString('vi-VN'), icon: Clock },
    { label: "From (Node)", value: "0x7a2d4E813F0C5...f9e1", icon: Fingerprint, isLink: true },
    { label: "To (Contract)", value: "0xAgriChain_V3_Main", icon: FileText, isLink: true },
    { label: "Value", value: "0 ETH", icon: Zap },
    { label: "Gas Used", value: node.gasUsed || "21,000", icon: Activity },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#060a06]/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-3xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-natural-900 text-white flex items-center justify-center">
                <Globe size={20} />
             </div>
             <div>
               <h3 className="text-natural-900 font-black text-lg tracking-tight">Block Explorer</h3>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Eth-Mainnet Simulated Node</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={24} /></button>
        </div>

        <div className="overflow-y-auto flex-grow">
           <div className="p-8">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold uppercase">
                    <ShieldCheck size={14} /> Giao dịch được xác thực
                 </div>
                 <Link 
                   href={`/explorer/${node.txHash || node.hash}`} 
                   className="text-blue-500 text-xs font-bold hover:underline flex items-center gap-1"
                 >
                    Xem trên AgriChain Explorer <ExternalLink size={12} />
                 </Link>
              </div>

              <div className="space-y-6">
                 {txData.map((item, i) => (
                   <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 py-4 border-b border-slate-50 last:border-0 items-center">
                      <div className="md:col-span-4 flex items-center gap-2 text-slate-400">
                         <item.icon size={16} />
                         <span className="text-xs font-bold uppercase tracking-widest">{item.label}:</span>
                      </div>
                      <div className="md:col-span-8 flex items-center justify-between gap-4">
                         <div className="min-w-0">
                             <Link 
                               href={`/explorer/${item.value}`}
                               className={`text-sm font-mono break-all font-medium ${item.color || 'text-natural-900'} ${item.isLink ? 'text-blue-600 hover:underline cursor-pointer' : ''}`}
                             >
                               {item.value}
                             </Link>
                             {item.sub && <p className="text-[10px] text-slate-400 mt-1">{item.sub}</p>}
                         </div>
                         {item.isLink && (
                           <button onClick={() => handleCopy(item.value)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-natural-900 transition-all">
                              <Copy size={14} />
                           </button>
                         )}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-8 p-6 bg-natural-50 rounded-2xl border border-natural-100">
                 <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black text-natural-900 uppercase tracking-widest">Input Data (Decoded)</h4>
                    <span className="text-[10px] text-slate-400 font-mono">UTF-8 Raw</span>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-natural-100 font-mono text-[10px] text-slate-600 leading-relaxed">
                    <p className="mb-2">Function: verifyProductData(bytes32 _dataHash, uint256 _timestamp)</p>
                    <p className="text-emerald-600">MethodID: 0x42f9e1b2</p>
                    <p className="mt-2 text-slate-400 italic">[0] _dataHash: {node.hash}</p>
                    <p className="text-slate-400 italic">[1] _timestamp: {Math.floor(new Date(node.timestamp).getTime() / 1000)}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center h-12">
           {copied && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-emerald-600">
                Copied to clipboard!
             </motion.div>
           )}
        </div>
      </motion.div>
    </motion.div>
  );
}
