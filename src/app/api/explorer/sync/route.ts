import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';

const RPC_URL = "https://rpc.fwdlife.vn";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const currentBlock = await provider.getBlockNumber();
    
    // 1. Find the last synced block from DB
    const { data: lastTx } = await supabase
      .from('token_transactions')
      .select('description')
      .ilike('description', 'Blockchain transaction at block %')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let lastBlock = currentBlock - 5; // Default to last 5 blocks if not found
    if (lastTx) {
      const match = lastTx.description.match(/block (\d+)/);
      if (match) lastBlock = parseInt(match[1]);
    }

    const blocksToSync = Math.min(currentBlock - lastBlock, 20); // Limit to 20 blocks per call
    console.log(`[Sync API] Syncing from ${lastBlock + 1} to ${lastBlock + blocksToSync}`);

    let totalSynced = 0;
    for (let i = 1; i <= blocksToSync; i++) {
      const targetBlock = lastBlock + i;
      const block = await provider.getBlock(targetBlock, true);
      if (!block || !block.transactions) continue;

      const txs = block.transactions.map(tx => ({
        id: tx.hash.toLowerCase(),
        sender_address: tx.from.toLowerCase(),
        receiver_address: tx.to ? tx.to.toLowerCase() : null,
        amount: parseFloat(ethers.formatEther(tx.value)),
        type: 'ON-CHAIN',
        description: `Blockchain transaction at block ${targetBlock}`,
        created_at: new Date(block.timestamp * 1000).toISOString()
      }));

      if (txs.length > 0) {
        await supabase.from('token_transactions').upsert(txs, { onConflict: 'id' });
        totalSynced += txs.length;
      }
    }

    return NextResponse.json({ 
      success: true, 
      syncedBlocks: blocksToSync, 
      totalTransactions: totalSynced,
      currentChainBlock: currentBlock
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
