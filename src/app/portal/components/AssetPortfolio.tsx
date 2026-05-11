'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { useWeb3 } from '@/lib/web3/Web3Provider';

interface AssetPortfolioProps {
  transactions: any[];
  recipientWallet: string;
  setRecipientWallet: (val: string) => void;
  transferAmount: string;
  setTransferAmount: (val: string) => void;
  handleTransfer: () => Promise<void>;
  isTransferring: boolean;
  mounted: boolean;
}

export default function AssetPortfolio({
  transactions,
  recipientWallet,
  setRecipientWallet,
  transferAmount,
  setTransferAmount,
  handleTransfer,
  isTransferring,
  mounted
}: AssetPortfolioProps) {
  const web3 = useWeb3();

  return (
    <div className="space-y-12">
      <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden p-8 md:p-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-natural-900 uppercase tracking-tighter italic">Inter-Wallet <span className="text-emerald-500">Transfer</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <User size={12} /> Địa chỉ ví người nhận
              </label>
              <input 
                type="text" 
                value={recipientWallet}
                onChange={(e) => setRecipientWallet(e.target.value)}
                placeholder="0x..." 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-mono outline-none" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                <Zap size={12} /> Số lượng GRE
              </label>
              <input 
                type="number" 
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00" 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black outline-none" 
              />
            </div>
          </div>

          <button 
            onClick={handleTransfer}
            disabled={isTransferring}
            className="w-full py-5 bg-natural-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-4"
          >
            {isTransferring ? 'ĐANG XỬ LÝ...' : 'THỰC THI CHUYỂN COIN'}
          </button>
        </div>
      </section>

      <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-sm font-black text-natural-900 uppercase tracking-widest">Transaction Ledger</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No transactions yet</div>
          ) : transactions.map((tx, i) => (
            <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'GAS_FEE' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  {tx.type === 'GAS_FEE' ? <ArrowRight size={18} className="rotate-45" /> : <ShieldCheck size={18} />}
                </div>
                <div>
                  <p className="text-sm font-black text-natural-950 uppercase">{tx.type.replace('_', ' ')}</p>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest leading-none">{tx.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${tx.type === 'GAS_FEE' || tx.type === 'STAKE' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {tx.type === 'GAS_FEE' || tx.type === 'STAKE' ? '-' : '+'}{tx.amount} GRE
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
