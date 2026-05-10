import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';
import ExplorerClient from './ClientPage';

export const dynamic = 'force-dynamic';

const RPC_URL = "https://rpc.fwdlife.vn";
const rpcProvider = new ethers.JsonRpcProvider(RPC_URL, undefined, { staticNetwork: true });

export default async function ExplorerPage() {
  const [rpcResult, sbResult] = await Promise.allSettled([
    // ── RPC: fetch blocks ──
    (async () => {
      const [blockNum, feeData] = await Promise.all([
        rpcProvider.getBlockNumber(),
        rpcProvider.getFeeData()
      ]);
      const blockPromises = [];
      for (let i = 0; i < 6; i++) {
        if (blockNum - i >= 0) {
          blockPromises.push(rpcProvider.getBlock(blockNum - i).catch(() => null));
        }
      }
      const blocks = (await Promise.all(blockPromises)).filter(b => b !== null);
      return { blockNum, feeData, blocks };
    })(),

    // ── Supabase: fetch latest transactions ──
    (async () => {
      const { data, count, error } = await supabase
        .from('token_transactions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return { data, count };
    })()
  ]);

  const initialData = {
    stats: { price: '0.42', market_cap: '4.2M', latestBlock: 0, gas_price: '0.1', tps: '1.2', totalTx: '0' },
    latestBlocks: [] as any[],
    latestTxns: [] as any[]
  };

  if (rpcResult.status === 'fulfilled') {
    const { blockNum, feeData, blocks } = rpcResult.value;
    initialData.stats.latestBlock = blockNum;
    initialData.stats.gas_price = feeData?.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0.1';
    initialData.latestBlocks = blocks.map((b: any) => ({
      number: b.number,
      timestamp: b.timestamp * 1000,
      validator: b.miner || '0x...',
      transactionCount: b.transactions?.length || 0,
      reward: "0.01402 AGRI"
    }));
  }

  if (sbResult.status === 'fulfilled') {
    const { data: sbTxData, count: txCount } = sbResult.value;
    if (sbTxData) {
      initialData.latestTxns = sbTxData.map((tx: any) => ({
        hash: tx.id.replace(/-/g, '').substring(0, 40),
        timestamp: new Date(tx.created_at).getTime(),
        from: tx.sender_address || '0x000...000',
        to: tx.receiver_address || '0x000...000',
        value: `${tx.amount}`
      }));
      initialData.stats.totalTx = (txCount || 0).toLocaleString();
    }
  }

  return <ExplorerClient initialData={initialData} />;
}
