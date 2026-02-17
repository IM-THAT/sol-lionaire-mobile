import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRealWalletConnection } from '../hooks/useRealWalletConnection';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/theme';

const RARITY_COLORS = {
  Common: '#9E9E9E',
  Uncommon: '#4CAF50',
  Rare: '#2196F3',
  Epic: '#9C27B0',
  Legendary: '#FFD700',
  Standard: '#9E9E9E',
};

export default function AssetsScreen() {
  const { walletAddress, isConnected } = useRealWalletConnection();
  const [nfts, setNfts] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [activeTab, setActiveTab] = useState('nfts');
  const [stats, setStats] = useState({ total: 0, totalValue: 0, rarest: null });

  useEffect(() => {
    if (walletAddress) {
      loadAssets();
    }
  }, [walletAddress]);

  const loadAssets = async () => {
    try {
      // Load NFTs
      const nftKey = `nfts_${walletAddress}`;
      const nftData = await AsyncStorage.getItem(nftKey);
      const nftList = nftData ? JSON.parse(nftData) : [];
      setNfts(nftList);

      // Load history as additional source
      const historyKey = `history_${walletAddress}`;
      const historyData = await AsyncStorage.getItem(historyKey);
      const history = historyData ? JSON.parse(historyData) : [];

      // Load rewards
      const rewardKey = 'unlocked_rewards';
      const rewardData = await AsyncStorage.getItem(rewardKey);
      const rewardList = rewardData ? JSON.parse(rewardData) : [];
      setRewards(rewardList);

      // Calculate stats
      const totalValue = nftList.reduce((sum, n) => sum + (n.totalValue || 0), 0);
      setStats({
        total: nftList.length,
        totalValue,
        rarest: nftList.find(n => n.rarity === 'Legendary') || nftList[0],
      });
    } catch (e) {
      console.error('Asset load failed:', e);
    }
  };

  const NFTCard = ({ item }) => (
    <View style={styles.nftCard}>
      <View style={styles.nftImagePlaceholder}>
        <Text style={styles.nftEmoji}>🏠</Text>
      </View>
      <View style={styles.nftInfo}>
        <Text style={styles.nftName} numberOfLines={1}>{item.name || 'Sol-lionaire NFT'}</Text>
        <Text style={styles.nftCity}>{item.cityType || 'Manhattan'}</Text>
        <Text style={styles.nftValue}>
          ${(item.totalValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
        <View style={[
          styles.rarityBadge,
          { borderColor: RARITY_COLORS[item.rarity] || RARITY_COLORS.Standard }
        ]}>
          <Text style={[
            styles.rarityText,
            { color: RARITY_COLORS[item.rarity] || RARITY_COLORS.Standard }
          ]}>
            {item.rarity || 'Standard'}
          </Text>
        </View>
        <Text style={styles.nftDate}>
          {item.mintedAt ? new Date(item.mintedAt).toLocaleDateString() : ''}
        </Text>
      </View>
    </View>
  );

  const RewardCard = ({ item }) => (
    <View style={styles.rewardCard}>
      <Text style={styles.rewardEmoji}>🏆</Text>
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName}>{item.reward?.item || 'Reward'}</Text>
        <Text style={styles.rewardLocation}>{item.landmarkName}</Text>
        <Text style={styles.rewardDate}>
          {item.unlockedAt ? new Date(item.unlockedAt).toLocaleDateString() : ''}
        </Text>
      </View>
      <View style={[
        styles.rarityBadge,
        { borderColor: RARITY_COLORS[item.reward?.rarity] || RARITY_COLORS.Common }
      ]}>
        <Text style={[
          styles.rarityText,
          { color: RARITY_COLORS[item.reward?.rarity] || RARITY_COLORS.Common }
        ]}>
          {item.reward?.rarity || 'Common'}
        </Text>
      </View>
    </View>
  );

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎨 Assets</Text>
          <Text style={styles.subtitle}>My Collection</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔗</Text>
          <Text style={styles.emptyTitle}>Wallet Not Connected</Text>
          <Text style={styles.emptyText}>Connect your wallet in the Home tab to see your assets.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎨 Assets</Text>
        <Text style={styles.subtitle}>My Collection</Text>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>NFTs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{rewards.length}</Text>
          <Text style={styles.statLabel}>Rewards</Text>
        </View>
      </View>

      {/* Inner Tabs */}
      <View style={styles.innerTabs}>
        <TouchableOpacity
          style={[styles.innerTab, activeTab === 'nfts' && styles.innerTabActive]}
          onPress={() => setActiveTab('nfts')}
        >
          <Text style={[styles.innerTabText, activeTab === 'nfts' && styles.innerTabTextActive]}>
            NFTs ({nfts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.innerTab, activeTab === 'rewards' && styles.innerTabActive]}
          onPress={() => setActiveTab('rewards')}
        >
          <Text style={[styles.innerTabText, activeTab === 'rewards' && styles.innerTabTextActive]}>
            Rewards ({rewards.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {activeTab === 'nfts' && (
          nfts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏠</Text>
              <Text style={styles.emptyTitle}>No NFTs Yet</Text>
              <Text style={styles.emptyText}>
                Calculate your territory in Home and mint your first NFT!
              </Text>
            </View>
          ) : (
            nfts.map((item, index) => <NFTCard key={index} item={item} />)
          )
        )}

        {activeTab === 'rewards' && (
          rewards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📍</Text>
              <Text style={styles.emptyTitle}>No Rewards Yet</Text>
              <Text style={styles.emptyText}>
                Visit real-world landmarks in Manhattan or Dubai to unlock rewards!
              </Text>
            </View>
          ) : (
            rewards.map((item, index) => <RewardCard key={index} item={item} />)
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.darkGray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold,
    alignItems: 'center',
  },
  title: { fontSize: Typography.xxl, fontWeight: Typography.bold, color: Colors.gold },
  subtitle: { fontSize: Typography.sm, color: Colors.lightGray, marginTop: 4 },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: 40 },

  // Stats
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.darkGray,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.gold },
  statLabel: { fontSize: Typography.xs, color: Colors.lightGray, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#333' },

  // Inner Tabs
  innerTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.darkGray,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  innerTab: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  innerTabActive: { borderBottomColor: Colors.gold },
  innerTabText: { fontSize: Typography.base, color: Colors.lightGray },
  innerTabTextActive: { color: Colors.gold, fontWeight: Typography.bold },

  // NFT Card
  nftCard: {
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#333',
    gap: Spacing.md,
  },
  nftImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#2A2A2A',
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nftEmoji: { fontSize: 36 },
  nftInfo: { flex: 1 },
  nftName: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.white, marginBottom: 2 },
  nftCity: { fontSize: Typography.sm, color: Colors.lightGray, marginBottom: 4 },
  nftValue: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.success, marginBottom: 4 },
  rarityBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    marginBottom: 4,
  },
  rarityText: { fontSize: Typography.xs, fontWeight: Typography.semibold },
  nftDate: { fontSize: Typography.xs, color: Colors.darkText },

  // Reward Card
  rewardCard: {
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    gap: Spacing.md,
  },
  rewardEmoji: { fontSize: 32 },
  rewardInfo: { flex: 1 },
  rewardName: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.white, marginBottom: 2 },
  rewardLocation: { fontSize: Typography.sm, color: Colors.lightGray, marginBottom: 2 },
  rewardDate: { fontSize: Typography.xs, color: Colors.darkText },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: { fontSize: 60, marginBottom: Spacing.lg },
  emptyTitle: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.white, marginBottom: Spacing.sm },
  emptyText: { fontSize: Typography.base, color: Colors.lightGray, textAlign: 'center', lineHeight: 22 },
});
