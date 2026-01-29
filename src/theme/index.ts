// Theme colors - Dark mode sportsbook aesthetic
export const colors = {
  // Primary palette
  primary: '#00D26A', // Vibrant green for wins/positive
  secondary: '#FF4757', // Red for losses/negative
  accent: '#7C3AED', // Purple accent for special items

  // Background gradients
  bgPrimary: '#0F0F1A',
  bgSecondary: '#1A1A2E',
  bgCard: '#252542',
  bgElevated: '#2D2D4A',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B80',

  // Coin/Currency
  coinGold: '#FFD700',
  coinGlow: '#FFF4CC',

  // Status colors
  success: '#00D26A',
  warning: '#FFA502',
  error: '#FF4757',
  info: '#3498DB',

  // Stadium boost
  boostActive: '#FF6B35',
  boostInactive: '#4A4A6A',

  // Leaderboard ranks
  rankGold: '#FFD700',
  rankSilver: '#C0C0C0',
  rankBronze: '#CD7F32',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
};

export const gradients = {
  primary: ['#7C3AED', '#00D26A'] as const,
  card: ['#252542', '#1A1A2E'] as const,
  boost: ['#FF6B35', '#FF8E53'] as const,
  gold: ['#FFD700', '#FFA500'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  odds: {
    fontSize: 18,
    fontWeight: '700' as const,
    fontFamily: 'monospace',
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  }),
};
