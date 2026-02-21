/**
 * More Screen - Sol-lionaire
 * Legal Disclaimer + Settings
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
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

const Section = ({ title, children }) => (
  <View style={s.section}>
    <Text style={s.eyebrow}>{title}</Text>
    <LinearGradient colors={[P.dark, P.charcoal]} style={s.card}>
      {children}
    </LinearGradient>
  </View>
);

const Row = ({ label, value, onPress, isLast }) => (
  <TouchableOpacity
    style={[s.row, !isLast && s.rowBorder]}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.6 : 1}
  >
    <Text style={s.rowLabel}>{label}</Text>
    <Text style={[s.rowValue, onPress && { color: P.gold }]}>{value}</Text>
  </TouchableOpacity>
);

export default function MoreScreen() {
  return (
    <LinearGradient colors={[P.black, P.charcoal]} style={s.flex}>

      {/* Header */}
      <LinearGradient colors={[P.charcoal, P.dark]} style={s.header}>
        <Text style={s.eyebrow}>SETTINGS & LEGAL</Text>
        <Text style={s.headerTitle}>More</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={s.scroll}>

        {/* App Info */}
        <Section title="APPLICATION">
          <Row label="Version"        value="0.4.0 (Beta)" isLast={false} />
          <Row label="Network"        value="Solana Devnet" isLast={false} />
          <Row label="Price Oracle"   value="Pyth Network" isLast={false} />
          <Row label="Swap Protocol"  value="Jupiter v6" isLast={true} />
        </Section>

        {/* Legal Disclaimer */}
        <Section title="LEGAL DISCLAIMER">
          <View style={s.disclaimerWrap}>
            <LinearGradient
              colors={[P.goldDeep, P.gold, P.goldLight, P.gold, P.goldDeep]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.accentLine}
            />
            <Text style={s.disclaimerTitle}>Simulation Notice</Text>
            <Text style={s.disclaimerBody}>
              Sol-lionaire is a visualization tool for entertainment only. All valuations are simulations and do not represent actual ownership or investment advice. Users are solely responsible for blockchain transactions and regulatory compliance.
            </Text>
            <Text style={s.disclaimerBody}>
              Real estate valuations based on Feb 2024 market averages: Manhattan ($22,000/m²), Dubai ($7,500/m²).
            </Text>
            <View style={s.divider} />
          </View>

        </Section>
        {/* Links */}
        <Section title="RESOURCES">
          <Row
            label="Solana"
            value="solana.com →"
            onPress={() => Linking.openURL('https://solana.com')}
            isLast={false}
          />
          <Row
            label="Pyth Network"
            value="pyth.network →"
            onPress={() => Linking.openURL('https://pyth.network')}
            isLast={false}
          />
          <Row
            label="Jupiter"
            value="jup.ag →"
            onPress={() => Linking.openURL('https://jup.ag')}
            isLast={true}
          />
        </Section>

        <View style={{ height: 60 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  flex:       { flex: 1 },
  header: {
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24,
    alignItems: 'center', borderBottomWidth: 1, borderBottomColor: P.gold,
  },
  eyebrow: { fontSize: 10, color: P.gold, letterSpacing: 4, fontWeight: '600', marginBottom: 4 },
  headerTitle: { fontSize: 22, color: P.offWhite, fontWeight: '300', letterSpacing: 1 },
  scroll: { padding: 16 },

  section: { marginBottom: 24 },
  card: {
    borderRadius: 16, borderWidth: 1,
    borderColor: '#2A2A2A', overflow: 'hidden',
  },

  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: P.mid },
  rowLabel: { fontSize: 14, color: P.offWhite },
  rowValue: { fontSize: 13, color: P.gray },

  disclaimerWrap: { padding: 20, position: 'relative', overflow: 'hidden' },
  accentLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  disclaimerTitle: {
    fontSize: 16, color: P.gold, fontWeight: '600',
    letterSpacing: 0.5, marginBottom: 8, marginTop: 8,
  },
  disclaimerHeading: {
    fontSize: 13, color: P.offWhite, fontWeight: '600',
    letterSpacing: 0.3, marginBottom: 6,
  },
  disclaimerBody: {
    fontSize: 12, color: P.gray, lineHeight: 20,
    letterSpacing: 0.2, marginBottom: 4,
  },
  divider: { height: 1, backgroundColor: P.mid, marginVertical: 14 },
});
