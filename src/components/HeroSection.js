/**
 * HeroSection - Sol-lionaire
 * Luxury hero section with blurred background
 */
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const P = {
  black:    '#0A0A0A',
  charcoal: '#141414',
  dark:     '#1C1C1C',
  gold:     '#C9A84C',
  goldLight:'#E8C96A',
  goldDeep: '#A07830',
  offWhite: '#F5F0E8',
};

export default function HeroSection() {
  return (
    <View style={s.container}>
      <ImageBackground
        source={require('../../assets/images/properties/ny_level10.png')}
        style={s.bgImage}
        blurRadius={8}
      >
        <LinearGradient
          colors={['rgba(10,10,10,0.7)', 'rgba(10,10,10,0.9)']}
          style={s.overlay}
        >
          <View style={s.content}>
            <LinearGradient
              colors={[P.goldDeep, P.gold, P.goldLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.titleGradient}
            >
              <Text style={s.title}>SOL-LIONAIRE</Text>
            </LinearGradient>

            <Text style={s.slogan}>
              Claim your piece of the Skyline
            </Text>

            <Text style={s.subtitle}>
              Transform your SOL into virtual real estate
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    height: 280,
    width: '100%',
    overflow: 'hidden',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  titleGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
    color: P.black,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 18,
    fontWeight: '600',
    color: P.goldLight,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: P.offWhite,
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
});
