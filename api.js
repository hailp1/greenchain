const express = require('express');
const cors = require('cors');
const { handleNewBatch } = require('./bridge');
const app = express();

app.use(cors());
app.use(express.json());

/**
 * API Endpoint to receive batch data from Client
 * POST /batch
 */
app.post('/batch', async (req, res) => {
    try {
        const clientData = req.body;
        
        // 1. Receive & Save to Supabase (Step 3: Nhận & Lưu dữ liệu thô)
        const batch = await handleNewBatch(clientData);
        
        // Return acknowledgment to client
        // The tx_hash will be updated by the bridge service asynchronously
        res.status(201).json({
            message: "Batch received and queued for blockchain anchoring",
            batch_id: batch.id,
            status: "PENDING"
        });
    } catch (err) {
        console.error("[ERROR] Backend failed to process batch:", err.message);
        res.status(500).json({ error: "Backend error: " + err.message });
    }
});

/**
 * GET /batches - Fetch all batches for Explorer
 */
app.get('/batches', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('batches')
            .select('*, blockchain_ledger(tx_hash, block_height)')
            .order('timestamp', { ascending: false });

        if (error) throw error;

        // Flatten the tx_hash from the joined table
        const formattedData = data.map(b => ({
            ...b,
            tx_hash: b.blockchain_ledger?.[0]?.tx_hash || null
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /verify/:id - Fetch detailed verification data for a batch
 */
app.get('/verify/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('batches')
            .select('*, blockchain_ledger(tx_hash, block_height, merkle_root)')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;

        const result = {
            ...data,
            tx_hash: data.blockchain_ledger?.[0]?.tx_hash || 'N/A',
            block_height: data.blockchain_ledger?.[0]?.block_height || 'N/A',
            merkle_root: data.blockchain_ledger?.[0]?.merkle_root || 'N/A'
        };

        res.json(result);
    } catch (err) {
        res.status(404).json({ error: "Batch not found" });
    }
});

/**
 * GET /reputation - Fetch entity reputation scores
 */
app.get('/reputation', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('entities')
            .select('id, name, role, reputation_score, is_locked')
            .order('reputation_score', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`GreenChain API running on port ${PORT}`);
});
