const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Basic .env parser
const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const dbUrl = envFile.match(/DATABASE_URL=(.+)/)?.[1]?.trim();


const sql = `
-- 1. Ensure token_transactions table has address columns
ALTER TABLE public.token_transactions 
ADD COLUMN IF NOT EXISTS sender_address TEXT,
ADD COLUMN IF NOT EXISTS receiver_address TEXT;

-- 2. Update handle_new_user function (Robust & Conflict-free)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.entities (id, name, role, wallet_address, reputation_score, fwd_balance)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email, 'New User'),
    'FARM',
    'pending_' || encode(sha256(new.id::text::bytea), 'hex'),
    50,
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Ensure Trigger is correctly linked
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

async function applyFix() {
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });


  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected. Applying SQL fixes...');
    await client.query(sql);
    console.log('✅ Database fix applied successfully!');
  } catch (err) {
    console.error('❌ Error applying fix:', err.message);
  } finally {
    await client.end();
  }
}

applyFix();
