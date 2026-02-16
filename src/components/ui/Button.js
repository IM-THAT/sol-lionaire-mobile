import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../styles/theme';

/**
 * Reusable Button Component
 */
export const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, success, danger, ghost
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.black : Colors.white} />
      ) : (
        <>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  
  // Variants
  button_primary: {
    backgroundColor: Colors.gold,
  },
  button_secondary: {
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  button_success: {
    backgroundColor: Colors.success,
  },
  button_danger: {
    backgroundColor: Colors.error,
  },
  button_ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  
  // Sizes
  button_small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  button_medium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  button_large: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
  },
  
  // Disabled
  button_disabled: {
    opacity: 0.5,
  },
  
  // Text
  text: {
    fontWeight: Typography.semibold,
  },
  text_primary: {
    color: Colors.black,
  },
  text_secondary: {
    color: Colors.white,
  },
  text_success: {
    color: Colors.white,
  },
  text_danger: {
    color: Colors.white,
  },
  text_ghost: {
    color: Colors.gold,
  },
  text_small: {
    fontSize: Typography.sm,
  },
  text_medium: {
    fontSize: Typography.md,
  },
  text_large: {
    fontSize: Typography.lg,
  },
  text_disabled: {
    opacity: 0.7,
  },
  
  icon: {
    fontSize: Typography.lg,
  },
});

export default Button;
