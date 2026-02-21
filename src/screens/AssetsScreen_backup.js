/**
 * Assets Screen - "The Vault"
 * Digital Asset Dossier
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWallet } from '../context/WalletContext';
import { valueCalculator, PROPERTY_TIERS } from '../services/valueCalculator';
import { priceDataService } from '../services/pythPriceService';

const P = {
  black:    '#0A0A0A',
  charcoal: '#141414',
  dark:     '#1C1C1C',
  mid:      '#2A2A2A',
  dim:      '#444444',
  gray:     '#888888',
  offWhite: '#F5F0E8',
  gold:     '#C9A84C',
  goldLight:'#E8C96A',
  goldDeep: '#A07830',
};

const RARITY_COLORS = {
  Common:    '#9E9E9E',
  Uncommon:  '#4CAF50',
  Rare:      '#2196F3',
  Epic:      '#9C27B0',
  Legendary: '#FFD700',
};

export default function AssetsScreen() {
  const { walletAddress, balance, isConnected } = useWallet();
  const [solPrice,   setSolPrice]   = useState(139.8);
  const [history,    setHistory]    = useState([]);
  const [currentTier, setCurrentTier] = useState(null);
  const [percentile,  setPercentile]  = useState(null);
  const [city,        setCity]        = useState('MANHATTAN');

  useEffect(() => {
    if (isConnected) loadData();
  }, [isConnected, balance, city]);

  const loadData = async () => {
    try {
      const prices = await priceDataService.fetchAllPrices(city);
      const price = prices.solPrice || 139.8;
      setSolPrice(price);

      const sol = balance || 2;
      const result = valueCalculator.determineMapping({ solAmount: sol, solPrice: price, cityType: city });
      setCurrentTier(result.tier);
      setPercentile(valueCalculator.getPercentile(sol * price));

      // Load history
      const key = `history_${walletAddress}`;
      const raw = await AsyncStorage.getItem(key);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.error('Assets load failed:', e);
    }
  };

  if (!isConnected) {
    return (
      <LinearGradient colors={[P.black, P.charcoal]} style={s.flex}>
        <View style={s.emptyWrap}>
          <Text style={s.emptyEmoji}>🔐</Text>
          <Text style={s.emptyTitle}>The Vault</Text>
          <Text style={s.emptyBody}>Connect your wallet to access your private dossier.</Text>
        </View>
      </LinearGradient>
    );
  }

  const totalUSD = (balance || 2) * solPrice;
  const achievedTiers = PROPERTY_TIERS.filter(t => totalUSD >= t.minUSD);

  return (
    <LinearGradient colors={[P.black, P.charcoal]} style={s.flex}>

      {/* Header */}
      <LinearGradient colors={[P.charcoal, P.dark]} style={s.header}>
        <Text style={s.eyebrow}>PRIVATE DOSSIER</Text>
        <Text style={s.headerTitle}>The Vault</Text>
        {/* City Toggle */}
        <View style={s.toggle}>
          {['MANHATTAN', 'DUBAI'].map(c => (
            <TouchableOpacity
              key={c}
              style={[s.toggleBtn, city === c && s.toggleActive]}
              onPress={() => setCity(c)}
            >
              <Text style={[s.toggleText, city === c && s.toggleTextActive]}>
                {c === 'MANHATTAN' ? '🗽 NYC' : '🏙️ Dubai'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={s.scroll}>

        {/* Global Benchmarking */}
        <LinearGradient colors={[P.dark, '#1A150A']} style={[s.card, { borderColor: P.gold }]}>
          <LinearGradient
            colors={[P.goldDeep, P.gold, P.goldLight, P.gold, P.goldDeep]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.accentLine}
          />
          <Text style={s.eyebrow}>GLOBAL STANDING</Text>
          <Text style={s.percentileText}>Top {percentile}%</Text>
          <Text style={s.percentileSub}>of Sol-lionaire holders worldwide</Text>
          <View style={s.divider} />
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statValue}>{(balance || 2).toFixed(2)}</Text>
              <Text style={s.statLabel}>SOL</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={s.statValue}>${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
              <Text style={s.statLabel}>USD VALUE</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={[s.statValue, { color: currentTier?.color || P.gold }]}>
                {currentTier?.rarity || '—'}
              </Text>
              <Text style={s.statLabel}>TIER</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Milestone Badges */}
        <View style={s.section}>
          <Text style={s.eyebrow}>MILESTONE BADGES</Text>
          <Text style={s.sectionTitle}>Tiers Achieved</Text>
          <View style={s.badgeGrid}>
            {PROPERTY_TIERS.map((tier, idx) => {
              const achieved = totalUSD >= tier.minUSD;
              return (
                <View key={idx} style={[
                  s.badge,
                  achieved
                    ? { borderColor: tier.color, backgroundColor: `${tier.color}18` }
                    : { borderColor: P.mid, opacity: 0.4 },
                ]}>
                  <Text style={s.badgeRarity}>{tier.rarity.toUpperCase()}</Text>
                  <Text style={[s.badgeName, { color: achieved ? tier.color : P.gray }]}>
                    {tier.names[city]}
                  </Text>
                  {achieved && <Text style={s.badgeCheck}>✓</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {/* Territory History */}
        <View style={s.section}>
          <Text style={s.eyebrow}>TERRITORY HISTORY</Text>
          <Text style={s.sectionTitle}>Asset Registry</Text>

          {history.length === 0 ? (
            <View style={[s.card, { borderColor: P.mid, alignItems: 'center', padding: 32 }]}>
              <Text style={{ fontSize: 32, marginBottom: 12 }}>📋</Text>
              <Text style={{ color: P.gray, fontSize: 14, textAlign: 'center' }}>
                No records yet.{'\n'}Calculate your territory to begin your dossier.
              </Text>
            </View>
          ) : (
            history.slice(0, 10).map((item, idx) => (
              <LinearGradient
                key={idx}
                colors={[P.dark, P.charcoal]}
                style={[s.historyRow, { borderColor: P.mid }]}
              >
                <View style={[s.historyDot, { backgroundColor: item.tier?.color || P.gold }]} />
                <View style={s.historyInfo}>
                  <Text style={s.historyName}>{item.tier?.names?.[city] || item.propertyName}</Text>
                  <Text style={s.historyDate}>
                    {new Date(item.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={s.historyValueWrap}>
                  <Text style={s.historyValue}>
                    ${item.totalValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </Text>
                  <Text style={[s.historyRarity, { color: item.tier?.color || P.gold }]}>
                    {item.tier?.rarity}
                  </Text>
                </View>
              </LinearGradient>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: 24,
    alignItems: 'center', borderBottomWidth: 1, borderBottomColor: P.gold,
  },
  eyebrow: { fontSize: 10, color: P.gold, letterSpacing: 4, fontWeight: '600', marginBottom: 4 },
  headerTitle: { fontSize: 22, color: P.offWhite, fontWeight: '300', letterSpacing: 1, marginBottom: 16 },
  toggle: { flexDirection: 'row', backgroundColor: P.black, borderRadius: 12, padding: 3, borderWidth: 1, borderColor: P.mid },
  toggleBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10 },
  toggleActive: { backgroundColor: P.gold },
  toggleText: { fontSize: 13, color: P.gray, fontWeight: '500' },
  toggleTextActive: { color: P.black, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 60 },

  // Cards
  card: {
    borderRadius: 20, borderWidth: 1, padding: 24,
    marginBottom: 8, overflow: 'hidden',
  },
  accentLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },

  // Benchmarking
  percentileText: { fontSize: 48, fontWeight: '700', color: P.gold, letterSpacing: 1, marginVertical: 8 },
  percentileSub: { fontSize: 13, color: P.gray, letterSpacing: 0.5, marginBottom: 20 },
  divider: { height: 1, backgroundColor: P.mid, marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: P.offWhite, marginBottom: 4 },
  statLabel: { fontSize: 10, color: P.gray, letterSpacing: 2 },
  statDivider: { width: 1, backgroundColor: P.mid },

  // Section
  section: { marginTop: 24, marginBottom: 8 },
  sectionTitle: { fontSize: 16, color: P.offWhite, fontWeight: '300', letterSpacing: 0.5, marginBottom: 12 },

  // Badges
  badgeGrid: { gap: 8 },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, padding: 14, gap: 12,
  },
  badgeRarity: { fontSize: 9, color: P.gray, letterSpacing: 2, width: 70 },
  badgeName: { flex: 1, fontSize: 14, fontWeight: '500' },
  badgeCheck: { fontSize: 16, color: P.gold },

  // History
  historyRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, padding: 14,
    marginBottom: 8, gap: 12,
  },
  historyDot: { width: 10, height: 10, borderRadius: 5 },
  historyInfo: { flex: 1 },
  historyName: { fontSize: 14, color: P.offWhite, fontWeight: '500', marginBottom: 2 },
  historyDate: { fontSize: 11, color: P.gray },
  historyValueWrap: { alignItems: 'flex-end' },
  historyValue: { fontSize: 14, color: P.gold, fontWeight: '600', marginBottom: 2 },
  historyRarity: { fontSize: 10, letterSpacing: 1 },

  // Empty
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48 },
  emptyEmoji: { fontSize: 56, marginBottom: 20 },
  emptyTitle: { fontSize: 28, fontWeight: '300', color: P.offWhite, letterSpacing: 2, marginBottom: 12 },
  emptyBody: { fontSize: 14, color: P.gray, textAlign: 'center', lineHeight: 22 },
});
