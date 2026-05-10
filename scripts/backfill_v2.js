const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const dbUrl = envFile.match(/DATABASE_URL=(.+)/)?.[1]?.trim();

async function backfill() {
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to DB. Running backfill...');

    // 1. Update MINT transactions (sender = null address)
    const res1 = await client.query(`
      UPDATE public.token_transactions 
      SET sender_address = '0x0000000000000000000000000000000000000000' 
      WHERE type = 'MINT' AND sender_address IS NULL
    `);
    console.log(`Updated ${res1.rowCount} MINT transactions.`);

    // 2. Update REWARD transactions (sender = null address)
    const res2 = await client.query(`
      UPDATE public.token_transactions 
      SET sender_address = '0x0000000000000000000000000000000000000000' 
      WHERE type = 'REWARD' AND sender_id IS NULL AND sender_address IS NULL
    `);
    console.log(`Updated ${res2.rowCount} REWARD transactions.`);

    // 3. Update STAKE transactions (receiver = null address)
    const res3 = await client.query(`
      UPDATE public.token_transactions 
      SET receiver_address = '0x0000000000000000000000000000000000000000' 
      WHERE type = 'STAKE' AND receiver_id IS NULL AND receiver_address IS NULL
    `);
    console.log(`Updated ${res3.rowCount} STAKE transactions.`);

    // 4. Update transactions for existing entities
    const res4 = await client.query(`
      UPDATE public.token_transactions t
      SET sender_address = e.wallet_address
      FROM public.entities e
      WHERE t.sender_id = e.id AND t.sender_address IS NULL
    `);
    console.log(`Updated ${res4.rowCount} transactions with sender entity addresses.`);

    const res5 = await client.query(`
      UPDATE public.token_transactions t
      SET receiver_address = e.wallet_address
      FROM public.entities e
      WHERE t.receiver_id = e.id AND t.receiver_address IS NULL
    `);
    console.log(`Updated ${res5.rowCount} transactions with receiver entity addresses.`);

    console.log('✅ Backfill completed successfully!');
  } catch (err) {
    console.error('❌ Error during backfill:', err.message);
  } finally {
    await client.end();
  }
}

backfill();
