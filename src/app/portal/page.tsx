'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, ShieldCheck, Cpu, LayoutDashboard, PackagePlus, 
  Settings, Bell, LogOut, Search, MapPin, Activity, 
  Thermometer, Droplets, Zap, CheckCircle2, CloudUpload, ArrowRight, Sprout
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProducerPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSigning, setIsSigning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const stats = [
    { label: "Active Batches", value: "12", icon: Layers },
    { label: "Verified Origin", value: "100%", icon: ShieldCheck },
    { label: "Network Trust", value: "A+", icon: Zap },
    { label: "Total Yield", value: "2.4 Tons", icon: BarChart3 }
  ];

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-100">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 bg-[#0a0f0a] text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 md:p-8 border-b border-white/5">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                 <Sprout size={20} />
              </div>
              <div className="flex flex-col">
                 <div className="flex items-baseline gap-1">
                    <span className="font-serif text-sm font-light text-emerald-400 italic lowercase">fwd</span>
                    <span className="font-sans text-base font-black text-white uppercase ml-1">LIFE</span>
                    <span className="font-serif text-sm font-light text-slate-400 lowercase">chain</span>
                 </div>
                 <p className="text-[7px] font-medium text-slate-500 mt-0.5">Farm · Worth · Driven</p>
              </div>
           </Link>
        </div>

        <nav className="flex-grow p-4 space-y-2 mt-6">
           {[
             { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
             { id: 'harvest', label: 'Sign Harvest', icon: PackagePlus },
             { id: 'sensors', label: 'IoT Sensors', icon: Cpu },
             { id: 'settings', label: 'Settings', icon: Settings }
           ].map((item) => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
             >
                <item.icon size={20} />
                <span className="hidden md:block font-bold text-sm">{item.label}</span>
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <button className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-400 transition-colors">
              <LogOut size={20} />
              <span className="hidden md:block font-bold text-sm">Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-4">
              <div className="md:hidden w-8 h-8 rounded-full bg-slate-100"></div>
              <h2 className="text-lg font-black tracking-tight uppercase italic">Nông trại Lạc Dương <span className="text-slate-300 text-xs font-bold not-italic ml-2 tracking-widest">ID: FARM-LD-042</span></h2>
           </div>
           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 Ledger Synced
              </div>
              <button className="relative p-2 text-slate-400 hover:text-natural-950 transition-colors">
                 <Bell size={20} />
                 <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
              <div className="w-10 h-10 rounded-full bg-natural-900 overflow-hidden border-2 border-slate-100">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&q=80" alt="Avatar" />
              </div>
           </div>
        </header>

        <div className="p-8 md:p-12 space-y-12 overflow-y-auto max-h-[calc(100vh-5rem)]">
           {activeTab === 'dashboard' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {stats.map((s, i) => (
                     <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                        <div className="text-emerald-500 mb-6 bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center"><s.icon size={24} /></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-3xl font-black text-natural-950">{s.value}</p>
                     </div>
                   ))}
                </div>

                {/* IoT Real-time Feed */}
                <section>
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Live Farm Telemetry</h3>
                      <button className="text-[10px] font-black text-emerald-500 hover:underline">VIEW SENSOR MAP</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: "Soil Moisture", value: "64.5%", icon: Droplets, color: "text-blue-500" },
                        { label: "Ambient Temp", value: "18.2°C", icon: Thermometer, color: "text-orange-500" },
                        { label: "UV Radiation", value: "1.2 Low", icon: Zap, color: "text-amber-500" }
                      ].map((t, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg flex items-center gap-6">
                           <div className={`${t.color} bg-slate-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner`}>
                              <t.icon size={28} />
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.label}</p>
                              <p className="text-2xl font-black text-natural-900">{t.value}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>

                {/* Recent Batches */}
                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                   <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="text-sm font-black text-natural-900 uppercase tracking-widest">Active Supply Chain Batches</h3>
                      <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-black transition-all">MANAGE ALL</button>
                   </div>
                   <div className="divide-y divide-slate-50">
                      {[
                        { id: "TRA-003", product: "Trà Atisô Lạc Dương", status: "In Transit", date: "2026-04-02" },
                        { id: "TRA-004", product: "Trà Atisô Lạc Dương", status: "Verified", date: "2026-04-01" },
                        { id: "TRA-005", product: "Trà Atisô Lạc Dương", status: "Processing", date: "2026-04-03" }
                      ].map((batch, i) => (
                        <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                 <Activity size={18} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-natural-950">{batch.id} - {batch.product}</p>
                                 <p className="text-[10px] text-slate-400 font-bold tracking-widest">Harvest Date: {batch.date}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${batch.status === 'Verified' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-blue-50 text-blue-500 border-blue-100'}`}>
                                 {batch.status}
                              </span>
                              <ChevronRight size={16} className="text-slate-300" />
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
             </motion.div>
           )}

           {activeTab === 'harvest' && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }} 
               className="max-w-4xl mx-auto space-y-12 pt-12"
             >
                <div className="text-center space-y-4">
                   <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">Sign New <span className="text-emerald-500">Harvest</span></h2>
                   <p className="text-slate-400 text-lg font-light">Ghi nhận dữ liệu thu hoạch mới lên mạng lưới AgriChain thông qua chữ ký số xác thực.</p>
                </div>

                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Product Category</label>
                         <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option>Trà Atisô (Lạc Dương)</option>
                            <option>Yến Sào (Ninh Hòa)</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Estimated Yield (kg)</label>
                         <input type="number" placeholder="250.00" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                   </div>

                   <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-dashed border-emerald-500/20 flex flex-col items-center justify-center text-center gap-4 group hover:border-emerald-500/50 transition-all cursor-pointer">
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10"><CloudUpload size={32} /></div>
                      <div>
                         <p className="text-sm font-black text-natural-950">Tải lên chứng từ thu hoạch</p>
                         <p className="text-[10px] font-bold text-slate-400">PDF, PNG, JPG (Max 10MB)</p>
                      </div>
                   </div>

                   <div className="flex flex-col items-center gap-6 pt-6">
                      <button 
                        onClick={handleSign}
                        disabled={isSigning || isSuccess}
                        className={`w-full py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 ${isSuccess ? 'bg-emerald-500 text-white' : 'bg-natural-900 text-white hover:bg-black hover:-translate-y-1'}`}
                      >
                         {isSigning ? (
                           <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             SIGNING LEDGER...
                           </>
                         ) : isSuccess ? (
                           <>
                             <CheckCircle2 size={24} /> HARVEST VERIFIED & LOCKED
                           </>
                         ) : (
                           <>
                             <ShieldCheck size={24} /> SIGN DATA TO BLOCKCHAIN
                           </>
                         )}
                      </button>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Digital Signature: 0x82f...a12c • Secured by Ethereum Node</p>
                   </div>
                </div>

                <AnimatePresence>
                   {isSuccess && (
                     <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       className="bg-emerald-500 p-6 rounded-2xl text-white flex items-center justify-between shadow-2xl"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
                           <div>
                              <p className="text-sm font-black uppercase">Transaction Confirmed!</p>
                              <p className="text-[10px] font-bold opacity-80">Block #19482416 • 12 Nodes Validated</p>
                           </div>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">View Transaction</button>
                     </motion.div>
                   )}
                </AnimatePresence>
             </motion.div>
           )}
        </div>
      </main>
    </div>
  );
}

// Icons for stats grid
function Layers({ size, className }: { size: number, className?: string }) {
  return <Cpu size={size} className={className} />;
}
function BarChart3({ size, className }: { size: number, className?: string }) {
  return <Activity size={size} className={className} />;
}
function ChevronRight({ size, className }: { size: number, className?: string }) {
  return <ArrowRight size={size} className={className} />;
}
