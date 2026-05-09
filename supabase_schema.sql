-- 1. Entities Table (Farms/Companies)
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    wallet_address TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('FARM', 'COMPANY', 'ADMIN', 'AUDITOR')) NOT NULL,
    reputation_score INT DEFAULT 50 CHECK (reputation_score >= 0 AND reputation_score <= 100),
    is_locked BOOLEAN DEFAULT FALSE,
    lock_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Batches Table (Shipment details)
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    gps TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    status TEXT DEFAULT 'PENDING' -- PENDING, ANCHORED
);

-- 3. Blockchain Ledger (Bridge)
CREATE TABLE blockchain_ledger (
    batch_id UUID PRIMARY KEY REFERENCES batches(id) ON DELETE CASCADE,
    tx_hash TEXT NOT NULL,
    block_height BIGINT,
    merkle_root TEXT,
    anchored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Certificates Table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'VietGAP', 'GlobalGAP'
    issue_date DATE NOT NULL,
    expiry_date DATE,
    soulbound_token_id TEXT UNIQUE, -- ID on blockchain
    status TEXT DEFAULT 'ACTIVE'
);

-- 5. Reputation Logs
CREATE TABLE reputation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    previous_score INT NOT NULL,
    new_score INT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Audits (Weighted Consensus)
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    auditor_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    vote_decision TEXT CHECK (vote_decision IN ('APPROVE', 'REJECT')),
    auditor_weight NUMERIC(4,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. System Logs
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL, -- INFO, WARNING, CRITICAL
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)

-- Enable RLS
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Policies for Entities
-- Users can view all entities but only update their own
CREATE POLICY "Public can view entities" ON entities FOR SELECT USING (true);
CREATE POLICY "Entities can update own profile" ON entities FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Entities can insert own profile" ON entities FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for Batches
-- Public can view batches (QR lookup)
CREATE POLICY "Public can view batches" ON batches FOR SELECT USING (true);
-- Companies can only insert/update their own batches
CREATE POLICY "Entities can manage own batches" ON batches FOR ALL 
USING (entity_id = auth.uid());

-- Policies for Certificates
CREATE POLICY "Public can view certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Admin can manage certificates" ON certificates FOR ALL 
USING (EXISTS (SELECT 1 FROM entities WHERE id = auth.uid() AND role = 'ADMIN'));

-- 8. Auto-create entity on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.entities (id, name, role, wallet_address, reputation_score)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'FARM',
    'pending_wallet_' || substr(new.id::text, 1, 8),
    50
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
