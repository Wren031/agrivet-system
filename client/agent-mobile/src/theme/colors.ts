export const agriColors = {
  brand: '#2d6a4f',
  brandLight: '#40916c',
  brandDark: '#1b4332',
  brandBg: 'rgba(45,106,79,0.08)',
  brandBorder: 'rgba(45,106,79,0.2)',

  light: {
    background: '#f8f9fa',
    surface: '#ffffff',
    surfaceSecondary: '#f1f3f5',
    text: '#1a1a2e',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
  },

  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceSecondary: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    border: 'rgba(255,255,255,0.08)',
    borderLight: 'rgba(255,255,255,0.04)',
  },

  status: {
    pending: '#d97706',
    processing: '#7c3aed',
    approved: '#2563eb',
    delivered: '#16a34a',
    cancelled: '#a3a3a3',
  },

  error: {
    text: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    darkText: '#fca5a5',
    darkBg: 'rgba(239,68,68,0.1)',
    darkBorder: 'rgba(239,68,68,0.2)',
  },

  success: {
    text: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    darkText: '#86efac',
    darkBg: 'rgba(22,163,74,0.1)',
    darkBorder: 'rgba(22,163,74,0.2)',
  },
} as const;
