'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, ShieldCheck, Cpu, LayoutDashboard, PackagePlus, 
  Settings, Bell, LogOut, Search, MapPin, Activity, 
  Thermometer, Droplets, Zap, CheckCircle2, CloudUpload, ArrowRight, Layers, BarChart3, Send, Award, Users
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '@/lib/supabase';

export default function ProducerPortal() {
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

  // Form states for new harvest
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

    // MetaMask Detection
    const detectWallet = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    };
    detectWallet();

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        setWalletAddress(accounts[0] || "");
      });
    }
  }, []);
  const [balance, setBalance] = useState("0.00");

  const fetchBalance = async () => {
    if (walletAddress) {
      const { data } = await supabase
        .from('entities')
        .select('fwd_balance')
        .ilike('wallet_address', walletAddress)
        .single();
      if (data) setBalance(Number(data.fwd_balance).toLocaleString('en-US', { minimumFractionDigits: 2 }));
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [walletAddress]);

  useEffect(() => {
    const fetchEntityData = async () => {
      if (!walletAddress) return;
      
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .ilike('wallet_address', walletAddress)
        .single();
      
      if (data) {
        setCurrentEntity(data);
        fetchBalance();
      }
    };
    fetchEntityData();
  }, [walletAddress]);

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
    if (!recipientWallet || !transferAmount) return alert("Vui lòng nhập đầy đủ thông tin chuyển tiền.");
    if (Number(transferAmount) <= 0) return alert("Số lượng chuyển không hợp lệ.");

    try {
      setIsTransferring(true);
      
      if (!currentEntity) throw new Error("Chưa kết nối danh tính Blockchain.");
      
      const { error } = await supabase.rpc('transfer_fwd', {
        p_sender_id: currentEntity.id,
        p_receiver_wallet: recipientWallet,
        p_amount: Number(transferAmount),
        p_description: `Transfer to Wallet ${recipientWallet.slice(0, 6)}...`
      });

      if (error) throw error;

      alert("Chuyển FWD thành công!");
      setRecipientWallet("");
      setTransferAmount("");
      fetchBalance();
      
      // Refresh transactions
      const { data: txData } = await supabase
        .from('token_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      setTransactions(txData || []);

    } catch (err: any) {
      alert(err.message || "Giao dịch thất bại. Vui lòng kiểm tra lại địa chỉ ví người nhận.");
    } finally {
      setIsTransferring(false);
    }
  };

  const stats = [
    { label: "Active Batches", value: batches.length.toString(), icon: Layers },
    { label: "fwd Balance", value: balance, icon: Zap },
    { label: "Network Trust", value: "A+", icon: ShieldCheck },
    { label: "Total Yield", value: batches.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0).toFixed(1) + " KG", icon: BarChart3 }
  ];

  const handleSign = async () => {
    setIsSigning(true);
    try {
      // 0. Pre-flight check: Ensure enough balance for gas fee (1.2 fwd)
      const currentBalanceRaw = balance.replace(/,/g, '');
      const gasFee = 1.2;
      if (parseFloat(currentBalanceRaw) < gasFee) {
        alert('Số dư fwd Token không đủ để trả phí Gas (1.2 fwd). Vui lòng nạp thêm để tiếp tục.');
        setIsSigning(false);
        return;
      }

      // 1. Create the batch in Supabase
      const { data: batch, error: bError } = await supabase
        .from('batches')
        .insert([{
          product_name: newHarvest.product_name,
          quantity: newHarvest.quantity,
          gps: newHarvest.gps,
          status: 'PENDING',
          producer_id: currentEntity?.id
        }])
        .select()
        .single();

      if (bError) throw bError;

      // 2. Anchoring to Blockchain & Deduct Gas Fee
      const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      // Update balance and record gas transaction
      const newBalance = parseFloat(currentBalanceRaw) - gasFee;
      
      await Promise.all([
        supabase.from('entities').update({ fwd_balance: newBalance }).eq('id', currentEntity.id),
        supabase.from('token_transactions').insert([{
          entity_id: currentEntity.id,
          amount: gasFee,
          type: 'GAS_FEE',
          description: `Gas fee for signing batch ${batch.id.slice(0,8)}`
        }]),
        supabase.from('blockchain_ledger').insert([{
          batch_id: batch.id,
          tx_hash: mockTxHash,
          block_height: 19400 + Math.floor(Math.random() * 1000),
          merkle_root: '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
        }])
      ]);

      setIsSuccess(true);
      await refreshData();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error('Sign error:', err);
      alert('Không thể ký dữ liệu. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setIsSigning(false);
    }
  };

  const handleStake = async (amount: number) => {
    if (!amount || amount <= 0) return;
    try {
      const currentBalance = parseFloat(balance.replace(/,/g, ''));
      if (currentBalance < amount) {
        alert("Số dư không đủ để thực hiện Staking.");
        return;
      }

      const newBalance = currentBalance - amount;
      const newStaked = (currentEntity?.staked_balance || 0) + amount;

      await Promise.all([
        supabase.from('entities').update({ fwd_balance: newBalance, staked_balance: newStaked }).eq('id', currentEntity.id),
        supabase.from('token_transactions').insert([{
          entity_id: currentEntity.id,
          amount: amount,
          type: 'STAKE',
          description: `Staked ${amount} fwd to upgrade Node authority`
        }])
      ]);
      
      alert(`Đã Stake thành công ${amount} fwd! Quyền biểu quyết của bạn đã được cập nhật.`);
      await refreshData();
    } catch (err) {
      console.error('Stake error:', err);
    }
  };

  const handleClaim = async () => {
    try {
      const rewardAmount = 42.85; // Simulated claimable amount
      const currentBalance = parseFloat(balance.replace(/,/g, ''));
      const newBalance = currentBalance + rewardAmount;

      await Promise.all([
        supabase.from('entities').update({ fwd_balance: newBalance }).eq('id', currentEntity.id),
        supabase.from('token_transactions').insert([{
          entity_id: currentEntity.id,
          amount: rewardAmount,
          type: 'REWARD',
          description: `Claimed validation rewards`
        }])
      ]);
      
      alert(`Đã nhận thành công ${rewardAmount} fwd vào ví!`);
      await refreshData();
    } catch (err) {
      console.error('Claim error:', err);
    }
  };

  const handleApprove = async (batchId: string) => {
    try {
      const rewardAmount = 5.0; // Higher reward for auditing
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
      
      alert(`Đã xác thực lô hàng thành công! Bạn nhận được ${rewardAmount} fwd thưởng và +1 điểm uy tín.`);
      await refreshData();
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const refreshData = async () => {
    const { data: b } = await supabase.from('batches').select('*, blockchain_ledger(tx_hash)').order('timestamp', { ascending: false });
    setBatches(b || []);
    const { data: e } = await supabase.from('entities').select('*').eq('id', currentEntity?.id || '').single();
    if (e) {
      setCurrentEntity(e);
      setBalance(Number(e.fwd_balance).toLocaleString('en-US', { minimumFractionDigits: 2 }));
    }
    const { data: tx } = await supabase.from('token_transactions').select('*').order('created_at', { ascending: false });
    setTransactions(tx || []);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-100">
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 bg-[#0a0f0a] text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 md:p-8 border-b border-white/5">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs transition-transform group-hover:scale-110">
                fwd
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
                <item.icon size={20} />
                <span className="hidden md:block font-bold text-sm">{item.label}</span>
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <button onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-400 transition-colors">
              <LogOut size={20} />
              <span className="hidden md:block font-bold text-sm">Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        {/* Top Header */}
        <header className="hidden h-20 bg-white border-b border-slate-100 px-8 lg:flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-4">
              <div className="md:hidden w-8 h-8 rounded-full bg-slate-100"></div>
              <h2 className="text-lg font-black tracking-tight uppercase italic">{currentEntity?.name || user?.user_metadata?.full_name || 'Đang tải...'} <span className="text-slate-300 text-xs font-bold not-italic ml-2 tracking-widest uppercase">ID: {currentEntity?.id?.slice(0, 8) || user?.id?.slice(0, 8)}</span></h2>
           </div>
           <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                 <Zap size={14} className="animate-pulse" />
                 {balance} fwd
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 Ledger Synced
              </div>
              <button className="relative p-2 text-slate-400 hover:text-natural-950 transition-colors">
                 <Bell size={20} />
                 <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
              <div className="w-10 h-10 rounded-full bg-natural-900 overflow-hidden border-2 border-slate-100">
                 <img src={user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&q=80"} alt="Avatar" />
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
                      {loading ? (
                        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading ledger data...</div>
                      ) : batches.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No batches found</div>
                      ) : batches.map((batch, i) => (
                        <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
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
                         {transactions.filter(t => t.type === 'GAS_FEE').reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(2)} fwd
                       </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rewards Earned</p>
                       <p className="text-3xl font-black text-emerald-500">
                         {transactions.filter(t => t.type === 'REWARD').reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(2)} fwd
                       </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Staked (Hold)</p>
                       <p className="text-3xl font-black text-blue-600">
                         {currentEntity?.staked_balance || "0.00"} fwd
                       </p>
                    </div>
                 </div>

                 {/* Staking & Rewards Console */}
                 <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-natural-950 text-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                          <ShieldCheck size={120} />
                       </div>
                       <div className="relative z-10 space-y-6">
                          <div className="space-y-1">
                             <h3 className="text-2xl font-black italic uppercase tracking-tighter">Stake <span className="text-emerald-500">to Verify</span></h3>
                             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Nâng cấp quyền hạn Node & Nhận thưởng</p>
                          </div>
                          <div className="space-y-4">
                             <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Estimated APR</p>
                                <p className="text-2xl font-black text-emerald-400">12.5% <span className="text-[10px] text-slate-400 font-bold ml-2">fwd/year</span></p>
                             </div>
                             <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
                                START STAKING
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
                             <p className="text-4xl font-black text-natural-950">42.85 <span className="text-xs text-slate-400 ml-1">fwd</span></p>
                          </div>
                       </div>
                       <button className="w-full py-5 border-2 border-slate-900 text-natural-900 hover:bg-natural-900 hover:text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all mt-6 active:scale-95">
                          CLAIM REWARDS
                       </button>
                    </div>
                 </section>

                  {/* Inter-Wallet Transfer Section */}
                  <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden p-8 md:p-12">
                    <div className="max-w-3xl mx-auto space-y-8">
                       <div className="text-center space-y-2">
                          <h3 className="text-2xl font-black text-natural-900 uppercase tracking-tighter italic">Inter-Wallet <span className="text-emerald-500">Transfer</span></h3>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Giao dịch fwd coin tức thời trên mạng lưới</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <Users size={12} /> Địa chỉ ví người nhận (MetaMask)
                             </label>
                             <input 
                               type="text" 
                               value={recipientWallet}
                               onChange={(e) => setRecipientWallet(e.target.value)}
                               placeholder="0x..." 
                               className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-mono outline-none shadow-inner focus:ring-2 focus:ring-emerald-500 transition-all" 
                             />
                             <p className="text-[8px] text-slate-400 font-medium ml-2">Nhập đúng địa chỉ 0x để đảm bảo giao dịch chính xác.</p>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <Zap size={12} /> Số lượng fwd muốn chuyển
                             </label>
                             <input 
                               type="number" 
                               value={transferAmount}
                               onChange={(e) => setTransferAmount(e.target.value)}
                               placeholder="0.00" 
                               className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black outline-none shadow-inner focus:ring-2 focus:ring-emerald-500 transition-all" 
                             />
                          </div>
                       </div>

                       <button 
                         onClick={handleTransfer}
                         disabled={isTransferring}
                         className="w-full py-5 bg-natural-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 shadow-xl shadow-natural-900/10 active:scale-[0.98] disabled:opacity-50"
                       >
                         {isTransferring ? (
                           <>
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             ĐANG XỬ LÝ GIAO DỊCH...
                           </>
                         ) : (
                           <>
                             <Send size={18} /> THỰC THI CHUYỂN COIN (EXECUTE)
                           </>
                         )}
                       </button>
                    </div>
                  </section>

                 <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                       <h3 className="text-sm font-black text-natural-900 uppercase tracking-widest">Transaction Ledger</h3>
                       <span className="text-[10px] font-bold text-slate-400">Total: {transactions.length}</span>
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
                                <p className="text-[9px] text-slate-400 font-bold tracking-widest">{new Date(tx.created_at).toLocaleDateString()}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </section>
              </motion.div>
            )}

            {activeTab === 'governance' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-natural-950 text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                       <div className="relative z-10 space-y-8">
                          <div>
                             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">My Influence</p>
                             <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Voting <br/><span className="text-white">Power</span></h3>
                          </div>
                          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                             <p className="text-5xl font-black text-white">{(Number(currentEntity?.reputation_score || 0) + (Number(currentEntity?.staked_balance || 0) * 0.1)).toFixed(1)}</p>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">vPoints</p>
                          </div>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">
                             Quyền biểu quyết của bạn được tính dựa trên điểm uy tín (Reputation) và 10% số dư Token đã đặt cọc (Stake). Càng đóng góp nhiều cho mạng lưới, tiếng nói của bạn càng quan trọng.
                          </p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 italic">Active Proposals</h4>
                          <div className="space-y-4">
                             {[
                               { title: "Nâng mức thưởng xác thực thêm 5%", votes: "82% Yes" },
                               { title: "Mở rộng mạng lưới xác thực tại Lâm Đồng", votes: "95% Yes" }
                             ].map((prop, i) => (
                               <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                  <p className="text-sm font-black text-natural-900">{prop.title}</p>
                                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">{prop.votes}</span>
                               </div>
                             ))}
                          </div>
                       </section>
                       <div className="bg-emerald-600 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden group cursor-pointer hover:bg-emerald-500 transition-all">
                          <div className="relative z-10">
                             <h4 className="text-sm font-black uppercase tracking-widest mb-2 italic">Sáng kiến mới</h4>
                             <p className="text-2xl font-black tracking-tighter leading-none">Đề xuất cải tiến <br/>mạng lưới</p>
                             <ArrowRight size={24} className="mt-6 group-hover:translate-x-2 transition-transform" />
                          </div>
                       </div>
                    </div>
                 </div>
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
                            placeholder="250.00" 
                            className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" 
                          />
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

            {activeTab === 'audit' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                 <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                       <h3 className="text-sm font-black text-natural-900 uppercase tracking-widest">Batches Awaiting Audit</h3>
                       <span className="text-[10px] font-bold text-slate-400">Pending: {batches.filter(b => b.status === 'PENDING').length}</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                       {batches.filter(b => b.status === 'PENDING').length === 0 ? (
                         <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No pending batches for audit</div>
                       ) : batches.filter(b => b.status === 'PENDING').map((batch, i) => (
                         <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                  <ShieldCheck size={18} />
                               </div>
                               <div>
                                  <p className="text-lg font-black text-natural-950 uppercase">{batch.product_name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold tracking-widest">Producer: {batch.producer_id?.slice(0,8) || 'Unknown'} • Yield: {batch.quantity} KG</p>
                               </div>
                            </div>
                            <button 
                              onClick={() => handleApprove(batch.id)}
                              className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
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

