'use client';
import React, { useEffect, useState } from 'react';

export default function Reputation() {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        const res = await fetch('http://localhost:3000/reputation'); // Need this too
        const data = await res.json();
        setEntities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReputation();
  }, []);

  return (
    <main className="container animate-fade">
      <header style={{ padding: '4rem 0 2rem' }}>
        <h1 className="gradient-text">Entity Reputation</h1>
        <p>Dynamic reputation scores (R) for farms, companies, and auditors.</p>
      </header>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <p>Loading scores...</p>
        ) : entities.map((entity) => (
          <div key={entity.id} className="glass" style={{ padding: '1.5rem', borderRadius: '15px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: entity.reputation_score > 70 ? '#00ff88' : entity.reputation_score > 40 ? '#ff9933' : '#ff4444' }}></div>
            <h3 style={{ marginBottom: '0.5rem' }}>{entity.name}</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1.5rem' }}>{entity.role}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ff6600' }}>{entity.reputation_score}</span>
              <span style={{ opacity: 0.5 }}>/ 100</span>
            </div>
            {entity.is_locked && (
              <div style={{ marginTop: '1rem', color: '#ff4444', fontSize: '0.8rem', fontWeight: 'bold' }}>
                ⚠️ STATUS: LOCKED (Low Reputation)
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <a href="/" className="btn glass" style={{ color: 'white' }}>← Back to Dashboard</a>
      </div>
    </main>
  );
}
