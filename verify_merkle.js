const crypto = require('crypto');

/**
 * Verifies that a leaf is part of a Merkle Tree given the root and proof
 * @param {string} leaf - Hash of the batch
 * @param {string} root - Merkle Root stored on blockchain
 * @param {string[]} proof - Array of sibling hashes
 * @returns {boolean}
 */
function verifyProof(leaf, root, proof) {
    let hash = leaf;

    for (const sibling of proof) {
        // Sort to ensure consistent hashing
        const combined = hash < sibling ? hash + sibling : sibling + hash;
        hash = crypto.createHash('sha256').update(combined).digest('hex');
    }

    return hash === root;
}

// Example usage:
// const myBatchHash = "abc...";
// const rootOnChain = "xyz...";
// const myProof = ["s1", "s2"];
// console.log("Trust verified:", verifyProof(myBatchHash, rootOnChain, myProof));

module.exports = { verifyProof };
