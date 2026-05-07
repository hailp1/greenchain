-- 1. Entities Table (Farms/Companies)
CREATE TABLE IF NOT EXISTS entities (
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
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    gps TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image_url TEXT,
    status TEXT DEFAULT 'PENDING'
);

-- 3. Blockchain Ledger (Bridge)
CREATE TABLE IF NOT EXISTS blockchain_ledger (
    batch_id UUID PRIMARY KEY REFERENCES batches(id) ON DELETE CASCADE,
    tx_hash TEXT NOT NULL,
    block_height BIGINT,
    merkle_root TEXT,
    anchored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    soulbound_token_id TEXT UNIQUE,
    status TEXT DEFAULT 'ACTIVE'
);

-- 5. Reputation Logs
CREATE TABLE IF NOT EXISTS reputation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    previous_score INT NOT NULL,
    new_score INT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Audits (Weighted Consensus)
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
    auditor_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    vote_decision TEXT CHECK (vote_decision IN ('APPROVE', 'REJECT')),
    auditor_weight NUMERIC(4,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Data for initial launch
INSERT INTO entities (name, wallet_address, role, reputation_score) VALUES 
('Nông trại Atisô Lạc Dương', '0x7a2d4E813F0C5...f9e1', 'FARM', 95),
('Hợp tác xã Yến sào Ninh Hòa', '0xBc29...A1f0', 'COMPANY', 88),
('Hệ thống Kiểm định fwd', '0xAdmin...Root', 'ADMIN', 100)
ON CONFLICT (wallet_address) DO NOTHING;
