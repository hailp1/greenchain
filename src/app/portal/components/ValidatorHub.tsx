'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Award, RefreshCw } from 'lucide-react';
import { useWeb3 } from '@/lib/web3/Web3Provider';

interface ValidatorHubProps {
  currentEntity: any;
  user: any;
  handleStake: (amount: number) => Promise<void>;
  handleClaim: () => Promise<void>;
  handleClaimReward: () => Promise<void>;
  isSigning: boolean;
  claimLoading: boolean;
  mounted: boolean;
}

export default function ValidatorHub({
  currentEntity,
  user,
  handleStake,
  handleClaim,
  handleClaimReward,
  isSigning,
  claimLoading,
  mounted
}: ValidatorHubProps) {
  const web3 = useWeb3();
  const [stakeInput, setStakeInput] = useState("100");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-1 h-full ${mounted && Number(web3.stakedBalance) >= 500 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Node Status</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${mounted && Number(web3.stakedBalance) >= 500 ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
            <p className={`text-xl md:text-2xl font-black ${mounted && Number(web3.stakedBalance) >= 500 ? 'text-emerald-600' : 'text-slate-500'}`}>
              {mounted && Number(web3.stakedBalance) >= 500 ? 'ACTIVE NODE' : 'INACTIVE'}
            </p>
          </div>
          <p className="text-[7px] font-bold text-slate-400 uppercase mt-2">{mounted && Number(web3.stakedBalance) >= 500 ? 'Syncing with fwd LIFEchain...' : 'Requires 500 AGRI minimum'}</p>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Voting Power</p>
          <p className="text-xl md:text-2xl font-black text-blue-600">
            {mounted && Number(web3.stakedBalance) > 0 ? (Number(web3.stakedBalance) / 100).toFixed(2) : '0.00'} <span className="text-xs opacity-50">VP</span>
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${Math.min((Number(web3.stakedBalance) / 5000) * 100, 100)}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rewards (APR 12%)</p>
          <p className="text-xl md:text-2xl font-black text-emerald-500">
            +{mounted && web3.isConnected ? Number(web3.pendingRewards).toFixed(4) : '0.0000'} <span className="text-xs opacity-50">AGRI</span>
          </p>
          <p className="text-[7px] font-bold text-emerald-600 uppercase mt-2">Next payout in ~12 sec</p>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Staked Balance</p>
          <p className="text-xl md:text-2xl font-black text-natural-950">
            {mounted && web3.isConnected ? Number(web3.stakedBalance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
          </p>
          <button onClick={() => setStakeInput(web3.fwdBalance)} className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-2 hover:underline">Stake Max Assets</button>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-natural-950 text-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Stake <span className="text-emerald-500">to Verify</span></h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Nâng cấp quyền hạn Node & Nhận thưởng</p>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount to Stake</p>
                <input 
                  type="number" 
                  value={stakeInput}
                  onChange={(e) => setStakeInput(e.target.value)}
                  className="w-full bg-transparent border-none text-2xl font-black text-white focus:outline-none focus:ring-0 p-0"
                  placeholder="0.00"
                />
              </div>
              <button 
                onClick={() => handleStake(Number(stakeInput))}
                disabled={isSigning}
                className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${isSigning ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'}`}
              >
                {isSigning ? "WAITING FOR BLOCKCHAIN..." : "CONFIRM STAKING"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Yield <span className="text-blue-500">Rewards</span></h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Phần thưởng xác thực tích lũy</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <Award size={24} />
              </div>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available to Claim</p>
              <p className="text-4xl font-black text-natural-950">
                {mounted && web3.isConnected ? Number(web3.pendingRewards).toFixed(2) : '0.00'} 
                <span className="text-xs text-slate-400 ml-1">AGRI</span>
              </p>
            </div>
          </div>
          <button onClick={handleClaim} className="w-full py-5 border-2 border-slate-900 text-natural-900 hover:bg-natural-900 hover:text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all mt-6">
            CLAIM REWARDS
          </button>
        </div>
      </section>
    </motion.div>
  );
}
