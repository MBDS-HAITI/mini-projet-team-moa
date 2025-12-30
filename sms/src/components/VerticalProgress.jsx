// Simple VerticalProgress component placeholder
import React from 'react';

export default function VerticalProgress({ value = 0, max = 100, label = '' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 8 }}>
      <div style={{
        height: 80,
        width: 18,
        background: '#e5e7eb',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 6
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: percent + '%',
          background: '#2563eb',
          borderRadius: 10,
          transition: 'height 0.3s'
        }} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{label} {Math.round(percent)}%</div>
    </div>
  );
}
