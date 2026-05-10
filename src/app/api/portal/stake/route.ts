import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const authClient = await createServerClient();
    const { data: { session } } = await authClient.auth.getSession();

    const { entity_id, amount, tx_hash, wallet_address } = await request.json();

    if (!amount || !tx_hash || (!entity_id && !wallet_address)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Validation: If logged in with Google, entity_id must match session
    if (session && entity_id && entity_id !== session.user.id) {
       return NextResponse.json({ error: 'Unauthorized entity ID' }, { status: 403 });
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
