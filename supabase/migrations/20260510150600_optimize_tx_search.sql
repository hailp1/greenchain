-- Optimize token_transactions table for faster search in Explorer and Portal
-- Created: 2026-05-10

-- 1. Create Index for Sender Address (Wallet search)
CREATE INDEX IF NOT EXISTS idx_token_transactions_sender_address ON token_transactions (sender_address);

-- 2. Create Index for Receiver Address (Wallet search)
CREATE INDEX IF NOT EXISTS idx_token_transactions_receiver_address ON token_transactions (receiver_address);

-- 3. Create Index for Sender ID (Google User search)
CREATE INDEX IF NOT EXISTS idx_token_transactions_sender_id ON token_transactions (sender_id);

-- 4. Create Index for Receiver ID (Google User search)
CREATE INDEX IF NOT EXISTS idx_token_transactions_receiver_id ON token_transactions (receiver_id);

-- 5. Create Compound Index for combined address search with sorting
CREATE INDEX IF NOT EXISTS idx_token_transactions_combined_addr_date ON token_transactions (sender_address, receiver_address, created_at DESC);

-- 6. Update statistics for the planner
ANALYZE token_transactions;
