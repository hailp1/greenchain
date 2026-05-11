-- Green Chain Supabase Schema Migration (Rebranding & Synchronization)

-- 1. Rename fwd_balance to gre_balance in entities table
ALTER TABLE public.entities RENAME COLUMN fwd_balance TO gre_balance;

-- 2. Create sync_state table for blockchain indexing
CREATE TABLE IF NOT EXISTS public.sync_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Update handle_new_user function for rebranding
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.entities (id, name, role, wallet_address, reputation_score, gre_balance)
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

-- 4. Update Token Transactions type check to include ON-CHAIN
ALTER TABLE public.token_transactions 
DROP CONSTRAINT IF EXISTS token_transactions_type_check;

ALTER TABLE public.token_transactions 
ADD CONSTRAINT token_transactions_type_check 
CHECK (type IN ('GAS_FEE', 'REWARD', 'PAYMENT', 'MINT', 'STAKE', 'UNSTAKE', 'ON-CHAIN'));

-- 5. Update claim_wallet_connection_reward for GRE
CREATE OR REPLACE FUNCTION public.claim_wallet_connection_reward(p_user_id UUID, p_wallet_address TEXT)
RETURNS void AS $$
DECLARE
    v_has_claimed BOOLEAN;
BEGIN
    -- Check if reward already claimed
    SELECT EXISTS (
        SELECT 1 FROM public.token_transactions 
        WHERE receiver_id = p_user_id AND type = 'REWARD' AND description LIKE 'Wallet connection reward%'
    ) INTO v_has_claimed;

    IF NOT v_has_claimed THEN
        -- Add 1000 GRE reward and link wallet
        UPDATE public.entities 
        SET gre_balance = gre_balance + 1000,
            wallet_address = p_wallet_address
        WHERE id = p_user_id;

        -- Log transaction
        INSERT INTO public.token_transactions (receiver_id, amount, type, description)
        VALUES (p_user_id, 1000, 'REWARD', 'Green Chain onboarding reward (1000 GRE)');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Initialize Sync State
INSERT INTO public.sync_state (key, value)
VALUES ('last_synced_block', '0')
ON CONFLICT (key) DO NOTHING;
