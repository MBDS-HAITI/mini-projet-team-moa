// Simple StatCard component placeholder
import React from 'react';

export default function StatCard({ label = 'Stat', value = 0, color = '#2563eb', icon, hint }) {
  // Génère un fond pâle à partir de la couleur principale
  function getSoftBg(hex) {
    if (!hex) return '#f1f5f9';
    // Ajoute de l'opacité pour un fond pâle
    return hex + '18';
  }
  return (
    <div style={{
      background: getSoftBg(color),
      borderRadius: 14,
      boxShadow: '0 4px 16px rgba(15,23,42,0.08)',
      padding: 20,
      minWidth: 120,
      textAlign: 'center',
      margin: 8,
      borderTop: `6px solid ${color}`,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      transition: 'box-shadow 0.2s',
    }}>
      {icon && <span style={{ fontSize: 32, marginBottom: 2, color }}>{icon}</span>}
      <div style={{ fontSize: 17, fontWeight: 700, color }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color }}>{value}</div>
      {hint && <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{hint}</div>}
    </div>
  );
}
