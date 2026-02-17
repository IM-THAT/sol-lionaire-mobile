import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Switch, Linking, Alert,
} from 'react-native';
import { useRealWalletConnection } from '../hooks/useRealWalletConnection';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/theme';

const APP_VERSION = '0.4.0';
const HACKATHON = 'MONOLITH 2026';

export default function MoreScreen() {
  const { walletAddress, isConnected, disconnectWallet, walletName } = useRealWalletConnection();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [devMode, setDevMode] = useState(false);

  const SettingRow = ({ icon, title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement && <View style={styles.settingRight}>{rightElement}</View>}
      {onPress && !rightElement && <Text style={styles.settingArrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ More</Text>
        <Text style={styles.subtitle}>Settings & Info</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Wallet Section */}
        <Text style={styles.sectionTitle}>WALLET</Text>
        <View style={styles.card}>
          {isConnected ? (
            <>
              <SettingRow
                icon="💼"
                title={walletName || 'Connected Wallet'}
                subtitle={walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}` : ''}
              />
              <View style={styles.divider} />
              <SettingRow
                icon="🔌"
                title="Disconnect Wallet"
                subtitle="Sign out from current wallet"
                onPress={() => {
                  Alert.alert(
                    'Disconnect Wallet',
                    'Are you sure you want to disconnect?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Disconnect', style: 'destructive', onPress: disconnectWallet },
                    ]
                  );
                }}
              />
            </>
          ) : (
            <SettingRow
              icon="🔗"
              title="Connect Wallet"
              subtitle="Go to Home tab to connect"
            />
          )}
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🔔"
            title="Notifications"
            subtitle="Location rewards and price alerts"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#333', true: Colors.gold }}
                thumbColor={Colors.white}
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🧪"
            title="Developer Mode"
            subtitle="Show debug info and mock data"
            rightElement={
              <Switch
                value={devMode}
                onValueChange={setDevMode}
                trackColor={{ false: '#333', true: Colors.gold }}
                thumbColor={Colors.white}
              />
            }
          />
        </View>

        {/* Network */}
        <Text style={styles.sectionTitle}>NETWORK</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🌐"
            title="Solana Network"
            subtitle="Devnet (Testing)"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📡"
            title="Price Feed"
            subtitle="Pyth Network (Live)"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🎨"
            title="NFT Standard"
            subtitle="Metaplex Bubblegum (cNFT)"
          />
        </View>

        {/* Legal Disclaimer */}
        <Text style={styles.sectionTitle}>LEGAL</Text>
        <View style={styles.legalCard}>
          <Text style={styles.legalTitle}>⚖️ Legal Disclaimer</Text>
          <Text style={styles.legalText}>
            Sol-lionaire is an entertainment and educational application. All real estate valuations displayed within this application are purely illustrative and based on publicly available market data.
          </Text>
          <Text style={styles.legalText}>
            Nothing in this application constitutes legal ownership, title, or any proprietary interest in real property. The application does not facilitate, represent, or guarantee any real estate transactions.
          </Text>
          <Text style={styles.legalText}>
            Cryptocurrency values are highly volatile. SOL/USD price data is sourced from Pyth Network and may not reflect current market conditions. Past performance does not guarantee future results.
          </Text>
          <Text style={styles.legalText}>
            NFTs minted within this application represent digital collectibles only and confer no rights, title, or interest in any physical real estate asset.
          </Text>
          <Text style={styles.legalSignature}>
            — Prepared with legal expertise for informational purposes only.
          </Text>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🏆"
            title="MONOLITH Hackathon 2026"
            subtitle="Solana Mobile Track"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📱"
            title="Optimized for Seeker Phone"
            subtitle="Solana Mobile Stack"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="ℹ️"
            title={`Version ${APP_VERSION}`}
            subtitle="Sol-lionaire v0.4"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🐙"
            title="GitHub"
            subtitle="github.com/MinjiLee-gloria/sol-lionaire-mobile"
            onPress={() => Linking.openURL('https://github.com/MinjiLee-gloria/sol-lionaire-mobile')}
          />
        </View>

        {/* Bottom padding */}
        <View style={{ height: 20 }} />

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
  content: { padding: Spacing.lg },

  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.lightGray,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    marginLeft: Spacing.sm,
  },

  card: {
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  settingIcon: { fontSize: 22, width: 30, textAlign: 'center' },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: Typography.base, color: Colors.white, fontWeight: Typography.medium },
  settingSubtitle: { fontSize: Typography.sm, color: Colors.lightGray, marginTop: 2 },
  settingRight: { marginLeft: Spacing.sm },
  settingArrow: { fontSize: Typography.xl, color: Colors.lightGray },

  divider: { height: 1, backgroundColor: '#333', marginLeft: 56 },

  // Legal
  legalCard: {
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#444',
  },
  legalTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.gold,
    marginBottom: Spacing.md,
  },
  legalText: {
    fontSize: Typography.sm,
    color: Colors.lightGray,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  legalSignature: {
    fontSize: Typography.sm,
    color: Colors.gold,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    textAlign: 'right',
  },
});
