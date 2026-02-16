import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../styles/theme';

/**
 * Reusable Card Component
 */
export const Card = ({
  children,
  variant = 'default', // default, gold, success, transparent
  padding = 'medium', // small, medium, large, none
  shadow = false,
  style,
}) => {
  const cardStyles = [
    styles.card,
    styles[`card_${variant}`],
    styles[`padding_${padding}`],
    shadow && Shadows.md,
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.darkGray,
  },
  
  // Variants
  card_default: {
    borderWidth: 1,
    borderColor: '#333',
  },
  card_gold: {
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  card_success: {
    borderWidth: 2,
    borderColor: Colors.success,
  },
  card_transparent: {
    backgroundColor: 'transparent',
  },
  
  // Padding
  padding_none: {
    padding: 0,
  },
  padding_small: {
    padding: Spacing.md,
  },
  padding_medium: {
    padding: Spacing.lg,
  },
  padding_large: {
    padding: Spacing.xl,
  },
});

export default Card;
