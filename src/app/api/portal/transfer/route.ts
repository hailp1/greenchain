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

    const { sender_id, sender_address, receiver_address, amount, tx_hash } = await request.json();

    if (!amount || !tx_hash || !sender_address || !receiver_address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Validation: If logged in with Google, sender_id must match session
    if (session && sender_id && sender_id !== session.user.id) {
       return NextResponse.json({ error: 'Unauthorized sender' }, { status: 403 });
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
      description: `Transferred AGRI to ${receiver_address.slice(0, 10)}... (TX: ${tx_hash.slice(0,8)})`
    }]);

    if (txError) throw txError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API Transfer] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
