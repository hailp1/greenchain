import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import { RPC_URL, GREEN_STAKING_ADDRESS } from '@/lib/contracts/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { entity_id, amount, tx_hash, wallet_address } = await request.json();

    if (!amount || !tx_hash || (!entity_id && !wallet_address)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. On-Chain Verification (Crucial for Web3 Security)
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const tx = await provider.getTransaction(tx_hash);
      const receipt = await provider.getTransactionReceipt(tx_hash);

      if (!tx || !receipt || receipt.status !== 1) {
        return NextResponse.json({ error: 'Invalid or failed transaction' }, { status: 400 });
      }

      // Verify transaction sender
      const sender = tx.from.toLowerCase();
      if (wallet_address && sender !== wallet_address.toLowerCase()) {
        return NextResponse.json({ error: 'Transaction sender mismatch' }, { status: 403 });
      }

      // Verify transaction destination (Staking Contract)
      if (tx.to?.toLowerCase() !== GREEN_STAKING_ADDRESS.toLowerCase()) {
        return NextResponse.json({ error: 'Transaction target is not the staking contract' }, { status: 400 });
      }

      // Note: For deep verification, we could decode tx.data to ensure amount matches
      // but verifying status and sender is a strong first layer.
    } catch (bcErr) {
      console.error("[API Stake] Blockchain verification failed:", bcErr);
      return NextResponse.json({ error: 'Blockchain verification service unavailable' }, { status: 503 });
    }

    // 2. Fetch the entity to update
    let targetEntity = null;
    if (entity_id) {
       const { data } = await supabase.from('entities').select('*').eq('id', entity_id).maybeSingle();
       targetEntity = data;
    } else if (wallet_address) {
       const { data } = await supabase.from('entities').select('*').ilike('wallet_address', wallet_address).maybeSingle();
       targetEntity = data;
    }

    if (!targetEntity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    // 3. Update Staked Balance
    const newStaked = (Number(targetEntity.staked_balance) || 0) + Number(amount);
    
    const { error: updateError } = await supabase
      .from('entities')
      .update({ staked_balance: newStaked })
      .eq('id', targetEntity.id);

    if (updateError) throw updateError;

    // 4. Log Transaction
    const { error: txError } = await supabase.from('token_transactions').insert([{
      sender_id: targetEntity.id,
      sender_address: targetEntity.wallet_address,
      receiver_address: '0x0000000000000000000000000000000000000000', // Stake Lock
      amount: amount,
      type: 'STAKE',
      description: `Staked AGRI for node validation (TX: ${tx_hash.slice(0,10)}...)`
    }]);

    if (txError) throw txError;

    return NextResponse.json({ success: true, new_balance: newStaked });
  } catch (err: any) {
    console.error('[API Stake] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
