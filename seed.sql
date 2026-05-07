-- SEED DATA FOR FWD LIFECHAIN PREMIUM EXPERIENCE
-- This file populates the database with realistic, high-fidelity research data

-- 1. Entities (Farms, Companies, Auditors)
INSERT INTO entities (name, wallet_address, role, reputation_score) VALUES 
('Nông trại Atisô Lạc Dương', '0x7a2d4E813F0C5...f9e1', 'FARM', 95),
('Hợp tác xã Yến sào Ninh Hòa', '0xBc29...A1f0', 'COMPANY', 88),
('Sầu riêng Krông Pắc (Đắk Lắk)', '0x92f1...D4c2', 'FARM', 92),
('Cà phê Arabica Cầu Đất', '0x55a1...E9b3', 'FARM', 84),
('Trung tâm Kiểm định VietGAP', '0xAudit...VGap', 'AUDITOR', 100),
('fwd LIFEchain Admin', '0xAdmin...Root', 'ADMIN', 100)
ON CONFLICT (wallet_address) DO NOTHING;

-- 2. Batches (Harvests)
-- Get IDs dynamically
DO $$ 
DECLARE 
    lac_duong_id UUID;
    ninh_hoa_id UUID;
    krong_pac_id UUID;
    cau_dat_id UUID;
    vgap_id UUID;
BEGIN
    SELECT id INTO lac_duong_id FROM entities WHERE name = 'Nông trại Atisô Lạc Dương' LIMIT 1;
    SELECT id INTO ninh_hoa_id FROM entities WHERE name = 'Hợp tác xã Yến sào Ninh Hòa' LIMIT 1;
    SELECT id INTO krong_pac_id FROM entities WHERE name = 'Sầu riêng Krông Pắc (Đắk Lắk)' LIMIT 1;
    SELECT id INTO cau_dat_id FROM entities WHERE name = 'Cà phê Arabica Cầu Đất' LIMIT 1;
    SELECT id INTO vgap_id FROM entities WHERE name = 'Trung tâm Kiểm định VietGAP' LIMIT 1;

    -- Insert Batches
    INSERT INTO batches (entity_id, product_name, quantity, gps, status, timestamp) VALUES 
    (lac_duong_id, 'Trà Atisô Thượng Hạng', 120.5, '12.0124, 108.3842', 'ANCHORED', NOW() - INTERVAL '1 day'),
    (lac_duong_id, 'Cao Atisô Đặc Sản', 45.0, '12.0124, 108.3842', 'ANCHORED', NOW() - INTERVAL '3 days'),
    (ninh_hoa_id, 'Yến Sào Rút Lông', 12.8, '12.4841, 109.1352', 'ANCHORED', NOW() - INTERVAL '5 days'),
    (krong_pac_id, 'Sầu Riêng Ri6 Xuất Khẩu', 850.0, '12.6711, 108.2341', 'ANCHORED', NOW() - INTERVAL '2 days'),
    (cau_dat_id, 'Cà Phê Arabica Đặc Sản', 500.0, '11.8452, 108.5284', 'PENDING', NOW() - INTERVAL '4 hours');

    -- Insert Blockchain Ledger entries for anchored batches
    INSERT INTO blockchain_ledger (batch_id, tx_hash, block_height, anchored_at)
    SELECT id, '0x' || md5(random()::text), 19482400 + floor(random()*1000), timestamp
    FROM batches WHERE status = 'ANCHORED';

    -- Insert Certificates
    INSERT INTO certificates (entity_id, type, issue_date, expiry_date, soulbound_token_id) VALUES 
    (lac_duong_id, 'GlobalGAP', '2025-01-15', '2027-01-15', 'SBT-LD-001'),
    (krong_pac_id, 'VietGAP', '2025-02-10', '2026-02-10', 'SBT-KP-042'),
    (ninh_hoa_id, 'HACCP', '2025-03-01', '2028-03-01', 'SBT-NH-099');

    -- Insert Reputation Logs
    INSERT INTO reputation_logs (entity_id, previous_score, new_score, reason) VALUES 
    (lac_duong_id, 92, 95, 'Hoàn thành đợt kiểm định định kỳ xuất sắc'),
    (krong_pac_id, 85, 92, 'Cập nhật hệ thống IoT cảm biến thời gian thực'),
    (cau_dat_id, 80, 84, 'Đạt chứng nhận cà phê bền vững 4C');

END $$;
