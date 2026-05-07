'use client';
import React, { useState } from 'react';

export default function Verify() {
  const [batchId, setBatchId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      // In a real app, you'd fetch the batch and the merkle root/proof from the ledger
      const res = await fetch(`http://localhost:3000/verify/${batchId}`); // Need to add this
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Verification failed. Please check the Batch ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container animate-fade">
      <header style={{ padding: '4rem 0 2rem', textAlign: 'center' }}>
        <h1 className="gradient-text">Verify Provenance</h1>
        <p>Enter a Batch ID to verify its authenticity on the fwd LIFEchain blockchain.</p>
      </header>

      <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', borderRadius: '15px' }}>
        <form onSubmit={handleVerify}>
          <input 
            type="text" 
            className="glass" 
            style={{ width: '100%', padding: '1rem', marginBottom: '1rem', color: 'white', borderRadius: '10px' }}
            placeholder="Enter Batch ID (e.g. 550e8400-e29b...)"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Authenticity'}
          </button>
        </form>

        {result && (
          <div className="animate-fade" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,255,136,0.05)', borderRadius: '10px', border: '1px solid #00ff88' }}>
            <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>✓ Verification Successful</h3>
            <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p><strong>Product:</strong> {result.product_name}</p>
              <p><strong>Producer ID:</strong> {result.entity_id}</p>
              <p><strong>Blockchain TX:</strong> <span style={{ fontFamily: 'monospace', opacity: 0.7 }}>{result.tx_hash}</span></p>
              <p><strong>Merkle Root:</strong> <span style={{ fontFamily: 'monospace', opacity: 0.7 }}>{result.merkle_root}</span></p>
              <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.6 }}>Data integrity verified against block #{result.block_height}</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/" className="btn glass" style={{ color: 'white' }}>← Back to Home</a>
      </div>
    </main>
  );
}
