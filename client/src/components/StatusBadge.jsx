import React from 'react';

const STATUS_CONFIG = {
  Recruiting:  { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  Active:      { color: '#06b6d4', bg: 'rgba(6,182,212,0.15)'  },
  Completed:   { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  Suspended:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  Terminated:  { color: '#ef4444', bg: 'rgba(239,68,68,0.15)'  },
  Pending:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.15)'},
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const fontSize = size === 'sm' ? '0.7rem' : '0.78rem';
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.color}40`,
        borderRadius: '999px',
        fontSize,
        fontWeight: 600,
        padding,
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
