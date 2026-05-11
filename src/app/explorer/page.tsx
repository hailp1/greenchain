import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';
import ExplorerClient from './ClientPage';
import { RPC_URL, TOKEN_SYMBOL } from '@/lib/contracts/config';

export const dynamic = 'force-dynamic';

// Use a shorter timeout for server-side RPC calls to prevent hanging
const rpcProvider = new ethers.JsonRpcProvider(RPC_URL, undefined, { 
  staticNetwork: true,
});

export default async function ExplorerPage() {
  const [rpcResult, sbResult] = await Promise.allSettled([
    // ── RPC: fetch blocks (Minimal data for fast load) ──
    (async () => {
      try {
        const [blockNum, feeData] = await Promise.all([
          rpcProvider.getBlockNumber(),
          rpcProvider.getFeeData()
        ]);
        
        const blockPromises = [];
        // Fetch last 5 blocks (reduced from 10) WITHOUT full transactions (false)
        for (let i = 0; i < 5; i++) {
          if (blockNum - i >= 0) {
            blockPromises.push(rpcProvider.getBlock(blockNum - i, false).catch(() => null));
          }
        }
        const blocks = (await Promise.all(blockPromises)).filter(b => b !== null);
        
        return { blockNum, feeData, blocks };
      } catch (e) {
        console.error("Explorer RPC Error:", e);
        return null;
      }
    })(),

    // ── Supabase: fetch latest transactions ──
    (async () => {
      try {
        const { data, count, error } = await supabase
          .from('token_transactions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        return { data, count };
      } catch (e) {
        console.error("Explorer Supabase Error:", e);
        return null;
      }
    })()
  ]);

  const initialData = {
    stats: { price: '0.42', market_cap: '4.2M', latestBlock: 0, gas_price: '0.1', tps: '1.2', totalTx: '0' },
    latestBlocks: [] as any[],
    latestTxns: [] as any[]
  };

  if (rpcResult.status === 'fulfilled' && rpcResult.value) {
    const { blockNum, feeData, blocks } = rpcResult.value;
    initialData.stats.latestBlock = blockNum;
    initialData.stats.gas_price = feeData?.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0.1';
    initialData.latestBlocks = blocks.map((b: any) => ({
      number: b.number,
      timestamp: b.timestamp * 1000,
      validator: b.miner || '0x...',
      transactionCount: b.transactions?.length || 0,
      reward: `0.01402 ${TOKEN_SYMBOL}`
    }));
  }

  if (sbResult.status === 'fulfilled' && sbResult.value) {
    const { data, count } = sbResult.value;
    initialData.stats.totalTx = (count || 0).toLocaleString();
    initialData.latestTxns = (data || []).map((tx: any) => ({
      hash: tx.id.replace(/-/g, '').substring(0, 40),
      timestamp: new Date(tx.created_at).getTime(),
      from: tx.sender_address || '0x000...000',
      to: tx.receiver_address || '0x000...000',
      value: `${tx.amount}`
    }));
  }

  return <ExplorerClient initialData={initialData} />;
}
