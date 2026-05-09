'use client';
import { useState } from 'react';

export default function FaucetTest() {
  const [address, setAddress] = useState('0x9f51163eCAF618ca4d1977fF71C962AeaaF43ee5');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testFaucet = async () => {
    setLoading(true);
    setResult('Đang gọi API...');
    try {
      const res = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-20 space-y-4">
      <h1 className="text-2xl font-bold">Kiểm tra Faucet API</h1>
      <input 
        className="w-full p-2 border" 
        value={address} 
        onChange={e => setAddress(e.target.value)}
      />
      <button 
        onClick={testFaucet}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Đang chạy...' : 'CHẠY THỬ NGAY'}
      </button>
      <pre className="p-4 bg-gray-100 rounded border">
        {result}
      </pre>
    </div>
  );
}
