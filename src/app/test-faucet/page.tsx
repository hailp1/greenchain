'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FWD_TOKEN_ADDRESS, FWD_STAKING_ADDRESS, FWD_ANCHOR_ADDRESS } from '@/lib/contracts/config';
import FWDTokenArtifact from '@/artifacts/contracts/FWDToken.sol/FWDToken.json';

export default function DebugDashboard() {
  const [address, setAddress] = useState('0x9f51163eCAF618ca4d1977fF71C962AeaaF43ee5');
  const [rpcStatus, setRpcStatus] = useState<'testing' | 'online' | 'offline'>('testing');
  const [contractStatus, setContractStatus] = useState<Record<string, boolean>>({});
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [faucetLogs, setFaucetLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Kiểm tra kết nối RPC
  const checkRPC = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
      const network = await provider.getNetwork();
      setRpcStatus('online');
      return network;
    } catch (err) {
      setRpcStatus('offline');
      return null;
    }
  };

  // 2. Kiểm tra các hợp đồng
  const checkContracts = async () => {
    const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
    const status: Record<string, boolean> = {};
    const contracts = [
      { name: 'Token', addr: FWD_TOKEN_ADDRESS },
      { name: 'Staking', addr: FWD_STAKING_ADDRESS },
      { name: 'Anchor', addr: FWD_ANCHOR_ADDRESS }
    ];

    for (const c of contracts) {
      try {
        const code = await provider.getCode(c.addr);
        status[c.name] = code !== '0x';
      } catch {
        status[c.name] = false;
      }
    }
    setContractStatus(status);
  };

  // 3. Gọi Faucet
  const runFaucet = async () => {
    setLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    try {
      const res = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      const data = await res.json();
      if (data.success) {
        setFaucetLogs(prev => [`[${timestamp}] ✅ Thành công: ${data.txHash.slice(0, 20)}...`, ...prev]);
      } else {
        setFaucetLogs(prev => [`[${timestamp}] ❌ Lỗi: ${data.error}`, ...prev]);
      }
    } catch (err: any) {
      setFaucetLogs(prev => [`[${timestamp}] ❌ Lỗi kết nối API`, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkRPC();
    checkContracts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            FWD SYSTEM DIAGNOSTICS
          </h1>
          <p className="text-slate-400">Trung tâm kiểm soát và chẩn đoán hạ tầng Blockchain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Infrastructure Card */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Hạ tầng mạng
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span>Public RPC (rpc.fwdlife.vn)</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${rpcStatus === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {rpcStatus.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Trạng thái Hợp đồng</p>
                {Object.entries(contractStatus).map(([name, active]) => (
                  <div key={name} className="flex justify-between items-center p-2 border-b border-white/5">
                    <span className="text-slate-300 font-mono text-xs">{name}: {name === 'Token' ? FWD_TOKEN_ADDRESS : name === 'Staking' ? FWD_STAKING_ADDRESS : FWD_ANCHOR_ADDRESS}</span>
                    <span className={active ? 'text-emerald-400' : 'text-red-400'}>
                      {active ? '● Active' : '○ Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Faucet Card */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
              ⚡ Faucet Tức thì
            </h2>
            <div className="space-y-4">
              <button 
                onClick={async () => {
                  if (!window.ethereum) return;
                  try {
                    await window.ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [{
                        chainId: '0x7a69',
                        chainName: 'fwd LIFEchain (Official)',
                        rpcUrls: ['https://rpc.fwdlife.vn/?v=final'],
                        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                        blockExplorerUrls: ['https://chain.fwdlife.vn/explorer'],
                      }],
                    });
                    alert('Đã sửa xong mạng! Bây giờ bạn hãy thử Stake lại.');
                  } catch (err) {
                    alert('Lỗi khi sửa mạng: ' + (err as any).message);
                  }
                }}
                className="w-full bg-orange-500 hover:bg-orange-400 py-2 rounded-xl font-bold transition-all text-sm mb-2"
              >
                🛠 SỬA LỖI KẾT NỐI VÍ (QUAN TRỌNG)
              </button>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">ĐỊA CHỈ VÍ NHẬN AGRI</label>
                <input 
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-xl font-mono text-sm focus:border-emerald-500 outline-none transition-all" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
              <button 
                onClick={runFaucet}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 disabled:opacity-50 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
              >
                {loading ? 'ĐANG XỬ LÝ GIAO DỊCH...' : 'MINT 1,000 AGRI NGAY'}
              </button>
            </div>
          </div>
        </div>

        {/* Logs Card */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-3xl">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Lịch sử hệ thống</h2>
          <div className="h-48 overflow-y-auto space-y-2 font-mono text-xs text-slate-400 pr-2 custom-scrollbar">
            {faucetLogs.length === 0 && <p className="italic text-slate-600">Chưa có hoạt động nào được ghi nhận...</p>}
            {faucetLogs.map((log, i) => (
              <div key={i} className="p-2 bg-white/5 rounded border-l-2 border-blue-500">
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
