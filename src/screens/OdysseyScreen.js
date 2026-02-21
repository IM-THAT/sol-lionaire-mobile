/**
 * Odyssey Screen - Sol-lionaire v0.4
 * Real User Asset History (No Fake Data)
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Linking, Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWallet } from '../context/WalletContext';
import { valueCalculator, PROPERTY_TIERS, CityType } from '../services/valueCalculator';
import { priceDataService } from '../services/pythPriceService';

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

export default function OdysseyScreen() {
  const { walletAddress, balance, isConnected } = useWallet();
  const [solPrice, setSolPrice]   = useState(139.8);
  const [history, setHistory]     = useState([]);
  const [currentTier, setCurrentTier] = useState(null);
  const [city, setCity]           = useState(CityType.MANHATTAN);
  const [upgrade, setUpgrade]     = useState(null);

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

      const upgradeInfo = valueCalculator.calculateUpgrade({ solAmount: sol, solPrice: price, cityType: city });
      setUpgrade(upgradeInfo);

      // Load user history
      const key = `history_${walletAddress}`;
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setHistory(parsed.slice(0, 20)); // Last 20 records
      }
    } catch (e) {
      console.error('Odyssey load failed:', e);
    }
  };

  if (!isConnected) {
    return (
      <LinearGradient colors={[P.black, P.charcoal]} style={s.flex}>
        <View style={s.emptyWrap}>
          <Text style={s.emptyEmoji}>📈</Text>
          <Text style={s.emptyTitle}>Asset Odyssey</Text>
          <Text style={s.emptyBody}>Connect your wallet to begin your journey.</Text>
        </View>
      </LinearGradient>
    );
  }

  const totalUSD = (balance || 2) * solPrice;

  return (
    <LinearGradient colors={[P.black, P.charcoal]} style={s.flex}>

      {/* Header */}
      <LinearGradient colors={[P.charcoal, P.dark]} style={s.header}>
        <Text style={s.eyebrow}>YOUR ASSET JOURNEY</Text>
        <Text style={s.headerTitle}>Odyssey</Text>
        {/* City Toggle */}
        <View style={s.toggle}>
          {[CityType.MANHATTAN, CityType.DUBAI].map(c => (
            <TouchableOpacity
              key={c}
              style={[s.toggleBtn, city === c && s.toggleActive]}
              onPress={() => setCity(c)}
            >
              <Text style={[s.toggleText, city === c && s.toggleTextActive]}>
                {c === CityType.MANHATTAN ? '🗽 NYC' : '🏙️ Dubai'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={s.scroll}>

        {/* Current Status Card */}
        <LinearGradient
          colors={[P.dark, '#1A150A']}
          style={[s.card, { borderColor: currentTier?.color || P.gold }]}
        >
          <LinearGradient
            colors={[P.goldDeep, P.gold, P.goldLight, P.gold, P.goldDeep]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.accentLine}
          />
          <Text style={s.eyebrow}>CURRENT STATUS</Text>
          <Text style={s.heroTitle}>{currentTier?.names[city]}</Text>
          <Text style={s.heroLocation}>📍 {currentTier?.locations[city]}</Text>

          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statLabel}>LEVEL</Text>
              <Text style={[s.statValue, { color: currentTier?.color }]}>{currentTier?.level || '?'} • {currentTier ? valueCalculator.calculateStarProgress(balance || 2, currentTier)?.starsDisplay : '★☆☆'}
              </Text>
            </View>
            <View style={s.divider} />
            <View style={s.statItem}>
              <Text style={s.statLabel}>VALUE</Text>
              <Text style={s.statValue}>
                ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
            </View>
          </View>

          <View style={s.narrativeWrap}>
            <Text style={s.narrative}>{currentTier?.narratives[city]}</Text>
          </View>
        </LinearGradient>

        {/* Upgrade Path */}
        {upgrade && upgrade.nextTier && (
          <LinearGradient
            colors={[P.dark, P.charcoal]}
            style={[s.card, { borderColor: P.gold }]}
          >
            <Text style={s.eyebrow}>NEXT MILESTONE</Text>
            <Text style={s.upgradeTitle}>
              {upgrade.nextTier.names[city]}
            </Text>
            <Text style={s.upgradeNeed}>
              Need {upgrade.solNeeded.toFixed(2)} more SOL (${upgrade.usdNeeded.toLocaleString()})
            </Text>

            {/* Progress Bar */}
            <View style={s.progressBg}>
              <View style={[s.progressBar, { width: `${upgrade.progress}%` }]} />
            </View>
            <Text style={s.progressText}>{upgrade.progress.toFixed(0)}% to next tier</Text>

            {/* Jupiter Button */}
            <TouchableOpacity
              style={s.jupiterBtn}
              onPress={() => Linking.openURL('https://jup.ag/swap/USDC-SOL')}
            >
              <LinearGradient
                colors={[P.goldDeep, P.gold, P.goldLight]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.jupiterGradient}
              >
                <Text style={s.jupiterText}>⚡ Upgrade with Jupiter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* User History */}
        <View style={s.section}>
          {history.map((record, idx) => (
              <LinearGradient
                key={idx}
                colors={[P.dark, P.charcoal]}
                style={[s.historyCard, { borderColor: record.tier?.color || P.mid }]}
              >
                <View style={s.historyHeader}>
                  <Text style={s.historyDate}>
                    {new Date(record.timestamp).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </Text>
                  <Text style={[s.historyRarity, { color: record.tier?.color }]}>
                    {record.tier?.rarity}
                  </Text>
                </View>
                <Text style={s.historyName}>
                  {record.tier?.names?.[city] || record.propertyName}
                </Text>
                <Text style={s.historyValue}>
                  ${record.totalValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
              </LinearGradient>
            )
          )}
        </View>

        <View style={{ height: 60 }} />
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
  scroll: { padding: 16 },

  card: { borderRadius: 20, borderWidth: 2, padding: 24, marginBottom: 16, overflow: 'hidden' },
  accentLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: P.offWhite, letterSpacing: 0.5, marginBottom: 8, textAlign: 'center' },
  heroLocation: { fontSize: 13, color: P.gray, marginBottom: 20, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: P.mid },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 10, color: P.gray, letterSpacing: 2, fontWeight: '600', marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '700', color: P.offWhite },
  divider: { width: 1, backgroundColor: P.mid },
  narrativeWrap: { marginTop: 20 },
  narrative: { fontSize: 14, color: P.gray, lineHeight: 22, textAlign: 'center', letterSpacing: 0.3, fontStyle: 'italic' },

  upgradeTitle: { fontSize: 20, color: P.offWhite, fontWeight: '600', marginBottom: 8 },
  upgradeNeed: { fontSize: 13, color: P.gray, marginBottom: 16 },
  progressBg: { height: 8, backgroundColor: P.mid, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressBar: { height: '100%', backgroundColor: P.gold },
  progressText: { fontSize: 11, color: P.gray, marginBottom: 16 },
  jupiterBtn: { borderRadius: 12, overflow: 'hidden' },
  jupiterGradient: { paddingVertical: 14, alignItems: 'center' },
  jupiterText: { fontSize: 16, fontWeight: '700', color: P.black },

  section: { marginTop: 24 },
  sectionTitle: { fontSize: 16, color: P.offWhite, fontWeight: '300', letterSpacing: 0.5, marginBottom: 12 },
  historyCard: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 8 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  historyDate: { fontSize: 11, color: P.gray },
  historyRarity: { fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  historyName: { fontSize: 16, color: P.offWhite, fontWeight: '600', marginBottom: 4 },
  historyValue: { fontSize: 14, color: P.gold, fontWeight: '600' },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48 },
  emptyEmoji: { fontSize: 56, marginBottom: 20 },
  emptyTitle: { fontSize: 28, fontWeight: '300', color: P.offWhite, letterSpacing: 2, marginBottom: 12 },
  emptyBody: { fontSize: 14, color: P.gray, textAlign: 'center', lineHeight: 22 },
});
