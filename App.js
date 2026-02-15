import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  StatusBar,
  Modal,
  Switch,
} from 'react-native';
import { useWalletConnection } from './src/hooks/useWalletConnection';
import { valueCalculator, CityType } from './src/services/valueCalculator';
import { priceDataService } from './src/services/priceDataService';
import { geofencingService } from './src/services/geofencingService';
import MintButton from './src/components/MintButton';
import AnimatedCounter from './src/components/AnimatedCounter';
import ShareCard from './src/components/ShareCard';

/**
 * Sol-lionaire v0.3
 * MONOLITH Hackathon - Final Version
 * 
 * Features:
 * - 4 Cities (Manhattan, Dubai, Seoul, Tokyo)
 * - cNFT Minting
 * - GPS Geofencing
 * - Animated UI
 * - Share Cards
 */
export default function App() {
  const {
    walletAddress,
    balance,
    isConnected,
    isLoading: walletLoading,
    error: walletError,
    useMockBalance,
    connectWallet,
    disconnectWallet,
    setMockBalance,
  } = useWalletConnection();

  const [selectedCity, setSelectedCity] = useState(CityType.MANHATTAN);
  const [solPrice, setSolPrice] = useState(0);
  const [pricePerSqm, setPricePerSqm] = useState(0);
  const [mappingResult, setMappingResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // GPS 기능
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [unlockedRewards, setUnlockedRewards] = useState([]);
  
  // 모달
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  const TEST_WALLET = '7gh5fZGdnGQWLajuGj8u4rEPNZrVjtxPbCXNHDzkQ5LX';

  /**
   * 가격 데이터 로드
   */
  useEffect(() => {
    loadPrices();
  }, [selectedCity]);

  const loadPrices = async () => {
    const prices = await priceDataService.fetchAllPrices(selectedCity);
    setSolPrice(prices.solPrice);
    setPricePerSqm(prices.pricePerSqm);
  };

  /**
   * GPS 추적 토글
   */
  useEffect(() => {
    if (gpsEnabled) {
      geofencingService.requestNotificationPermission();
      geofencingService.startTracking(
        (location) => setCurrentLocation(location),
        (landmark) => {
          // 보상 해금 알림
          alert(`🎉 ${landmark.name}에 도착했습니다!\n${landmark.reward.item} 획득!`);
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

  /**
   * 획득한 보상 로드
   */
  const loadUnlockedRewards = () => {
    const rewards = geofencingService.getUnlockedRewards();
    setUnlockedRewards(rewards);
  };

  useEffect(() => {
    loadUnlockedRewards();
  }, []);

  /**
   * 지갑 연결
   */
  const handleConnect = async () => {
    await connectWallet(TEST_WALLET, 2.0);
  };

  /**
   * 가치 환산 계산
   */
  const handleCalculate = async () => {
    if (!isConnected || balance <= 0) {
      alert('먼저 지갑을 연결해주세요');
      return;
    }

    setIsCalculating(true);

    try {
      await loadPrices();

      const result = valueCalculator.determineMapping({
        solAmount: balance,
        solPrice,
        cityPricePerSqm: pricePerSqm,
        cityType: selectedCity,
      });

      setMappingResult(result);
    } catch (error) {
      console.error('계산 실패:', error);
      alert('계산 중 오류가 발생했습니다');
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * 도시 변경
   */
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setMappingResult(null);
  };

  /**
   * Mock 잔액 변경
   */
  const handleChangeMockBalance = () => {
    const amount = prompt('테스트용 SOL 잔액을 입력하세요 (예: 2, 100, 5000)');
    if (amount && !isNaN(amount)) {
      setMockBalance(parseFloat(amount));
      setMappingResult(null);
    }
  };

  /**
   * 렌더링: 도시 버튼
   */
  const renderCityButton = (city, icon) => (
    <TouchableOpacity
      key={city}
      style={[
        styles.cityButton,
        selectedCity === city && styles.cityButtonActive
      ]}
      onPress={() => handleCityChange(city)}
    >
      <Text style={styles.cityIcon}>{icon}</Text>
      <Text style={[
        styles.cityButtonText,
        selectedCity === city && styles.cityButtonTextActive
      ]}>
        {city}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>Sol-lionaire</Text>
        <Text style={styles.subtitle}>Your Crypto Real Estate</Text>
        {useMockBalance && (
          <Text style={styles.mockBadge}>🧪 DEV MODE</Text>
        )}
        
        {/* GPS 토글 */}
        <View style={styles.gpsToggle}>
          <Text style={styles.gpsLabel}>📍 Location Rewards</Text>
          <Switch
            value={gpsEnabled}
            onValueChange={setGpsEnabled}
            trackColor={{ false: '#333', true: '#4CAF50' }}
            thumbColor={gpsEnabled ? '#FFF' : '#666'}
          />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        {/* 지갑 연결 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Wallet</Text>
          
          {!isConnected ? (
            <TouchableOpacity 
              style={styles.connectButton} 
              onPress={handleConnect}
              disabled={walletLoading}
            >
              {walletLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Connect Wallet</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>Address:</Text>
              <Text style={styles.walletAddress}>
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
              </Text>
              
              <Text style={styles.walletLabel}>Balance:</Text>
              <View style={styles.balanceRow}>
                <AnimatedCounter
                  targetValue={balance}
                  decimals={4}
                  suffix=" SOL"
                  style={styles.balance}
                />
                {useMockBalance && (
                  <TouchableOpacity 
                    style={styles.changeBalanceButton}
                    onPress={handleChangeMockBalance}
                  >
                    <Text style={styles.changeBalanceText}>Change</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* 보상 버튼 */}
              {unlockedRewards.length > 0 && (
                <TouchableOpacity
                  style={styles.rewardsButton}
                  onPress={() => setShowRewardsModal(true)}
                >
                  <Text style={styles.rewardsButtonText}>
                    🏆 Rewards ({unlockedRewards.length})
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.disconnectButton} 
                onPress={disconnectWallet}
              >
                <Text style={styles.buttonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 도시 선택 */}
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

        {/* 가격 정보 */}
        {isConnected && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Market Data</Text>
            <View style={styles.priceInfo}>
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
            </View>
          </View>
        )}

        {/* 계산 버튼 */}
        {isConnected && (
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.calculateButtonText}>🏠 Calculate My Territory</Text>
            )}
          </TouchableOpacity>
        )}

        {/* 결과 표시 */}
        {mappingResult && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>
              {mappingResult.type === 'MICRO' ? '🎯 Your Territory' : '🏆 Your Property'}
            </Text>

            <View style={styles.resultCard}>
              <AnimatedCounter
                targetValue={mappingResult.totalValue}
                prefix="$"
                decimals={2}
                style={styles.resultValue}
              />

              {mappingResult.type === 'MICRO' ? (
                <View>
                  <Text style={styles.resultObjectName}>
                    {mappingResult.object.name}
                  </Text>
                  <Text style={styles.resultObjectLocation}>
                    📍 {mappingResult.object.location}
                  </Text>
                  <Text style={styles.resultObjectDesc}>
                    {mappingResult.object.description}
                  </Text>
                  {mappingResult.object.rarity && (
                    <View style={styles.rarityBadge}>
                      <Text style={styles.rarityText}>{mappingResult.object.rarity}</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <Text style={styles.resultPropertyName}>
                    {mappingResult.property.name}
                  </Text>
                  <Text style={styles.resultPropertyLocation}>
                    📍 {mappingResult.property.location}
                  </Text>
                  <Text style={styles.resultPropertyFloor}>
                    🏢 Floor {mappingResult.property.floor} • {mappingResult.property.view}
                  </Text>
                  <Text style={styles.resultPropertyArea}>
                    📐 {mappingResult.ownedArea?.toFixed(2) || mappingResult.property.area} m²
                  </Text>

                  {mappingResult.ownershipType === 'PARTIAL' && (
                    <View style={styles.partialOwnership}>
                      <Text style={styles.partialTitle}>You Own:</Text>
                      {mappingResult.ownedRooms.map((room, index) => (
                        <Text key={index} style={styles.roomItem}>• {room}</Text>
                      ))}
                      <Text style={styles.ownershipRatio}>
                        ({(mappingResult.ownershipRatio * 100).toFixed(1)}%)
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* NFT 발행 버튼 */}
            <MintButton
              mappingResult={mappingResult}
              walletAddress={walletAddress}
              balance={balance}
            />

            {/* 공유 버튼 */}
            <TouchableOpacity
              style={styles.shareButtonMain}
              onPress={() => setShowShareModal(true)}
            >
              <Text style={styles.shareButtonMainText}>📤 Share Your Territory</Text>
            </TouchableOpacity>

            <Text style={styles.timestamp}>
              Data: {new Date().toLocaleDateString()}
            </Text>
          </View>
        )}

      </ScrollView>

      {/* 공유 모달 */}
      <Modal
        visible={showShareModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {mappingResult && (
              <ShareCard
                mappingResult={mappingResult}
                balance={balance}
                cityType={selectedCity}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* 보상 모달 */}
      <Modal
        visible={showRewardsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRewardsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRewardsModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>🏆 Unlocked Rewards</Text>
            
            <ScrollView>
              {unlockedRewards.map((reward, index) => (
                <View key={index} style={styles.rewardItem}>
                  <Text style={styles.rewardName}>{reward.reward.item}</Text>
                  <Text style={styles.rewardLocation}>📍 {reward.landmarkName}</Text>
                  <Text style={styles.rewardDate}>
                    {new Date(reward.unlockedAt).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (스타일은 너무 길어서 다음 파일에 분리하겠습니다)
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#1A1A1A', borderBottomWidth: 1, borderBottomColor: '#FFD700' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFD700', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 5 },
  mockBadge: { fontSize: 11, color: '#FF6B00', textAlign: 'center', marginTop: 8, fontWeight: '600' },
  gpsToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 10 },
  gpsLabel: { fontSize: 12, color: '#FFF' },
  content: { flex: 1 },
  contentContainer: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 15 },
  connectButton: { backgroundColor: '#FFD700', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '600' },
  walletInfo: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  walletLabel: { fontSize: 12, color: '#999', marginTop: 10 },
  walletAddress: { fontSize: 14, color: '#FFF', fontFamily: 'monospace', marginTop: 5 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  balance: { fontSize: 24, fontWeight: 'bold', color: '#FFD700' },
  changeBalanceButton: { backgroundColor: '#FF6B00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 },
  changeBalanceText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  rewardsButton: { backgroundColor: '#9C27B0', padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  rewardsButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  disconnectButton: { backgroundColor: '#666', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cityButton: { flex: 1, minWidth: '45%', padding: 15, borderRadius: 10, backgroundColor: '#1A1A1A', borderWidth: 2, borderColor: '#333', alignItems: 'center' },
  cityButtonActive: { borderColor: '#FFD700', backgroundColor: '#2A2A1A' },
  cityIcon: { fontSize: 24, marginBottom: 5 },
  cityButtonText: { color: '#999', fontSize: 14, fontWeight: '600' },
  cityButtonTextActive: { color: '#FFD700' },
  priceInfo: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  priceLabel: { fontSize: 12, color: '#999' },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  calculateButton: { backgroundColor: '#00A86B', padding: 18, borderRadius: 10, alignItems: 'center', marginVertical: 20 },
  calculateButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  resultSection: { marginTop: 10 },
  resultTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFD700', textAlign: 'center', marginBottom: 15 },
  resultCard: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 15, borderWidth: 2, borderColor: '#FFD700' },
  resultValue: { fontSize: 28, fontWeight: 'bold', color: '#00A86B', textAlign: 'center', marginBottom: 15 },
  resultObjectName: { fontSize: 22, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
  resultObjectLocation: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 8 },
  resultObjectDesc: { fontSize: 16, color: '#FFD700', textAlign: 'center', fontStyle: 'italic' },
  rarityBadge: { marginTop: 12, padding: 8, backgroundColor: '#2A2A2A', borderRadius: 8, alignSelf: 'center' },
  rarityText: { color: '#FFD700', fontSize: 12, fontWeight: '600' },
  resultPropertyName: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  resultPropertyLocation: { fontSize: 14, color: '#999', marginBottom: 5 },
  resultPropertyFloor: { fontSize: 14, color: '#FFF', marginBottom: 5 },
  resultPropertyArea: { fontSize: 14, color: '#FFD700', marginBottom: 10 },
  partialOwnership: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#333' },
  partialTitle: { fontSize: 14, color: '#999', marginBottom: 8 },
  roomItem: { fontSize: 14, color: '#FFF', marginBottom: 4 },
  ownershipRatio: { fontSize: 12, color: '#FFD700', marginTop: 8, fontStyle: 'italic' },
  shareButtonMain: { backgroundColor: '#1DA1F2', padding: 16, borderRadius: 12, marginTop: 15, alignItems: 'center' },
  shareButtonMainText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  timestamp: { fontSize: 11, color: '#666', textAlign: 'center', marginTop: 15, fontStyle: 'italic' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1A1A1A', borderRadius: 20, padding: 20, maxHeight: '90%' },
  closeButton: { alignSelf: 'flex-end', padding: 10 },
  closeButtonText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFD700', textAlign: 'center', marginBottom: 20 },
  rewardItem: { backgroundColor: '#2A2A2A', padding: 15, borderRadius: 10, marginBottom: 10 },
  rewardName: { fontSize: 18, fontWeight: 'bold', color: '#FFD700', marginBottom: 5 },
  rewardLocation: { fontSize: 14, color: '#999', marginBottom: 3 },
  rewardDate: { fontSize: 12, color: '#666' },
});
