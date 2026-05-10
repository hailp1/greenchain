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
import { ethers } from 'ethers';

export default function ProducerPortal() {
  const web3 = useWeb3();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSigning, setIsSigning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [blockHeight, setBlockHeight] = useState(19450300);
  const [tps, setTps] = useState(12.3);

  // Network Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setBlockHeight(prev => prev + 1);
      setTps(11.5 + Math.random() * 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const [batches, setBatches] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipientWallet, setRecipientWallet] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<any>(null);

  const [stakeInput, setStakeInput] = useState("100");
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const [newHarvest, setNewHarvest] = useState({
    product_name: '',
    quantity: 0,
    gps: ''
  });

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [balance, setBalance] = useState("0.00");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const fetchBalance = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from('entities')
        .select('wallet_address')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (data?.wallet_address) {
         try {
            const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
            const bal = await provider.getBalance(data.wallet_address);
            setBalance(ethers.formatEther(bal));
            return;
         } catch (e) {
            console.error("Portal balance fetch error:", e);
         }
      }
    }
    
    if (walletAddress) {
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        const bal = await provider.getBalance(walletAddress);
        setBalance(ethers.formatEther(bal));
      } catch (e) {}
    }
  };

  // ─── Authentication Logic ────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    
    // 1. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[Portal] Auth Event:", event);
      if (session) {
        console.log("[Portal] Session active:", session.user.email);
        setUser(session.user);
        setAuthLoading(false);
      } else if (event === 'SIGNED_OUT') {
        console.log("[Portal] User signed out, redirecting...");
        window.location.href = '/signin';
      }
    });

    // 2. Initial Session Check
    const checkInitialAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("[Portal] Initial session found:", session.user.id);
          setUser(session.user);
          setAuthLoading(false);
          return;
        }

        // Handle Google Redirect Hash - give more time
        if (window.location.hash.includes('access_token')) {
          console.log("[Portal] Detected OAuth hash, suspending redirect for 10s...");
          // Wait longer for Supabase to parse the hash
          setTimeout(async () => {
            const { data: { session: finalSession } } = await supabase.auth.getSession();
            if (finalSession) {
               console.log("[Portal] OAuth Success after wait");
               setUser(finalSession.user);
               setAuthLoading(false);
            } else {
               console.log("[Portal] OAuth failed after 10s, redirecting...");
               window.location.href = '/signin';
            }
          }, 10000);
          return;
        }

        console.log("[Portal] No Supabase session, waiting for wallet...");
      } catch (err) {
        console.error("[Portal] Auth check error:", err);
      }
    };

    checkInitialAuth();
    return () => subscription.unsubscribe();
  }, []);

  // 3. Monitor for MetaMask Connection or Timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Only run timeout if we aren't in the middle of an OAuth redirect
    if (authLoading && !window.location.hash.includes('access_token')) {
      if (web3.isConnected) {
        console.log("[Portal] Authorized via Wallet:", web3.address);
        setAuthLoading(false);
      } else {
        // Wait 5 seconds for wallet to initialize before forcing signin
        timeoutId = setTimeout(async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session || web3.isConnected) {
            setAuthLoading(false);
          } else {
            console.log("[Portal] Total Auth Failure, forcing login...");
            window.location.href = '/signin';
          }
        }, 5000);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [authLoading, web3.isConnected, web3.address]);

  useEffect(() => {
    console.log("[Portal] Auth State:", { authLoading, user: user?.id, isConnected: web3.isConnected });
  }, [authLoading, user, web3.isConnected]);

  useEffect(() => {
    if (web3.isConnected && web3.address) {
      setWalletAddress(web3.address);
      fetchBalance();
    }
  }, [web3.isConnected, web3.address]);

  useEffect(() => {
    fetchBalance();
  }, [walletAddress, user]);

  useEffect(() => {
    if (!authLoading) setMounted(true);
  }, [authLoading]);

  useEffect(() => {
    const fetchEntityData = async () => {
      // 1. Priority: Logged in user (Supabase Auth)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: entity } = await supabase
          .from('entities')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (entity) {
          // AUTO-LINK Wallet: If logged in but wallet is 'pending', link current MetaMask address
          if (entity.wallet_address?.startsWith('pending_') && web3.isConnected && web3.address) {
             console.log("[Portal] Activating wallet for user:", web3.address);
             const { data: updated } = await supabase
               .from('entities')
               .update({ wallet_address: web3.address.toLowerCase() })
               .eq('id', entity.id)
               .select()
               .single();
             if (updated) {
                setCurrentEntity(updated);
                setWalletAddress(web3.address);
                fetchBalance();
                return;
             }
          }
          
          setCurrentEntity(entity);
          if (entity.wallet_address && !entity.wallet_address.startsWith('pending_')) {
            setWalletAddress(entity.wallet_address);
          }
          fetchBalance();
          return;
        }
      }

      // 2. Secondary: Connected Wallet (MetaMask/Guest)
      if (!web3.isConnected || !web3.address) return;
      const addr = web3.address.toLowerCase();
      
      const { data: existingEntity } = await supabase
        .from('entities')
        .select('*')
        .ilike('wallet_address', addr)
        .maybeSingle();
      
      if (existingEntity) {
        setCurrentEntity(existingEntity);
        setWalletAddress(addr);
        fetchBalance();
      } else {
        // AUTO-CREATE Entity for new wallet connections (Guest Mode)
        const { data: newEntity } = await supabase
          .from('entities')
          .insert([{
            name: `Guest ${addr.substring(0, 6)}`,
            wallet_address: addr,
            role: 'FARM',
            reputation_score: 50,
            fwd_balance: 0
          }])
          .select()
          .maybeSingle();
        
        if (newEntity) {
          setCurrentEntity(newEntity);
          setWalletAddress(addr);
        }
      }
    };
    fetchEntityData();
  }, [walletAddress, user, web3.isConnected, web3.address]);

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
          sender_id: currentEntity?.id,
          amount: parseFloat(transferAmount),
          type: 'PAYMENT',
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



  const handleSign = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/batch', {
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

      // Validation: Check Token Balance (fwdBalance) instead of Native Balance (gas)
      if (parseFloat(web3.fwdBalance) < amount) {
        alert(`Số dư AGRI Token của bạn (${web3.fwdBalance}) không đủ để Stake ${amount} AGRI. Bạn có thể dùng nút CLAIM để nhận thêm.`);
        setIsSigning(false);
        return;
      }

      // Ensure user has at least some native balance for gas
      if (parseFloat(web3.balance) < 0.001) {
        alert("Số dư phí gas (Native AGRI) quá thấp. Vui lòng nhận thêm từ Faucet.");
        setIsSigning(false);
        return;
      }

      const txHash = await web3.stakeTokens(amount.toString());
      if (txHash) {
        setLastTxHash(txHash);
        
        if (currentEntity) {
          const newStaked = (Number(currentEntity.staked_balance) || 0) + amount;
          await Promise.all([
            supabase.from('entities').update({ staked_balance: newStaked }).eq('id', currentEntity.id),
            supabase.from('token_transactions').insert([{
              sender_id: currentEntity.id,
              sender_address: currentEntity.wallet_address,
              receiver_address: '0x0000000000000000000000000000000000000000', // Burn/Stake Lock
              amount: amount,
              type: 'STAKE',
              description: `Staked AGRI for node validation`
            }])
          ]);
        }
        
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
        
        if (currentEntity) {
          await supabase.from('token_transactions').insert([{
            receiver_id: currentEntity.id,
            receiver_address: currentEntity.wallet_address,
            sender_address: '0x0000000000000000000000000000000000000000', // Reward Pool
            amount: rewardAmount,
            type: 'REWARD',
            description: `Claimed validation rewards`
          }]);
        }
        
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
          receiver_id: currentEntity.id,
          receiver_address: currentEntity.wallet_address,
          sender_address: '0x0000000000000000000000000000000000000000', // System Pool
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

  // Final check for auth loading before rendering the main UI
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-emerald-500 font-black text-xs uppercase tracking-widest animate-pulse">
            Verifying Research Identity...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-emerald-100">
      <aside className="w-20 md:w-64 bg-[#0a0f0a] text-white flex flex-col sticky top-0 h-screen z-[60] transition-all duration-300">
        <div className="p-4 md:p-8 border-b border-white/5 flex justify-center md:justify-start">
           <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0">fwd</div>
              <div className="flex flex-col hidden md:block">
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
             { id: 'overview', label: 'Network Overview', icon: LayoutDashboard },
             { id: 'supply', label: 'Supply Chain', icon: PackagePlus, roles: ['FARM', 'COMPANY', 'ADMIN'] },
             { id: 'audit', label: 'Audit & Verify', icon: ShieldCheck, roles: ['AUDITOR', 'GOVERNMENT', 'ADMIN'] },
             { id: 'staking', label: 'Validator Hub', icon: Cpu },
             { id: 'portfolio', label: 'Assets & History', icon: Zap },
             { id: 'governance', label: 'Governance', icon: Globe },
             { id: 'settings', label: 'System Settings', icon: Settings }
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

      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-16 md:h-20 bg-white border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-4 md:gap-8 min-w-0 shrink">
              <h2 className="text-[10px] md:text-lg font-black tracking-tight uppercase italic truncate">
                {currentEntity?.name || user?.user_metadata?.full_name || (authLoading ? 'Verifying...' : 'Guest Node')} 
              </h2>
              
              {/* Network Pulse - NEW */}
              <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="flex flex-col">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Mainnet Height</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600">#{blockHeight.toLocaleString()}</span>
                 </div>
                 <div className="w-px h-6 bg-slate-200"></div>
                 <div className="flex flex-col">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Network TPS</span>
                    <span className="text-[10px] font-mono font-bold text-blue-600">{tps.toFixed(1)}</span>
                 </div>
                 <div className="w-px h-6 bg-slate-200"></div>
                 <div className="flex flex-col">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Stability</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-500">99.99%</span>
                 </div>
              </div>
           </div>
           <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className="flex flex-col items-end">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-100 text-[9px] md:text-[10px] font-black text-emerald-700 uppercase tracking-widest shrink-0">
                    <Zap size={10} className="animate-pulse text-emerald-500" />
                    {mounted ? Number(web3.fwdBalance).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'} <span className="opacity-50">AGRI</span>
                 </div>
                 {mounted && web3.isConnected && (
                    <span className="text-[8px] text-slate-400 font-bold uppercase mt-1">Gas: {Number(web3.balance).toFixed(4)} AGRI</span>
                 )}
              </div>

              {!web3.isConnected ? (
                <button 
                  onClick={() => web3.connect()}
                  className="px-3 md:px-6 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 shrink-0"
                >
                   CONNECT
                </button>
              ) : (
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
                    className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 shrink-0"
                 >
                    <span className="hidden sm:inline">{isSigning ? "WAITING..." : "CLAIM 1,000 AGRI"}</span>
                    <span className="sm:hidden">{isSigning ? "..." : "CLAIM"}</span>
                 </button>
              )}

               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-emerald-600" />
                  )}
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
                    <Link href={`/explorer/tx/${lastTxHash}`} className="text-[10px] font-black underline mt-2 uppercase tracking-widest">View in Explorer</Link>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>

        <div className="p-4 md:p-12 space-y-8 md:space-y-12 overflow-y-auto max-h-[calc(100vh-4rem)]">
           {activeTab === 'overview' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
                 {/* Network Vital Signs */}
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                        <div className="text-emerald-500 mb-4 bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center"><Activity size={18} /></div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Block</p>
                        <p className="text-xl md:text-2xl font-black text-natural-950">#{blockHeight.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                        <div className="text-blue-500 mb-4 bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center"><Zap size={18} /></div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Network TPS</p>
                        <p className="text-xl md:text-2xl font-black text-natural-950">{tps.toFixed(1)} / 1.5k</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                        <div className="text-purple-500 mb-4 bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center"><Cpu size={18} /></div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Nodes</p>
                        <p className="text-xl md:text-2xl font-black text-natural-950">1,204</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                        <div className="text-amber-500 mb-4 bg-amber-50 w-10 h-10 rounded-xl flex items-center justify-center"><Globe size={18} /></div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value Locked</p>
                        <p className="text-xl md:text-2xl font-black text-natural-950">84.2M <span className="text-[10px] opacity-40">AGRI</span></p>
                    </div>
                 </div>

                 {/* My Ecosystem Portfolio */}
                 <section className="bg-natural-950 rounded-[4rem] p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                    <div className="relative z-10 space-y-8">
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div>
                             <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">My Portfolio</h3>
                             <p className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter italic font-serif">Layer 1 <span className="text-emerald-400">Assets</span></p>
                          </div>
                          <button onClick={() => setActiveTab('portfolio')} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Details Hub</button>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Available</p>
                             <p className="text-2xl font-black text-emerald-400">{mounted ? Number(web3.fwdBalance).toLocaleString() : '0'} <span className="text-xs opacity-50 font-normal">AGRI</span></p>
                          </div>
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Staked</p>
                             <p className="text-2xl font-black">{mounted ? Number(web3.stakedBalance).toLocaleString() : '0'} <span className="text-xs opacity-50 font-normal">AGRI</span></p>
                          </div>
                          <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                             <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-2">Unclaimed Rewards</p>
                             <p className="text-2xl font-black text-emerald-400">{mounted ? Number(web3.pendingRewards).toLocaleString() : '0'} <span className="text-xs opacity-50 font-normal">AGRI</span></p>
                          </div>
                       </div>
                    </div>
                 </section>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Feed */}
                    <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                       <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                          <h3 className="text-xs font-black text-natural-900 uppercase tracking-widest">Network Live Feed</h3>
                          <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black animate-pulse">● LIVE</span>
                       </div>
                       <div className="p-4 space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 font-mono text-[10px]">B{blockHeight - i}</div>
                                  <div>
                                     <p className="text-[10px] font-black text-natural-950 uppercase">Block Verified</p>
                                     <p className="text-[8px] text-slate-400 font-bold uppercase">By Node: 0x{Math.random().toString(16).slice(2, 8)}...{Math.random().toString(16).slice(2, 6)}</p>
                                  </div>
                               </div>
                               <div className="text-[8px] font-black text-emerald-600 uppercase">+1.2 AGRI Reward</div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Governance Peek */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-8 space-y-6">
                       <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-natural-900 uppercase tracking-widest">DAO Governance</h3>
                          <Globe size={16} className="text-slate-300" />
                       </div>
                       <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-[7px] font-black uppercase tracking-widest">Active Proposal</span>
                          <p className="text-xs font-black text-natural-900 leading-relaxed uppercase italic">#042: Cập nhật APR Staking lên 15.5% cho chu kỳ tiếp theo</p>
                          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                             <div className="bg-emerald-500 h-full w-[72%]"></div>
                          </div>
                          <div className="flex justify-between text-[7px] font-black uppercase text-slate-400 tracking-widest">
                             <span>Yes: 72%</span>
                             <span>No: 28%</span>
                          </div>
                       </div>
                       <button onClick={() => setActiveTab('governance')} className="w-full py-4 border-2 border-slate-100 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all">Go to Voting</button>
                    </div>
                 </div>

              </motion.div>
            )}
           {/* End Overview */}

           {activeTab === 'supply' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12">
                 <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">Supply Chain <span className="text-emerald-500">Ops</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Blockchain Ledger for Agricultural Verification</p>
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
                             <option value="">Select Product...</option>
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

                 <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                       <h3 className="text-sm font-black text-natural-900 uppercase tracking-widest">Recent Batch History</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                       {batches.length === 0 ? (
                         <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No operational batches found</div>
                       ) : batches.map((batch, i) => (
                         <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                  <PackagePlus size={18} />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-natural-950 uppercase">{batch.product_name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold tracking-widest">ID: {batch.id.slice(0,8)}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-black text-natural-950">{batch.quantity} KG</p>
                               <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${batch.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                  {batch.status}
                               </span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
              </motion.div>
           )}

           {activeTab === 'staking' && (
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
                               {mounted && web3.isConnected ? Number(web3.pendingRewards).toFixed(2) : '0.00'} 
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
                                   {tx.type === 'GAS_FEE' || tx.type === 'STAKE' ? '-' : '+'}{tx.amount} AGRI
                                </p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </section>
              </motion.div>
           )}

           {activeTab === 'portfolio' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
                       <div className="space-y-2">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Asset Transfer</h3>
                          <p className="text-3xl font-black italic uppercase tracking-tighter">Send <span className="text-emerald-500">AGRI</span></p>
                       </div>
                       <div className="space-y-4">
                          <input 
                             type="text" 
                             placeholder="Recipient Wallet Address (0x...)"
                             value={recipientWallet}
                             onChange={(e) => setRecipientWallet(e.target.value)}
                             className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          <input 
                             type="number" 
                             placeholder="Amount"
                             value={transferAmount}
                             onChange={(e) => setTransferAmount(e.target.value)}
                             className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          <button 
                            onClick={handleTransfer}
                            disabled={isTransferring}
                            className="w-full py-6 bg-natural-900 text-white rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10"
                          >
                             {isTransferring ? 'PROCESSING...' : 'EXECUTE TRANSFER'}
                          </button>
                       </div>
                    </div>

                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col justify-between">
                       <div className="space-y-6 text-center">
                          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                             <Globe size={32} className="text-emerald-500" />
                          </div>
                          <h3 className="text-xl font-black uppercase tracking-widest">Digital Passport</h3>
                          <p className="text-slate-500 text-sm font-medium">Your wallet is your identity on fwd LIFEchain. Use it to verify agricultural origins and manage network assets.</p>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[10px] break-all text-center text-slate-400">
                          {web3.address}
                       </div>
                    </div>
                 </div>

                 <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                       <h3 className="text-sm font-black text-natural-900 uppercase tracking-widest">Transaction History</h3>
                    </div>
                    <div className="divide-y divide-slate-50">
                       {transactions.length === 0 ? (
                          <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No recent transactions found on ledger</div>
                       ) : transactions.map((tx, i) => (
                          <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'REWARD' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                   {tx.type === 'REWARD' ? <Award size={18} /> : <Send size={18} />}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-natural-950 uppercase">{tx.type.replace('_', ' ')}</p>
                                   <p className="text-[10px] text-slate-400 font-bold">{new Date(tx.created_at).toLocaleString()}</p>
                                </div>
                             </div>
                             <p className={`text-sm font-black ${tx.type === 'REWARD' ? 'text-emerald-600' : 'text-natural-900'}`}>
                                {tx.type === 'REWARD' ? '+' : '-'}{tx.amount} AGRI
                             </p>
                          </div>
                       ))}
                    </div>
                 </section>
              </motion.div>
           )}

           {activeTab === 'governance' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12">
                 <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">Network <span className="text-emerald-500">Governance</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Decentralized Decision Making for fwd LIFEchain</p>
                 </div>

                 <div className="grid grid-cols-1 gap-8">
                    {[
                       { id: 42, title: "Cập nhật APR Staking lên 15.5% cho chu kỳ tiếp theo", status: "Active", end: "2 days left", votes: 72 },
                       { id: 41, title: "Mở rộng danh mục Nông sản xác thực vùng Tây Nguyên", status: "Active", end: "5 days left", votes: 89 },
                       { id: 40, title: "Tích hợp AI Oracle cho xác thực GPS và Khí hậu", status: "Ended", end: "Passed", votes: 94 }
                    ].map((p) => (
                       <div key={p.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-emerald-200 transition-all">
                          <div className="space-y-2">
                             <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded-full text-[7px] font-black uppercase ${p.status === 'Active' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>{p.status}</span>
                                <span className="text-[10px] font-mono text-slate-400">Proposal #{p.id}</span>
                             </div>
                             <h4 className="text-xl font-black text-natural-900 italic uppercase italic font-serif leading-tight">{p.title}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Closing in: {p.end}</p>
                          </div>
                          <div className="flex flex-col items-center gap-2 shrink-0">
                             <p className="text-2xl font-black text-emerald-600">{p.votes}% <span className="text-[10px] opacity-40 font-normal">YES</span></p>
                             <button className="px-8 py-3 bg-natural-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10">CAST VOTE</button>
                          </div>
                       </div>
                    ))}
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
