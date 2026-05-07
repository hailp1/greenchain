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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`GreenChain API running on port ${PORT}`);
});
