import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { supabaseService as supabase } from '@/lib/supabase-service';
import { RPC_URL } from '@/lib/contracts/config';

export async function GET(request: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
       console.error('[Sync API] Missing SUPABASE_SERVICE_ROLE_KEY');
       return NextResponse.json({ error: 'Database authentication missing' }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    let currentBlock;
    try {
      currentBlock = await provider.getBlockNumber();
    } catch (rpcErr) {
      console.error('[Sync API] RPC Error:', rpcErr);
      return NextResponse.json({ error: 'Blockchain node unreachable' }, { status: 503 });
    }
    
    // 1. Get last synced block from sync_state table
    const { data: syncState, error: stateError } = await supabase
      .from('sync_state')
      .select('value')
      .eq('key', 'last_synced_block')
      .maybeSingle();

    if (stateError) {
       console.error('[Sync API] Database Error (sync_state):', stateError);
       return NextResponse.json({ error: 'Database table missing or unreachable' }, { status: 500 });
    }

    let lastBlock = currentBlock - 5; // Reduced default to avoid heavy initial sync
    if (syncState && syncState.value) {
      lastBlock = parseInt(syncState.value);
    }

    const blocksToSync = Math.min(currentBlock - lastBlock, 20); // Reduced batch size for stability
    if (blocksToSync <= 0) {
      return NextResponse.json({ success: true, message: 'Already up to date' });
    }

    console.log(`[Sync API] Syncing from ${lastBlock + 1} to ${lastBlock + blocksToSync}`);

    let totalSynced = 0;
    for (let i = 1; i <= blocksToSync; i++) {
      const targetBlock = lastBlock + i;
      try {
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
          const { error: upsertError } = await supabase.from('token_transactions').upsert(txs, { onConflict: 'id' });
          if (upsertError) console.warn(`[Sync API] Tx Upsert Warning at block ${targetBlock}:`, upsertError);
          totalSynced += txs.length;
        }
        
        // Always update the sync state, even if block is empty
        await supabase.from('sync_state').upsert({ 
          key: 'last_synced_block', 
          value: targetBlock.toString(),
          updated_at: new Date().toISOString()
        });
      } catch (blockErr) {
        console.error(`[Sync API] Error at block ${targetBlock}:`, blockErr);
        break; // Stop at first error to avoid massive log spam
      }
    }

    return NextResponse.json({ 
      success: true, 
      syncedBlocks: blocksToSync, 
      totalTransactions: totalSynced,
      currentChainBlock: currentBlock
    });
  } catch (err: any) {
    console.error('[Sync API] Global Catch:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
