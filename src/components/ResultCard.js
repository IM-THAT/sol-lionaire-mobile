/**
 * ResultCard - Sol-lionaire v0.4
 * 5-Tier Result Display
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const P = {
  black:    '#0A0A0A',
  charcoal: '#141414',
  dark:     '#1C1C1C',
  mid:      '#2A2A2A',
  gray:     '#888888',
  offWhite: '#F5F0E8',
  gold:     '#C9A84C',
  goldLight:'#E8C96A',
  goldDeep: '#A07830',
};

const ResultCard = ({ mappingResult }) => {
  if (!mappingResult) return null;

  const { tier, level, propertyName, location, totalValue, sqm, narrative, starProgress } = mappingResult;

  return (
    <LinearGradient
      colors={[P.dark, P.charcoal]}
      style={[s.card, { borderColor: tier.color }]}
    >
      <LinearGradient
        colors={[P.goldDeep, P.gold, P.goldLight, P.gold, P.goldDeep]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={s.accentLine}
      />

      <View style={s.header}>
        <Text style={s.eyebrow}>LEVEL {level || tier.level} • {starProgress?.starsDisplay || "★☆☆"}</Text>
        <Text style={s.propertyName}>{propertyName}</Text>
        <Text style={s.location}>📍 {location}</Text>
      </View>

      <View style={s.statsRow}>
        <View style={s.statItem}>
          <Text style={s.statLabel}>TIER</Text>
          <Text style={[s.statValue, { color: tier.color }]}>{tier.rarity}</Text>
        </View>
        <View style={s.divider} />
        <View style={s.statItem}>
          <Text style={s.statLabel}>VALUE</Text>
          <Text style={s.statValue}>${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
        </View>
        <View style={s.divider} />
        <View style={s.statItem}>
          <Text style={s.statLabel}>AREA</Text>
          <Text style={s.statValue}>{sqm} m²</Text>
        </View>
      </View>

      <View style={s.narrativeWrap}>
        <Text style={s.narrative}>{narrative}</Text>
      </View>
    </LinearGradient>
  );
};

const s = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 2, padding: 24, marginTop: 24, overflow: 'hidden' },
  accentLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  header: { alignItems: 'center', marginBottom: 20 },
  eyebrow: { fontSize: 10, color: P.gold, letterSpacing: 4, fontWeight: '600', marginBottom: 8 },
  propertyName: { fontSize: 24, fontWeight: '700', color: P.offWhite, letterSpacing: 0.5, marginBottom: 8, textAlign: 'center' },
  location: { fontSize: 13, color: P.gray, letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: P.mid },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 10, color: P.gray, letterSpacing: 2, fontWeight: '600', marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: '700', color: P.offWhite },
  divider: { width: 1, backgroundColor: P.mid },
  narrativeWrap: { marginTop: 20 },
  narrative: { fontSize: 14, color: P.gray, lineHeight: 22, textAlign: 'center', letterSpacing: 0.3, fontStyle: 'italic' },
});

export default ResultCard;
