const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function backfillAddresses() {
  console.log("Starting backfill...");
  
  // 1. Fetch all transactions
  const { data: txs, error } = await supabase.from('token_transactions').select('*, sender:sender_id(wallet_address), receiver:receiver_id(wallet_address)');
  
  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  console.log(`Found ${txs.length} transactions to check.`);

  for (const tx of txs) {
    let update = {};
    
    // Fallback for Sender
    if (!tx.sender_address) {
      if (tx.sender?.wallet_address) {
        update.sender_address = tx.sender.wallet_address;
      } else if (!tx.sender_id && (tx.type === 'MINT' || tx.type === 'REWARD')) {
        update.sender_address = '0x0000000000000000000000000000000000000000';
      }
    }

    // Fallback for Receiver
    if (!tx.receiver_address) {
      if (tx.receiver?.wallet_address) {
        update.receiver_address = tx.receiver.wallet_address;
      } else if (!tx.receiver_id && tx.type === 'STAKE') {
        update.receiver_address = '0x0000000000000000000000000000000000000000';
      }
    }

    if (Object.keys(update).length > 0) {
      const { error: upError } = await supabase.from('token_transactions').update(update).eq('id', tx.id);
      if (upError) console.error(`Error updating tx ${tx.id}:`, upError.message);
      else console.log(`Updated tx ${tx.id.slice(0,8)}`);
    }
  }

  console.log("Backfill complete.");
}

backfillAddresses();
