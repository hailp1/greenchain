const { Client } = require('pg');
const DATABASE_URL = "postgresql://postgres:zuNaIbmHqMAbkCgr@db.udubfpphwmxgqmbhukbt.supabase.co:5432/postgres";

async function setupSync() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    // Create sync_state table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sync_state (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Initialize with current block if empty
    await client.query(`
      INSERT INTO sync_state (key, value) 
      VALUES ('last_synced_block', '22330')
      ON CONFLICT (key) DO NOTHING;
    `);
    
    console.log("Sync state table initialized successfully.");
  } catch (err) {
    console.error("Setup error:", err);
  } finally {
    await client.end();
  }
}

setupSync();
