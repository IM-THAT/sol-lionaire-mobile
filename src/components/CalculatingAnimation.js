import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing } from '../styles/theme';

/**
 * Calculating Animation Component
 * Simulates luxury calculation process
 */
export const CalculatingAnimation = ({ visible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in + Scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Rotating Icon */}
        <Animated.Text
          style={[
            styles.icon,
            {
              transform: [{ rotate }],
            },
          ]}
        >
          🏠
        </Animated.Text>

        {/* Loading Text */}
        <Text style={styles.title}>Calculating...</Text>
        <Text style={styles.subtitle}>Mapping your crypto real estate</Text>

        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          <AnimatedDot delay={0} />
          <AnimatedDot delay={200} />
          <AnimatedDot delay={400} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

/**
 * Animated Dot Component
 */
const AnimatedDot = ({ delay }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  icon: {
    fontSize: 80,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.gold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.lightGray,
    marginBottom: Spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
});

export default CalculatingAnimation;
