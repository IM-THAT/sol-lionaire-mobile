import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Gold particle config
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * width,
  y: Math.random() * height,
  size: 2 + Math.random() * 3.5,
  delay: Math.random() * 1800,
  duration: 2200 + Math.random() * 1800,
  driftX: (Math.random() - 0.5) * 60,
  driftY: -(40 + Math.random() * 60),
}));

function Particle({ x, y, size, delay, duration, driftX, driftY }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.85, duration: duration * 0.3, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0,    duration: duration * 0.7, useNativeDriver: true }),
          ]),
          Animated.timing(translateX, { toValue: driftX, duration, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: driftY, duration, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFD700',
        opacity,
        transform: [{ translateX }, { translateY }],
      }}
    />
  );
}

export default function SplashScreen({ onFinish }) {
  // Animations
  const logoOpacity    = useRef(new Animated.Value(0)).current;
  const logoScale      = useRef(new Animated.Value(0.88)).current;
  const sloganOpacity  = useRef(new Animated.Value(0)).current;
  const pulseScale     = useRef(new Animated.Value(1)).current;
  const screenOpacity  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Logo fade-in + scale-up
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 900, delay: 300, useNativeDriver: true }),
      Animated.spring(logoScale,   { toValue: 1, friction: 6, tension: 40, delay: 300, useNativeDriver: true }),
    ]).start(() => {
      // 2. Slogan fades in after logo settles
      Animated.timing(sloganOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();

      // 3. Gentle pulse loop on logo
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, { toValue: 1.04, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseScale, { toValue: 1.00, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    });

    // 4. Fade out whole screen after 3.2s, then call onFinish
    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onFinish && onFinish());
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <LinearGradient
        colors={['#000000', '#0D0900', '#1A1000', '#000000']}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Gold particles */}
      {PARTICLES.map(p => (
        <Particle key={p.id} {...p} />
      ))}

      {/* Logo area */}
      <Animated.View style={[styles.center, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        {/* Outer pulse ring */}
        <Animated.View style={[styles.glowRing, { transform: [{ scale: pulseScale }] }]} />

        {/* Logo block */}
        <View style={styles.logoBlock}>
          <LinearGradient
            colors={['#FFD700', '#C9A84C', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGrad}
          >
            <Text style={styles.logoText}>SOL</Text>
          </LinearGradient>
          <Text style={styles.logoSuffix}>IONAIRE</Text>
        </View>

        {/* Gold line accent */}
        <LinearGradient
          colors={['transparent', '#C9A84C', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.divider}
        />
      </Animated.View>

      {/* Slogan */}
      <Animated.View style={[styles.sloganWrap, { opacity: sloganOpacity }]}>
        <Text style={styles.sloganText}>LUXURY STATUS LAYER · SOLANA</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.18)',
    backgroundColor: 'rgba(201,168,76,0.04)',
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 0,
  },
  logoBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  logoGrad: {
    paddingHorizontal: 4,
    paddingBottom: 2,
    borderRadius: 2,
  },
  logoText: {
    fontSize: 46,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 3,
    lineHeight: 52,
  },
  logoSuffix: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    lineHeight: 52,
    marginLeft: 1,
  },
  divider: {
    height: 1,
    width: 140,
    marginTop: 4,
  },
  sloganWrap: {
    position: 'absolute',
    bottom: 72,
    alignItems: 'center',
  },
  sloganText: {
    color: '#C9A84C',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.8,
  },
});
