// Simple QuickActionCard component placeholder
import React from 'react';

export default function QuickActionCard({ title = 'Action', onClick }) {
  return (
    <button
      style={{
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '16px 24px',
        margin: 8,
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
      }}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
