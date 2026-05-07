'use client';
import React, { useState } from 'react';

export default function Home() {
  const [product, setProduct] = useState('');
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_id: '861a4f5b-6f81-4357-9d66-d3c500000000', // Mock Entity
          product_name: product,
          quantity: Number(qty),
          gps: '10.762622, 106.660172',
          image_url: 'https://example.com/item.jpg'
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect to backend');
      }
      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message + '\n\nTIP: Please check if you have updated d:\\blockchain\\.env with your real Supabase credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <nav style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>fwd LIFEchain</div>
        <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}>
          Network Status: <span style={{ color: '#00ff88' }}>● Online</span>
        </div>
      </nav>

      <section className="hero animate-fade">
        <h1 className="gradient-text">Future-Ready Trust</h1>
        <p>
          Secure your agricultural supply chain with **fwd LIFEchain**. 
          Bridging physical production and digital immutability.
        </p>
      </section>

      <section className="animate-fade" style={{ maxWidth: '600px', margin: '0 auto', animationDelay: '0.2s' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create New Batch</h2>
          <form onSubmit={handleCreateBatch}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Product Name</label>
              <input 
                type="text" 
                className="glass" 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', color: 'white', border: '1px solid #444' }} 
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Organic Coffee"
                required
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.7 }}>Quantity (kg)</label>
              <input 
                type="number" 
                className="glass" 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', color: 'white', border: '1px solid #444' }} 
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Anchoring...' : 'Register Batch to Blockchain'}
            </button>
          </form>

          {result && (
            <div className="glass" style={{ marginTop: '2rem', padding: '1rem', borderRadius: '10px', border: '1px solid #00ff88' }}>
              <p style={{ color: '#00ff88', fontWeight: 'bold' }}>Success!</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Batch ID: {result.batch_id}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Status: {result.status}</p>
            </div>
          )}
        </div>
      </section>

      <footer style={{ marginTop: '8rem', paddingBottom: '4rem', textAlign: 'center', opacity: 0.5 }}>
        <p style={{ fontSize: '0.9rem' }}>© 2026 fwd LIFEchain Ecosystem. All rights reserved.</p>
      </footer>
    </main>
  );
}
