import { NextResponse } from 'next/server';
import { supabaseService as supabase } from '@/lib/supabase-service';
import { TOKEN_SYMBOL } from '@/lib/contracts/config';

export async function POST(request: Request) {
  try {
    const { sender_id, sender_address, receiver_address, amount, tx_hash } = await request.json();

    if (!amount || !tx_hash || !sender_address || !receiver_address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }


    // 2. Fetch Receiver Entity (Optional, for analytics)
    const { data: receiverEntity } = await supabase
      .from('entities')
      .select('id')
      .ilike('wallet_address', receiver_address)
      .maybeSingle();

    // 3. Log Transaction
    const { error: txError } = await supabase.from('token_transactions').insert([{
      sender_id: sender_id || null,
      receiver_id: receiverEntity?.id || null,
      sender_address: sender_address,
      receiver_address: receiver_address,
      amount: parseFloat(amount),
      type: 'PAYMENT',
      description: `Transferred ${TOKEN_SYMBOL} to ${receiver_address.slice(0, 10)}... (TX: ${tx_hash.slice(0,8)})`
    }]);

    if (txError) throw txError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API Transfer] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
