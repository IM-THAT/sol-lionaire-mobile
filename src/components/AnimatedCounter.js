import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

/**
 * Animated Counter Component
 * 숫자가 카운트업되는 애니메이션 효과
 */
export const AnimatedCounter = ({ 
  targetValue, 
  duration = 1500, 
  prefix = '', 
  suffix = '',
  decimals = 0,
  style,
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const newValue = targetValue * easeProgress;
      setCurrentValue(newValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration]);

  const formattedValue = decimals > 0
    ? currentValue.toFixed(decimals)
    : Math.floor(currentValue).toLocaleString();

  return (
    <Text style={[styles.text, style]}>
      {prefix}{formattedValue}{suffix}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontVariant: ['tabular-nums'],
  },
});

export default AnimatedCounter;
