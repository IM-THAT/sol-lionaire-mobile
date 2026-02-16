import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Colors, Typography, Spacing } from '../styles/theme';

/**
 * Wallet Connection Section Component
 */
export const WalletSection = ({
  isConnected,
  walletAddress,
  balance,
  isLoading,
  error,
  useMockBalance,
  walletName,
  onConnect,
  onDisconnect,
  onChangeMockBalance,
}) => {
  if (!isConnected) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>💼 Wallet</Text>
        
        <Button
          title="Connect Wallet"
          onPress={onConnect}
          loading={isLoading}
          variant="primary"
          size="large"
        />
        
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>💼 Wallet</Text>
      
      <Card variant="default" padding="medium">
        {/* Wallet Name */}
        {walletName && (
          <View style={styles.row}>
            <Text style={styles.label}>Wallet:</Text>
            <Text style={styles.value}>{walletName}</Text>
          </View>
        )}
        
        {/* Address */}
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.address}>
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
          </Text>
        </View>
        
        {/* Balance */}
        <View style={styles.row}>
          <Text style={styles.label}>Balance:</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balance}>{balance.toFixed(4)} SOL</Text>
            {useMockBalance && (
              <Button
                title="Change"
                onPress={onChangeMockBalance}
                variant="ghost"
                size="small"
              />
            )}
          </View>
        </View>
        
        {/* Disconnect Button */}
        <Button
          title="Disconnect"
          onPress={onDisconnect}
          variant="secondary"
          size="medium"
          style={styles.disconnectButton}
        />
      </Card>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.white,
    marginBottom: Spacing.base,
  },
  row: {
    marginTop: Spacing.md,
  },
  label: {
    fontSize: Typography.sm,
    color: Colors.lightGray,
  },
  value: {
    fontSize: Typography.base,
    color: Colors.white,
    marginTop: Spacing.xs,
    fontWeight: Typography.medium,
  },
  address: {
    fontSize: Typography.base,
    color: Colors.white,
    fontFamily: 'monospace',
    marginTop: Spacing.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  balance: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.gold,
  },
  disconnectButton: {
    marginTop: Spacing.base,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});

export default WalletSection;
