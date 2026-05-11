import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { entity_id, wallet_address } = await request.json();

    if (!entity_id && !wallet_address) {
      return NextResponse.json({ error: 'Missing identity' }, { status: 400 });
    }

    // 2. Fetch Entity
    let targetEntity = null;
    if (entity_id) {
       const { data } = await supabase.from('entities').select('*').eq('id', entity_id).maybeSingle();
       targetEntity = data;
    } else if (wallet_address) {
       const { data } = await supabase.from('entities').select('*').ilike('wallet_address', wallet_address).maybeSingle();
       targetEntity = data;
    }

    if (!targetEntity) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // 3. Rate Limit: Check last claim
    const today = new Date().toISOString().split('T')[0];
    if (targetEntity.last_daily_claim) {
       const lastDate = new Date(targetEntity.last_daily_claim).toISOString().split('T')[0];
       if (lastDate === today) {
          return NextResponse.json({ error: 'Already claimed today' }, { status: 429 });
       }
    }

    // 4. Calculate Reward
    const stakeAmount = Number(targetEntity.staked_balance || 0);
    if (stakeAmount < 1) {
       return NextResponse.json({ error: 'Insufficient stake' }, { status: 400 });
    }
    const rewardAmount = Math.min(500, Math.floor(stakeAmount * 0.001));
    if (rewardAmount <= 0) return NextResponse.json({ error: 'Reward too small' }, { status: 400 });

    // 5. Update & Log
    const { error: updateError } = await supabase
      .from('entities')
      .update({ last_daily_claim: new Date().toISOString() })
      .eq('id', targetEntity.id);

    if (updateError) throw updateError;

    const { error: txError } = await supabase.from('token_transactions').insert([{
       receiver_id: targetEntity.id,
       receiver_address: targetEntity.wallet_address,
       sender_address: '0x0000000000000000000000000000000000000000',
       amount: rewardAmount,
       type: 'REWARD',
       description: `Daily Stake Loyalty Reward (${rewardAmount} AGRI)`
    }]);

    if (txError) throw txError;

    return NextResponse.json({ success: true, reward: rewardAmount });
  } catch (err: any) {
    console.error('[API Claim] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
