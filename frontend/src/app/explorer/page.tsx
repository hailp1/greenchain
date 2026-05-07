'use client';
import React, { useEffect, useState } from 'react';

export default function Explorer() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        // In a real app, this would hit your API or Supabase directly
        const res = await fetch('http://localhost:3000/batches'); // I'll need to add this endpoint to api.js
        const data = await res.json();
        setBatches(data);
      } catch (err) {
        console.error("Failed to fetch explorer data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  return (
    <main className="container animate-fade">
      <header style={{ padding: '4rem 0 2rem' }}>
        <h1 className="gradient-text">Blockchain Explorer</h1>
        <p>Real-time ledger of fwd LIFEchain transactions and batch anchoring.</p>
      </header>

      <div className="glass" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead className="glass" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <tr>
              <th style={{ padding: '1.2rem' }}>Batch ID</th>
              <th style={{ padding: '1.2rem' }}>Product</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>TX Hash</th>
              <th style={{ padding: '1.2rem' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading ledger...</td></tr>
            ) : batches.map((batch) => (
              <tr key={batch.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '1rem', fontSize: '0.8rem', opacity: 0.8 }}>{batch.id.slice(0, 8)}...</td>
                <td style={{ padding: '1rem' }}>{batch.product_name}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`status-badge ${batch.status === 'ANCHORED' ? 'status-up' : 'status-down'}`}>
                    {batch.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#ff6600' }}>
                   {batch.tx_hash ? `${batch.tx_hash.slice(0, 12)}...` : 'N/A'}
                </td>
                <td style={{ padding: '1rem', opacity: 0.6 }}>{new Date(batch.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <a href="/" className="btn glass" style={{ color: 'white' }}>← Back to Dashboard</a>
      </div>
    </main>
  );
}
