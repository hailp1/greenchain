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
    
    // 1. Get last synced block from sync_state table
    const { data: syncState } = await supabase
      .from('sync_state')
      .select('value')
      .eq('key', 'last_synced_block')
      .maybeSingle();

    let lastBlock = currentBlock - 10; // Default to last 10 blocks
    if (syncState && syncState.value) {
      lastBlock = parseInt(syncState.value);
    }

    const blocksToSync = Math.min(currentBlock - lastBlock, 50); // Increased to 50 for catch-up
    if (blocksToSync <= 0) {
      return NextResponse.json({ success: true, message: 'Already up to date' });
    }

    console.log(`[Sync API] Syncing from ${lastBlock + 1} to ${lastBlock + blocksToSync}`);

    let totalSynced = 0;
    for (let i = 1; i <= blocksToSync; i++) {
      const targetBlock = lastBlock + i;
      const block = await provider.getBlock(targetBlock, true);
      if (!block) continue;

      if (block.transactions && block.transactions.length > 0) {
        const txs = (block.transactions as any[]).map((tx: any) => ({
          id: tx.hash.toLowerCase(),
          sender_address: tx.from.toLowerCase(),
          receiver_address: tx.to ? tx.to.toLowerCase() : null,
          amount: parseFloat(ethers.formatEther(tx.value)),
          type: 'ON-CHAIN',
          description: `Blockchain transaction at block ${targetBlock}`,
          created_at: new Date(block.timestamp * 1000).toISOString()
        }));
        await supabase.from('token_transactions').upsert(txs, { onConflict: 'id' });
        totalSynced += txs.length;
      }
      
      // Always update the sync state, even if block is empty
      await supabase.from('sync_state').upsert({ 
        key: 'last_synced_block', 
        value: targetBlock.toString(),
        updated_at: new Date().toISOString()
      });
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
