const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Process a weighted vote for a batch
 */
async function processAuditVote(batchId, auditorId, decision) {
    // 1. Get Auditor's reputation score
    const { data: auditor, error: auditorError } = await supabase
        .from('entities')
        .select('reputation_score, role')
        .eq('id', auditorId)
        .single();

    if (auditorError || auditor.role !== 'AUDITOR') {
        throw new Error("Unauthorized: Only auditors can vote.");
    }

    const weight = auditor.reputation_score / 100;

    // 2. Record the vote
    const { error: voteError } = await supabase
        .from('audits')
        .insert({
            batch_id: batchId,
            auditor_id: auditorId,
            vote_decision: decision,
            auditor_weight: weight
        });

    if (voteError) throw voteError;

    // 3. Check for Consensus
    await evaluateConsensus(batchId);
}

/**
 * Evaluate if a batch has reached 65% consensus weight
 */
async function evaluateConsensus(batchId) {
    const CONSENSUS_THRESHOLD = 0.65;

    // Get all votes for this batch
    const { data: votes, error } = await supabase
        .from('audits')
        .select('vote_decision, auditor_weight')
        .eq('batch_id', batchId);

    if (error) throw error;

    const totalWeight = votes.reduce((acc, v) => acc + Number(v.auditor_weight), 0);
    const approveWeight = votes
        .filter(v => v.vote_decision === 'APPROVE')
        .reduce((acc, v) => acc + Number(v.auditor_weight), 0);

    const consensusRatio = totalWeight > 0 ? approveWeight / totalWeight : 0;

    console.log(`[Consensus] Batch ${batchId}: Weight Ratio ${consensusRatio.toFixed(2)} / ${CONSENSUS_THRESHOLD}`);

    if (consensusRatio >= CONSENSUS_THRESHOLD) {
        // Update batch status to VERIFIED
        await supabase
            .from('batches')
            .update({ status: 'VERIFIED' })
            .eq('id', batchId);
        
        console.log(`[Consensus] Batch ${batchId} VERIFIED!`);
    } else if (votes.length > 5 && consensusRatio < 0.3) {
        // Optional: Reject if enough votes and very low consensus
        await supabase
            .from('batches')
            .update({ status: 'REJECTED' })
            .eq('id', batchId);
    }
}

module.exports = { processAuditVote };
