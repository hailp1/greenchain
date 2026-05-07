'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Star, Users, ArrowUpRight, 
  TrendingUp, AlertCircle, CheckCircle2, Award
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Reputation() {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        setLoading(true);
        const { data, error: sbError } = await supabase
          .from('entities')
          .select('id, name, role, reputation_score, is_locked, staked_balance')
          .order('reputation_score', { ascending: false })
          .limit(100);

        if (sbError) throw sbError;
        setEntities(data || []);
      } catch (err: any) {
        console.error('Reputation fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReputation();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#1a2f1a]">
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <header className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100">
              <Award size={14} />
              <span>Network Integrity Scores</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-natural-950 tracking-tighter mb-6 italic uppercase">
              Bảng xếp hạng <span className="text-emerald-500">Reputation</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Điểm tín nhiệm (R) được tính toán dựa trên lịch sử giao dịch chuỗi khối, chất lượng sản phẩm và các lần kiểm định thực tế.
            </p>
          </motion.div>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
           {[
             { label: "Top Rated", value: entities.filter(e => e.reputation_score > 90).length + " Farms", icon: Star, color: "text-amber-500" },
             { label: "Verified Entities", value: entities.length.toString(), icon: ShieldCheck, color: "text-emerald-500" },
             { label: "Network Health", value: "99.9%", icon: TrendingUp, color: "text-blue-500" },
             { label: "Active Nodes", value: (entities.length + 12).toString(), icon: Users, color: "text-purple-500" }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5">
                <stat.icon className={`${stat.color} mb-4`} size={20} />
                <p className="text-2xl font-black text-natural-900 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
             </div>
           ))}
        </div>

        {/* Entity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]"></div>
            ))
          ) : error ? (
            <div className="col-span-full p-12 bg-red-50 border border-red-100 rounded-[2.5rem] text-center">
              <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
              <h3 className="text-xl font-black text-red-900 mb-2">Lỗi kết nối dữ liệu</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                Thử lại
              </button>
            </div>
          ) : (
            entities.map((entity, i) => (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-900/5 hover:shadow-emerald-500/10 transition-all relative overflow-hidden h-full flex flex-col">
                  {/* Reputation Indicator Bar */}
                  <div 
                    className="absolute top-0 right-0 w-2 h-full" 
                    style={{ backgroundColor: entity.reputation_score > 80 ? '#10b981' : entity.reputation_score > 50 ? '#f59e0b' : '#ef4444' }}
                  ></div>

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{entity.role}</p>
                      <h3 className="text-xl font-black text-natural-900 tracking-tight group-hover:text-emerald-500 transition-colors">{entity.name}</h3>
                    </div>
                    {entity.reputation_score > 80 && (
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-8 flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-natural-950 tracking-tighter">{entity.reputation_score}</span>
                        <span className="text-sm font-bold text-slate-300">/ 100</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reputation Score</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {entity.is_locked ? (
                        <div className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-[9px] font-black flex items-center gap-1.5 border border-red-100">
                          <AlertCircle size={12} />
                          LOCKED
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black flex items-center gap-1.5 border border-emerald-100">
                          <TrendingUp size={12} />
                          ACTIVE
                        </div>
                      )}
                      {entity.staked_balance > 0 && (
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black flex items-center gap-1.5 border border-blue-100 mt-2">
                          <ShieldCheck size={12} />
                          STAKED: {Number(entity.staked_balance).toFixed(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Mock Activity Sparkline */}
                  <div className="mt-6 flex items-end gap-1 h-8">
                     {[40, 70, 45, 90, 65, 80, 95].map((v, idx) => (
                       <div 
                         key={idx} 
                         style={{ height: `${v}%` }}
                         className={`flex-1 rounded-t-sm ${entity.reputation_score > 80 ? 'bg-emerald-500/20' : 'bg-slate-200'} group-hover:bg-emerald-500/40 transition-colors`}
                       ></div>
                     ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
