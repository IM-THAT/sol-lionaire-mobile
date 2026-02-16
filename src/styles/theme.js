/**
 * Design System - Sol-lionaire
 * Centralized theme and design tokens
 */

export const Colors = {
  // Primary
  gold: '#FFD700',
  goldLight: '#FFED4E',
  goldDark: '#D4AF37',
  
  // Background
  black: '#0A0A0A',
  darkGray: '#1A1A1A',
  mediumGray: '#2A2A2A',
  
  // Text
  white: '#FFFFFF',
  lightGray: '#999999',
  darkText: '#666666',
  
  // Status
  success: '#00A86B',
  error: '#FF4444',
  warning: '#FF6B00',
  info: '#2196F3',
  
  // Rarity
  common: '#9E9E9E',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FFD700',
  
  // Social
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  
  // Transparent
  overlay: 'rgba(0, 0, 0, 0.9)',
  cardBorder: 'rgba(255, 215, 0, 0.3)',
};

export const Typography = {
  // Font Sizes
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 42,
  
  // Font Weights
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  
  // Line Heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const BorderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 15,
  xxl: 20,
  round: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Layout = {
  containerPadding: Spacing.lg,
  sectionMargin: Spacing.xl,
  cardPadding: Spacing.base,
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
};
