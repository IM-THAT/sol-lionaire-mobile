import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, StatusBar, Switch } from 'react-native';
import { useRealWalletConnection } from './src/hooks/useRealWalletConnection';
import { valueCalculator } from './src/services/valueCalculator';
import { priceDataService } from './src/services/pythPriceService';
import { geofencingService } from './src/services/geofencingService';
import { realNFTMinter } from './src/services/realNFTMinter';

const CityType = {
  MANHATTAN: 'MANHATTAN',
  DUBAI: 'DUBAI',
  SEOUL: 'SEOUL',
  TOKYO: 'TOKYO',
};

// Components
import { Button } from './src/components/ui/Button';
import { Card } from './src/components/ui/Card';
import WalletSection from './src/components/WalletSection';
import ResultCard from './src/components/ResultCard';
import ShareButtons from './src/components/ShareButtons';
import CalculatingAnimation from './src/components/CalculatingAnimation';
import MintButton from './src/components/MintButton';
import AnimatedCounter from './src/components/AnimatedCounter';

// Styles
import { Colors, Typography, Spacing } from './src/styles/theme';

/**
 * Sol-lionaire FINAL VERSION
 * MONOLITH Hackathon 2026
 * 
 * All features integrated:
 * - Real Pyth Network prices
 * - Real cNFT minting
 * - Real MWA wallet connection
 * - GPS geofencing
 * - Premium UI/UX
 * - Social sharing
 */
export default function App() {
  // Wallet
  const {
    walletAddress,
    balance,
    isConnected,
    isLoading: walletLoading,
    error: walletError,
    walletName,
    connectWallet,
    disconnectWallet,
    signAndSendTransaction,
  } = useRealWalletConnection();

  // State
  const [selectedCity, setSelectedCity] = useState(CityType.MANHATTAN);
  const [solPrice, setSolPrice] = useState(0);
  const [pricePerSqm, setPricePerSqm] = useState(0);
  const [mappingResult, setMappingResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // GPS
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [unlockedRewards, setUnlockedRewards] = useState([]);

  /**
   * Load prices on mount and city change
   */
  useEffect(() => {
    loadPrices();
  }, [selectedCity]);

  const loadPrices = async () => {
    try {
      const prices = await priceDataService.fetchAllPrices(selectedCity);
      setSolPrice(prices.solPrice);
      setPricePerSqm(prices.pricePerSqm);
    } catch (error) {
      console.error('Failed to load prices:', error);
    }
  };

  /**
   * GPS Tracking
   */
  useEffect(() => {
    if (gpsEnabled) {
      geofencingService.requestNotificationPermission();
      geofencingService.startTracking(
        (location) => setCurrentLocation(location),
        (landmark) => {
          alert(`🎉 You arrived at ${landmark.name}!\n${landmark.reward.item} unlocked!`);
          loadUnlockedRewards();
        }
      );
    } else {
      geofencingService.stopTracking();
    }

    return () => {
      geofencingService.stopTracking();
    };
  }, [gpsEnabled]);

  const loadUnlockedRewards = () => {
    const rewards = geofencingService.getUnlockedRewards();
    setUnlockedRewards(rewards);
  };

  useEffect(() => {
    loadUnlockedRewards();
  }, []);

  /**
   * Calculate territory
   */
  const handleCalculate = async () => {
    if (!isConnected || balance <= 0) {
      alert('Please connect your wallet first');
      return;
    }

    setIsCalculating(true);

    try {
      // Refresh prices
      await loadPrices();

      // Calculate mapping
      const result = valueCalculator.determineMapping({
        solAmount: balance,
        solPrice,
        cityPricePerSqm: pricePerSqm,
        cityType: selectedCity,
      });

      // Simulate calculation delay for UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMappingResult(result);
    } catch (error) {
      console.error('Calculation failed:', error);
      alert('Calculation failed. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * City selection
   */
  const renderCityButton = (city, icon) => (
    <Button
      key={city}
      title={`${icon} ${city}`}
      onPress={() => {
        setSelectedCity(city);
        setMappingResult(null);
      }}
      variant={selectedCity === city ? 'primary' : 'ghost'}
      size="medium"
      style={styles.cityButton}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sol-lionaire</Text>
        <Text style={styles.subtitle}>Your Crypto Real Estate</Text>
        
        {/* GPS Toggle */}
        <View style={styles.gpsToggle}>
          <Text style={styles.gpsLabel}>📍 Location Rewards</Text>
          <Switch
            value={gpsEnabled}
            onValueChange={setGpsEnabled}
            trackColor={{ false: '#333', true: Colors.success }}
            thumbColor={gpsEnabled ? Colors.white : '#666'}
          />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        {/* Wallet Section */}
        <WalletSection
          isConnected={isConnected}
          walletAddress={walletAddress}
          balance={balance}
          isLoading={walletLoading}
          error={walletError}
          walletName={walletName}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />

        {/* City Selection */}
        {isConnected && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌆 Select City</Text>
            <View style={styles.cityGrid}>
              {renderCityButton(CityType.MANHATTAN, '🗽')}
              {renderCityButton(CityType.DUBAI, '🏜️')}
              {renderCityButton(CityType.SEOUL, '🇰🇷')}
              {renderCityButton(CityType.TOKYO, '🗼')}
            </View>
          </View>
        )}

        {/* Market Data */}
        {isConnected && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Market Data</Text>
            <Card variant="default" padding="medium">
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>SOL Price:</Text>
                <AnimatedCounter
                  targetValue={solPrice}
                  prefix="$"
                  decimals={2}
                  style={styles.priceValue}
                />
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>{selectedCity} (per m²):</Text>
                <AnimatedCounter
                  targetValue={pricePerSqm}
                  prefix="$"
                  style={styles.priceValue}
                />
              </View>
            </Card>
          </View>
        )}

        {/* Calculate Button */}
        {isConnected && (
          <Button
            title="🏠 Calculate My Territory"
            onPress={handleCalculate}
            loading={isCalculating}
            variant="success"
            size="large"
            style={styles.calculateButton}
          />
        )}

        {/* Result */}
        {mappingResult && !isCalculating && (
          <>
            <ResultCard mappingResult={mappingResult} />

            {/* NFT Minting */}
            <MintButton
              mappingResult={mappingResult}
              walletAddress={walletAddress}
              balance={balance}
              signTransaction={signAndSendTransaction}
            />

            {/* Share Buttons */}
            <ShareButtons
              mappingResult={mappingResult}
              balance={balance}
              onShareSuccess={(result) => {
                console.log('Share success:', result);
              }}
            />
          </>
        )}

        {/* Rewards Info */}
        {unlockedRewards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Unlocked Rewards ({unlockedRewards.length})</Text>
            <Card variant="gold" padding="medium">
              {unlockedRewards.slice(0, 3).map((reward, index) => (
                <Text key={index} style={styles.rewardText}>
                  {reward.reward.item} • {reward.landmarkName}
                </Text>
              ))}
            </Card>
          </View>
        )}

      </ScrollView>

      {/* Calculating Animation Overlay */}
      <CalculatingAnimation visible={isCalculating} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.darkGray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.gold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.lightGray,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  gpsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  gpsLabel: {
    fontSize: Typography.sm,
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.white,
    marginBottom: Spacing.base,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  cityButton: {
    flex: 1,
    minWidth: '45%',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  priceLabel: {
    fontSize: Typography.sm,
    color: Colors.lightGray,
  },
  priceValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  calculateButton: {
    marginVertical: Spacing.xl,
  },
  rewardText: {
    fontSize: Typography.sm,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
});
