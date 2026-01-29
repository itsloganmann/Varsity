// Enhanced theme with WHOOP/Tesla-inspired styling
export const colors = {
  // Primary palette
  primary: '#7C3AED',       // Vibrant purple
  secondary: '#00D26A',     // Electric green
  accent: '#FF6B35',        // Warm orange

  // Backgrounds - deep dark with subtle blue undertones
  bgPrimary: '#0A0A0F',     // Near black
  bgSecondary: '#12121A',   // Slightly lighter
  bgCard: '#1A1A26',        // Card background
  bgElevated: '#222232',    // Elevated elements
  bgGlass: 'rgba(30, 30, 45, 0.7)', // Glass effect

  // Text hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#606070',
  textAccent: '#7C3AED',

  // Status colors
  success: '#00D26A',
  warning: '#FFB800',
  error: '#FF4757',
  info: '#00B4D8',

  // Coin/Reward colors
  coinGold: '#FFD700',
  coinGlow: 'rgba(255, 215, 0, 0.4)',

  // Rank colors
  rankGold: '#FFD700',
  rankSilver: '#C0C0C0',
  rankBronze: '#CD7F32',

  // Stadium/Boost
  boostActive: '#FF6B35',
  boostGlow: 'rgba(255, 107, 53, 0.3)',
  stadiumGreen: '#2D5A27',

  // UI elements
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  cardBorderActive: 'rgba(124, 58, 237, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.85)',
  divider: 'rgba(255, 255, 255, 0.06)',

  // Friend status
  statusOnline: '#00D26A',
  statusAtStadium: '#FF6B35',
  statusWatching: '#00B4D8',
  statusOffline: '#606070',
};

export const gradients = {
  primary: ['#7C3AED', '#00D26A'] as const,
  card: ['rgba(26, 26, 38, 0.9)', 'rgba(18, 18, 26, 0.95)'] as const,
  boost: ['#FF6B35', '#FF8E53'] as const,
  gold: ['#FFD700', '#FFA500'] as const,
  glass: ['rgba(30, 30, 45, 0.6)', 'rgba(20, 20, 30, 0.8)'] as const,
  stadium: ['#1A2F1A', '#0A150A'] as const,
  premium: ['#2D1B4E', '#1A1A2E'] as const,
  dark: ['#0A0A0F', '#12121A'] as const,
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const typography = {
  // Display - Hero headlines
  display: {
    fontSize: 48,
    fontWeight: '800' as const,
    letterSpacing: -1,
    lineHeight: 52,
  },
  // H1 - Page titles
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  // H2 - Section headers
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  // H3 - Card titles
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  // Body
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  // Small text
  caption: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  // Micro text
  micro: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 14,
  },
  // Numbers/Stats
  stat: {
    fontSize: 36,
    fontWeight: '800' as const,
    letterSpacing: -1,
    lineHeight: 40,
  },
  statSmall: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  // Odds display
  odds: {
    fontSize: 18,
    fontWeight: '700' as const,
    fontFamily: 'System', // Monospace-like
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  glowGreen: {
    shadowColor: '#00D26A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glowOrange: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Glass morphism styles
export const glass = {
  card: {
    backgroundColor: colors.bgGlass,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backdropFilter: 'blur(10px)',
  },
  elevated: {
    backgroundColor: 'rgba(40, 40, 60, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
};
