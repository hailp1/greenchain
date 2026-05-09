'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Cpu, 
  LayoutDashboard, 
  PackagePlus, 
  Settings, 
  Bell, 
  LogOut, 
  Search, 
  MapPin, 
  Activity, 
  Thermometer, 
  Droplets, 
  Zap, 
  CheckCircle2, 
  CloudUpload, 
  ArrowRight, 
  Layers, 
  BarChart3, 
  Send, 
  Award, 
  User
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '@/lib/supabase';
import { useWeb3 } from '@/lib/web3/Web3Provider';

export default function ProducerPortal() {
  const web3 = useWeb3();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSigning, setIsSigning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipientWallet, setRecipientWallet] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [currentEntity, setCurrentEntity] = useState<any>(null);
  const [stakeInput, setStakeInput] = useState("100");
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const [newHarvest, setNewHarvest] = useState({
    product_name: 'Trà Atisô (Lạc Dương)',
    quantity: 250,
    gps: '12.0124, 108.3842'
  });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/signin';
      } else {
        setUser(session.user);
      }
    };
    checkUser();

    if (web3.isConnected && web3.address) {
      setWalletAddress(web3.address);
      const linkWallet = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Update the entity with the real wallet address if it's currently a pending one
            const { data: entity } = await supabase.from('entities').select('wallet_address').eq('id', session.user.id).single();
            if (entity && entity.wallet_address.startsWith('pending_wallet_')) {
              await supabase.from('entities').update({ wallet_address: web3.address }).eq('id', session.user.id);
            }
            
            await supabase.rpc('claim_wallet_connection_reward', {
              p_user_id: session.user.id,
              p_wallet_address: web3.address!
            });
            fetchBalance();
          }
        } catch (_) { /* silent */ }
      };
      linkWallet();
    }
  }, [web3.isConnected, web3.address]);

  const [balance, setBalance] = useState("0.00");

  const fetchBalance = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from('entities')
        .select('fwd_balance')
        .eq('id', session.user.id)
        .maybeSingle();
      if (data) {
        setBalance(Number(data.fwd_balance).toLocaleString('en-US', { minimumFractionDigits: 2 }));
        return;
      }
    }
    
    if (walletAddress) {
      const { data } = await supabase
        .from('entities')
        .select('fwd_balance')
        .ilike('wallet_address', walletAddress)
        .maybeSingle();
      if (data) setBalance(Number(data.fwd_balance).toLocaleString('en-US', { minimumFractionDigits: 2 }));
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [walletAddress, user]);

  useEffect(() => {
    const fetchEntityData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('entities')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        if (data) {
          setCurrentEntity(data);
          fetchBalance();
          return;
        }
      }

      if (!walletAddress) return;
      const { data } = await supabase
        .from('entities')
        .select('*')
        .ilike('wallet_address', walletAddress)
        .maybeSingle();
      
      if (data) {
        setCurrentEntity(data);
        fetchBalance();
      }
    };
    fetchEntityData();
  }, [walletAddress, user]);

  useEffect(() => {
    const fetchPortalData = async () => {
      if (!currentEntity) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('batches')
          .select('*, blockchain_ledger(tx_hash)')
          .eq('entity_id', currentEntity.id)
          .order('timestamp', { ascending: false });

        if (error) throw error;
        setBatches(data || []);

        const { data: txData } = await supabase
          .from('token_transactions')
          .select('*')
          .or(`sender_id.eq.${currentEntity.id},receiver_id.eq.${currentEntity.id}`)
          .order('created_at', { ascending: false });
        setTransactions(txData || []);
      } catch (err) {
        console.error('Portal data error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortalData();
  }, [currentEntity]);

  const handleTransfer = async () => {
    if (!recipientWallet || !transferAmount) return;
    try {
      setIsTransferring(true);
      const txHash = await web3.transferTokens(recipientWallet, transferAmount);
      if (txHash) {
        setLastTxHash(txHash);
        await supabase.from('token_transactions').insert([{
          entity_id: currentEntity?.id,
          amount: parseFloat(transferAmount),
          type: 'TRANSFER',
          description: `Transferred AGRI to ${recipientWallet.slice(0, 8)}...`
        }]);
        setIsSuccess(true);
        setRecipientWallet("");
        setTransferAmount("");
        await refreshData();
        setTimeout(() => {
          setIsSuccess(false);
          setLastTxHash(null);
        }, 5000);
      }
    } catch (err: any) {
      console.error('Transfer error:', err);
      alert(err.message || 'Giao dịch thất bại.');
    } finally {
      setIsTransferring(false);
    }
  };

  const stats = [
    { label: "Active Batches", value: batches.length.toString(), icon: Layers },
    { label: "AGRI Balance", value: web3.isConnected ? Number(web3.fwdBalance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : balance, icon: Zap },
    { label: "Network Trust", value: "A+", icon: ShieldCheck },
    { label: "Total Yield", value: batches.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0).toFixed(1) + " KG", icon: BarChart3 }
  ];

  const handleSign = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_id: currentEntity?.id,
          product_name: newHarvest.product_name,
          quantity: newHarvest.quantity,
          gps: newHarvest.gps
        })
      });

      if (!response.ok) throw new Error('Failed to submit batch');

      setIsSuccess(true);
      await refreshData();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error('Sign error:', err);
      alert('Lỗi khi gửi dữ liệu lên blockchain.');
    } finally {
      setIsSigning(false);
    }
  };

  const handleStake = async (amount: number) => {
    if (amount <= 0) return;
    try {
      setIsSigning(true);
      
      // Validation
      if (!web3.isConnected) {
        alert("Vui lòng kết nối ví MetaMask trước khi Staking.");
        web3.connect();
        setIsSigning(false);
        return;
      }

      if (parseFloat(web3.fwdBalance) < amount) {
        alert(`Số dư AGRI của bạn (${web3.fwdBalance}) không đủ để Stake ${amount} AGRI.`);
        setIsSigning(false);
        return;
      }

      const txHash = await web3.stakeTokens(amount.toString());
      if (txHash) {
        setLastTxHash(txHash);
        const newStaked = (Number(currentEntity?.staked_balance) || 0) + amount;
        await Promise.all([
          supabase.from('entities').update({ staked_balance: newStaked }).eq('id', currentEntity.id),
          supabase.from('token_transactions').insert([{
            entity_id: currentEntity.id,
            amount: amount,
            type: 'STAKE',
            description: `Staked AGRI for node validation`
          }])
        ]);
        setIsSuccess(true);
        setStakeInput('');
        await refreshData();
        setTimeout(() => {
          setIsSuccess(false);
          setLastTxHash(null);
        }, 8000);
      }
    } catch (err: any) {
      console.error('Stake error:', err);
      alert("Lỗi Giao Dịch: " + (err.reason || err.message || "Không thể thực hiện Staking. Vui lòng thử lại."));
    } finally {
      setIsSigning(false);
    }
  };

  const handleClaim = async () => {
    try {
      setIsSigning(true);
      const txHash = await web3.claimRewards();
      if (txHash) {
        setLastTxHash(txHash);
        const rewardAmount = parseFloat(web3.pendingRewards);
        await supabase.from('token_transactions').insert([{
          entity_id: currentEntity?.id,
          amount: rewardAmount,
          type: 'REWARD',
          description: `Claimed validation rewards`
        }]);
        setIsSuccess(true);
        await refreshData();
        setTimeout(() => {
          setIsSuccess(false);
          setLastTxHash(null);
          setActiveTab('dashboard');
        }, 5000);
      }
    } catch (err) {
      console.error('Claim error:', err);
    } finally {
      setIsSigning(false);
    }
  };

  const handleApprove = async (batchId: string) => {
    try {
      const rewardAmount = 5.0;
      const currentBalance = parseFloat(balance.replace(/,/g, ''));
      const newBalance = currentBalance + rewardAmount;
      const newReputation = (currentEntity?.reputation_score || 0) + 1;

      await Promise.all([
        supabase.from('batches').update({ status: 'VERIFIED' }).eq('id', batchId),
        supabase.from('entities').update({ fwd_balance: newBalance, reputation_score: newReputation }).eq('id', currentEntity.id),
        supabase.from('token_transactions').insert([{
          entity_id: currentEntity.id,
          amount: rewardAmount,
          type: 'REWARD',
          description: `Audit reward for batch ${batchId.slice(0,8)}`
        }])
      ]);
      alert(`Xác thực thành công! +${rewardAmount} AGRI & +1 uy tín.`);
      await refreshData();
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const refreshData = async () => {
    const { data: b } = await supabase.from('batches').select('*, blockchain_ledger(tx_hash)').order('timestamp', { ascending: false });
    setBatches(b || []);
    const { data: e } = await supabase.from('entities').select('*').eq('id', currentEntity?.id || '').maybeSingle();
    if (e) {
      setCurrentEntity(e);
      setBalance(Number(e.fwd_balance).toLocaleString('en-US', { minimumFractionDigits: 2 }));
    }
    const { data: tx } = await supabase.from('token_transactions').select('*').order('created_at', { ascending: false });
    setTransactions(tx || []);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-100">
      <aside className="w-16 md:w-64 bg-[#0a0f0a] text-white flex flex-col sticky top-0 h-screen z-[60]">
        <div className="p-6 md:p-8 border-b border-white/5">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs">fwd</div>
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
             { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
             { id: 'harvest', label: 'Sign Harvest', icon: PackagePlus, roles: ['PRODUCER', 'FARMER'] },
             { id: 'audit', label: 'Audit & Verify', icon: ShieldCheck, roles: ['AUDITOR', 'GOVERNMENT'] },
             { id: 'tokenomics', label: 'Tokenomics', icon: Zap },
             { id: 'governance', label: 'DAO Governance', icon: Globe },
             { id: 'settings', label: 'Settings', icon: Settings }
           ].filter(item => !item.roles || item.roles.includes(currentEntity?.role)).map((item) => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
             >
                <item.icon size={20} className="shrink-0" />
                <span className="hidden md:block font-bold text-sm truncate">{item.label}</span>
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <button onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-400">
              <LogOut size={20} />
              <span className="hidden md:block font-bold text-sm">Logout</span>
           </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col">
        <header className="h-16 md:h-20 bg-white border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-4">
              <h2 className="text-[10px] md:text-lg font-black tracking-tight uppercase italic truncate max-w-[120px] md:max-w-none">
                {currentEntity?.name || user?.user_metadata?.full_name || 'Đang tải...'} 
              </h2>
           </div>
           <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[9px] md:text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                 <Zap size={12} className="animate-pulse text-emerald-500" />
                 {parseFloat(web3.fwdBalance).toLocaleString(undefined, {minimumFractionDigits: 2})} AGRI
              </div>

              <button 
                  onClick={async () => {
                    if (isSigning) return;
                    setIsSigning(true);
                    try {
                      const txHash = await web3.claimTestTokens();
                      if (txHash) {
                        setLastTxHash(txHash);
                        setIsSuccess(true);
                        setTimeout(() => {
                          setIsSuccess(false);
                          setLastTxHash(null);
                        }, 5000);
                      }
                    } catch (e) {
                      alert("Không thể nhận token. Vui lòng thử lại sau.");
                    } finally {
                      setIsSigning(false);
                    }
                  }}
                  disabled={isSigning}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
               >
                  {isSigning ? "WAITING..." : "CLAIM 1,000 AGRI"}
               </button>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-natural-900 overflow-hidden border-2 border-slate-100 shrink-0">
                 <img src={user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&q=80"} alt="Avatar" />
              </div>
           </div>
        </header>

        <AnimatePresence>
            {isSuccess && lastTxHash && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
              >
                 <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-2xl flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={24} />
                       <span className="font-black uppercase tracking-widest text-xs">Transaction Successful!</span>
                    </div>
                    <p className="text-[10px] text-emerald-100 font-mono break-all opacity-80">TX: {lastTxHash}</p>
                    <Link href={`/explorer/${lastTxHash}`} className="text-[10px] font-black underline mt-2 uppercase tracking-widest">View in Explorer</Link>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>

        <div className="p-4 md:p-12 space-y-8 md:space-y-12 overflow-y-auto max-h-[calc(100vh-4rem)]">
           {activeTab === 'dashboard' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                   {stats.map((s, i) => (
                     <div key={i} className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                        <div className="text-emerald-500 mb-4 md:mb-6 bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center"><s.icon size={20} /></div>
                        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-xl md:text-3xl font-black text-natural-950">{s.value}</p>
                     </div>
                   ))}
                </div>

                {/* New Quick Action Card for Staking */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all duration-700"></div>
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="space-y-3">
                         <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Start Staking <span className="text-emerald-200">& Earn Rewards</span></h3>
                         <p className="text-emerald-100/70 text-sm font-medium max-w-md">Kích hoạt quyền xác thực của Node và bắt đầu nhận AGRI Token thưởng mỗi giây từ mạng lưới FWD Lifechain.</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (!web3.isConnected) {
                            web3.connect();
                          } else {
                            setActiveTab('tokenomics');
                          }
                        }}
                        className="px-10 py-5 bg-white text-emerald-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-black/10"
                      >
                         {web3.isConnected ? "GO TO STAKING CENTER" : "CONNECT WALLET TO START"}
                      </button>
                   </div>
                </div>

                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                   <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="text-sm font-black text-natural-900 uppercase tracking-widest">Active Supply Chain Batches</h3>
                   </div>
                   <div className="divide-y divide-slate-50">
                      {loading ? (
                        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading ledger data...</div>
                      ) : batches.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No batches found</div>
                      ) : batches.map((batch, i) => (
                        <div key={i} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white">
                                 <Activity size={18} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-natural-950">{batch.id.slice(0,8)} - {batch.product_name}</p>
                                 <p className="text-[10px] text-slate-400 font-bold tracking-widest">Harvest Date: {new Date(batch.timestamp).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${batch.blockchain_ledger?.[0]?.tx_hash ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                                 {batch.blockchain_ledger?.[0]?.tx_hash ? 'VERIFIED' : 'PENDING'}
                              </span>
                              <ArrowRight size={16} className="text-slate-300" />
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
             </motion.div>
           )}

           {activeTab === 'tokenomics' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Gas Spent</p>
                       <p className="text-3xl font-black text-orange-500">
                         {transactions.filter(t => t.type === 'GAS_FEE').reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(2)} AGRI
                       </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rewards Earned</p>
                       <p className="text-3xl font-black text-emerald-500">
                         {transactions.filter(t => t.type === 'REWARD').reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(2)} AGRI
                       </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Staked (Live)</p>
                       <p className="text-3xl font-black text-blue-600">
                         {web3.isConnected ? Number(web3.stakedBalance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : Number(currentEntity?.staked_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} AGRI
                       </p>
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
                                <div className="flex justify-between items-end">
                                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount to Stake</p>
                                </div>
                                <div className="flex gap-2">
                                   <input 
                                      type="number" 
                                      value={stakeInput}
                                      onChange={(e) => setStakeInput(e.target.value)}
                                      className="flex-grow bg-transparent border-none text-2xl font-black text-white focus:outline-none focus:ring-0 p-0"
                                      placeholder="0.00"
                                   />
                                </div>
                             </div>
                             <button 
                                onClick={() => handleStake(Number(stakeInput))}
                                disabled={isSigning}
                                className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${isSigning ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'}`}
                             >
                                {isSigning ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    WAITING FOR BLOCKCHAIN...
                                  </>
                                ) : (
                                  "CONFIRM STAKING"
                                )}
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
                               {web3.isConnected ? Number(web3.pendingRewards).toFixed(2) : '0.00'} 
                               <span className="text-xs text-slate-400 ml-1">AGRI</span>
                             </p>
                          </div>
                       </div>
                       <button onClick={handleClaim} className="w-full py-5 border-2 border-slate-900 text-natural-900 hover:bg-natural-900 hover:text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all mt-6">
                          CLAIM REWARDS
                       </button>
                       <button 
                         onClick={() => {
                           const eth = (window as any).ethereum;
                           if (eth) {
                             eth.request({
                               method: 'wallet_watchAsset',
                               params: {
                                 type: 'ERC20',
                                 options: {
                                   address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
                                   symbol: 'AGRI',
                                   decimals: 18,
                                   image: 'https://chain.fwdlife.vn/ico.png?v=2'
                                 }
                               }
                             }).catch((e: any) => alert("Thông báo: " + e.message));
                           } else {
                             alert("Vui lòng cài đặt MetaMask!");
                           }
                         }}
                         className="w-full py-4 bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-3 flex items-center justify-center gap-3"
                       >
                          <img src="/favicon.ico" alt="AGRI" className="w-4 h-4 rounded-full shadow-sm" />
                          Add AGRI Logo to MetaMask
                       </button>
                    </div>
                 </section>

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
                                <Zap size={12} /> Số lượng AGRI
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
                                   {tx.type === 'GAS_FEE' || tx.type === 'STAKE' ? '-' : '+'}{tx.amount} fwd
                                </p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </section>
              </motion.div>
           )}

           {activeTab === 'harvest' && (
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12 pt-12">
                <div className="text-center space-y-4">
                   <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">Sign New <span className="text-emerald-500">Harvest</span></h2>
                </div>

                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Product Category</label>
                         <select 
                           value={newHarvest.product_name}
                           onChange={(e) => setNewHarvest({...newHarvest, product_name: e.target.value})}
                           className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                         >
                            <option value="Trà Atisô (Lạc Dương)">Trà Atisô (Lạc Dương)</option>
                            <option value="Yến Sào (Ninh Hòa)">Yến Sào (Ninh Hòa)</option>
                            <option value="Sầu Riêng (Đắk Lắk)">Sầu Riêng (Đắk Lắk)</option>
                            <option value="Cà Phê Arabica (Cầu Đất)">Cà Phê Arabica (Cầu Đất)</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Estimated Yield (kg)</label>
                         <input 
                           type="number" 
                           value={newHarvest.quantity}
                           onChange={(e) => setNewHarvest({...newHarvest, quantity: Number(e.target.value)})}
                           className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" 
                         />
                      </div>
                   </div>

                   <button 
                     onClick={handleSign}
                     disabled={isSigning || isSuccess}
                     className={`w-full py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${isSuccess ? 'bg-emerald-500 text-white' : 'bg-natural-900 text-white hover:bg-black'}`}
                   >
                      {isSigning ? 'SIGNING LEDGER...' : isSuccess ? 'HARVEST VERIFIED' : 'SIGN DATA TO BLOCKCHAIN'}
                   </button>
                </div>
             </motion.div>
           )}

           {activeTab === 'audit' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                   <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="text-sm font-black text-natural-900 uppercase tracking-widest">Batches Awaiting Audit</h3>
                   </div>
                   <div className="divide-y divide-slate-50">
                      {batches.filter(b => b.status === 'PENDING').length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No pending batches</div>
                      ) : batches.filter(b => b.status === 'PENDING').map((batch, i) => (
                        <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                 <ShieldCheck size={18} />
                              </div>
                              <div>
                                 <p className="text-lg font-black text-natural-950 uppercase">{batch.product_name}</p>
                                 <p className="text-[10px] text-slate-400 font-bold tracking-widest">Producer: {batch.producer_id?.slice(0,8)}</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => handleApprove(batch.id)}
                             className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20"
                           >
                             Approve Data
                           </button>
                        </div>
                      ))}
                   </div>
                </section>
             </motion.div>
           )}
        </div>
      </main>
    </div>
  );
}
