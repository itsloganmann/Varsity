// Polymarket-inspired Theme (Financial, Clean, Data-Dense)

export const colors = {
  // Primary Brand
  primary: '#007AFF',       // Standard Tech Blue
  primaryDark: '#0056B3',

  // Market Outcome Colors
  yes: '#00D26A',           // Bright Green
  no: '#E95050',            // Bright Red
  stay: '#8E8E93',          // Neutral Gray

  // Backgrounds - Deep Midnight/Black
  bgPrimary: '#0E1117',     // Main Background (Deepest)
  bgSecondary: '#161B22',   // Secondary Background (Cards)
  bgElevated: '#21262D',    // Modals/Dropdowns
  bgInput: '#0D1117',       // Inputs

  // Borders - Thin, crisp
  border: '#30363D',        // Subtle border
  borderActive: '#58A6FF',  // Active border

  // Text Hierarchy
  textPrimary: '#F0F6FC',   // Almost White
  textSecondary: '#8B949E', // Muted Gray
  textTertiary: '#6E7681',  // Deeper Gray
  textInverse: '#141414',   // Black on White

  // Status
  success: '#2DA44E',
  warning: '#D29922',
  error: '#CF222E',
  info: '#0969DA',

  // Special
  gold: '#D29922',          // Gold/Coin color (muted gold)
  silver: '#8B949E',
  bronze: '#9E6A03',

  // Compatibility Aliases (Old Theme -> New Theme)
  secondary: '#00D26A', // Map to success/yes (Green)
  textMuted: '#8B949E', // Map to textSecondary
  cardBorder: '#30363D', // Map to border
  divider: '#30363D',    // Map to border
  boostActive: '#D29922', // Map to gold/boost

  // Missing from previous replace
  bgCard: '#161B22',     // Map to bgSecondary
  overlay: 'rgba(0, 0, 0, 0.85)',
};

export const gradients = {
  // Poly style uses less gradients, mostly solids or very subtle subtle ones
  primary: ['#007AFF', '#0056B3'] as const,
  success: ['#238636', '#2EA043'] as const, // Subtle green
  danger: ['#DA3633', '#F85149'] as const, // Subtle red

  // Retaining some flare for key moments
  boost: ['#D29922', '#F2CC60'] as const,
  dark: ['#0E1117', '#161B22'] as const,

  // "None" for flat look
  none: ['transparent', 'transparent'] as const,
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12, // Tighter spacing for data density
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 6,  // Sharper corners
  lg: 8,
  xl: 12,
  full: 9999,
};

export const typography = {
  // Display
  display: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
    color: colors.textPrimary,
  },
  // Headers
  h1: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  // Body
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  // Data/Financial Numbers
  mono: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: 'System', // Often maps to monospace on some setups, or use specific font
    letterSpacing: 0.5,
    color: colors.textPrimary,
  },
  // Small
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  micro: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 14,
    color: colors.textTertiary,
  },
  // Stat specific
  statBig: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  }
};

export const shadows = {
  // Very minimal shadows for this aesthetic
  none: {
    shadowColor: 'transparent',
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  // Compatibility Aliases
  glow: {
    shadowColor: '#007AFF', // Primary Blue
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 0,
  },
  glowOrange: {
    shadowColor: '#D29922',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 0,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  }
};

// Add to Typography if needed, or handle separately
// Extending typography object with missing keys
Object.assign(typography, {
  small: typography.caption,
  stat: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  odds: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    color: colors.textPrimary, // New poly style
  }
});

// Common Styles
export const commonStyles = {
  card: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  glass: {
    // Removed glass effect, fallback to solid for clean look
    backgroundColor: 'rgba(22, 27, 34, 0.95)',
    borderWidth: 1,
    borderColor: colors.border,
  }
};
