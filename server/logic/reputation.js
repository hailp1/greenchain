const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Update Reputation Score (R) for an entity
 * Formula: R_new = R_old + (alpha * S) - (beta * F)
 */
async function updateReputation(entityId, successCount, failureCount) {
    const ALPHA = 1;  // Weight for success
    const BETA = 10;  // Weight for failure
    
    // 1. Get current score
    const { data: entity, error: fetchError } = await supabase
        .from('entities')
        .select('reputation_score')
        .eq('id', entityId)
        .single();

    if (fetchError) throw fetchError;

    const oldScore = entity.reputation_score;
    
    // 2. Calculate new score
    let newScore = oldScore + (ALPHA * successCount) - (BETA * failureCount);
    
    // Clamp between 0 and 100
    newScore = Math.max(0, Math.min(100, newScore));

    // 3. Update database
    const { error: updateError } = await supabase
        .from('entities')
        .update({ 
            reputation_score: newScore,
            // If R < 30, lock for 30 days
            is_locked: newScore < 30,
            lock_until: newScore < 30 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('id', entityId);

    if (updateError) throw updateError;

    // 4. Log the change
    await supabase.from('reputation_logs').insert({
        entity_id: entityId,
        previous_score: oldScore,
        new_score: newScore,
        reason: successCount > 0 ? `Validated ${successCount} batches` : `Detected ${failureCount} fraud incidents`
    });

    console.log(`[Reputation] Entity ${entityId} updated: ${oldScore} -> ${newScore}`);
    return newScore;
}

module.exports = { updateReputation };
