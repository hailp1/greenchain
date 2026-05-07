const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Calculates the Merkle Root of an array of hashes
 * @param {string[]} hashes 
 * @returns {string}
 */
function getMerkleRoot(hashes) {
    if (hashes.length === 0) return '';
    let currentLevel = hashes;
    while (currentLevel.length > 1) {
        const nextLevel = [];
        for (let i = 0; i < currentLevel.length; i += 2) {
            const left = currentLevel[i];
            const right = (i + 1 < currentLevel.length) ? currentLevel[i + 1] : left;
            const combined = crypto.createHash('sha256').update(left + right).digest('hex');
            nextLevel.push(combined);
        }
        currentLevel = nextLevel;
    }
    return currentLevel[0];
}

/**
 * Step 3: API Logic - Receive, Save, and Prepare for Batching
 */
async function handleNewBatch(clientData) {
    // 1. Save raw data to Supabase
    const { data: batch, error } = await supabase
        .from('batches')
        .insert([{
            entity_id: clientData.entity_id,
            product_name: clientData.product_name,
            quantity: clientData.quantity,
            gps: clientData.gps,
            image_url: clientData.image_url,
            status: 'PENDING'
        }])
        .select()
        .single();

    if (error) throw error;

    // 2. Data is now in 'PENDING' state, waiting for the bridge to process in bulk
    return batch;
}

/**
 * Step 5: Batch Processing (Merkle Tree 100:1) with Fault Tolerance
 */
async function processBatchQueue() {
    const BATCH_SIZE = 100;

    // 1. Lock items for processing (Atomic update to PENDING_ON_CHAIN)
    // This prevents multiple bridge instances from picking up the same records
    const { data: itemsToLock, error: lockError } = await supabase
        .from('batches')
        .select('id')
        .eq('status', 'PENDING')
        .limit(BATCH_SIZE);

    if (lockError || !itemsToLock || itemsToLock.length === 0) return;

    const ids = itemsToLock.map(i => i.id);
    
    const { error: updateError } = await supabase
        .from('batches')
        .update({ status: 'ANCHORING' })
        .in('id', ids);

    if (updateError) {
        console.error("Failed to lock batches:", updateError);
        return;
    }

    console.log(`[Bridge] Locked ${ids.length} batches. Starting Merkle Tree calculation...`);

    // 2. Fetch full data for the locked items
    const { data: pendingItems } = await supabase
        .from('batches')
        .select('*')
        .in('id', ids);

    // 3. Generate individual hashes
    const leafHashes = pendingItems.map(item => {
        const data = JSON.stringify({ id: item.id, product: item.product_name, qty: item.quantity, ts: item.timestamp });
        return crypto.createHash('sha256').update(data).digest('hex');
    });

    // 4. Calculate Merkle Root
    const rootHash = getMerkleRoot(leafHashes);

    // 5. Push Root Hash to Blockchain (GreenChain)
    try {
        // In reality, this is where we sign the TX and broadcast to Cosmos RPC
        const txResult = await sendToBlockchainRoot(rootHash); 
        
        console.log(`[Blockchain] Success! Root: ${rootHash}. TX: ${txResult.txHash}`);

        // 6. Finalize records in Ledger and Update status to ANCHORED
        for (const item of pendingItems) {
            await supabase.from('blockchain_ledger').upsert({
                batch_id: item.id,
                tx_hash: txResult.txHash,
                block_height: txResult.height,
                merkle_root: rootHash
            });

            await supabase.from('batches')
                .update({ status: 'ANCHORED' })
                .eq('id', item.id);
        }
    } catch (err) {
        console.error("CRITICAL: Blockchain anchoring failed. Reverting batches to PENDING for retry.", err);
        // Rollback status to PENDING so they can be picked up again
        await supabase.from('batches')
            .update({ status: 'PENDING' })
            .in('id', ids);
        
        // Log "Red Alert" to system logs
        console.log("!!! RED ALERT: Bridge disconnected or Transaction failed. Items queued for retry.");
    }
}

/**
 * Mock Blockchain Send for Root Hash
 */
async function sendToBlockchainRoot(rootHash) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate random failure (10% chance) to test fault tolerance
    if (Math.random() < 0.1) throw new Error("Cosmos Node Connection Timeout");

    return {
        txHash: crypto.createHash('sha256').update(rootHash + Date.now()).digest('hex').toUpperCase(),
        height: Math.floor(Math.random() * 1000000)
    };
}

// Export for API use or run as worker
module.exports = { handleNewBatch, processBatchQueue };

// Run worker every 30 seconds
if (require.main === module) {
    setInterval(processBatchQueue, 30000);
}
