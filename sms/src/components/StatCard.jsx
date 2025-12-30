// Simple StatCard component placeholder
import React from 'react';

export default function StatCard({ title = 'Stat', value = 0 }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      padding: 16,
      minWidth: 120,
      textAlign: 'center',
      margin: 8
    }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: '#2563eb' }}>{value}</div>
    </div>
  );
}
