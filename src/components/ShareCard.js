import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';

/**
 * Share Card Component
 * Instagram/X에 최적화된 9:16 세로형 카드
 */
export const ShareCard = ({ mappingResult, balance, cityType }) => {
  const cardRef = useRef(null);

  const { type, totalValue, object, property, ownedArea } = mappingResult;
  const isMicro = type === 'MICRO';
  const item = isMicro ? object : property;

  /**
   * 카드를 이미지로 캡처하여 공유
   */
  const handleShare = async () => {
    try {
      // TODO: react-native-view-shot 사용하여 캡처
      // const uri = await captureRef(cardRef, {
      //   format: 'png',
      //   quality: 1,
      // });

      // Mock 구현
      Alert.alert(
        'Share',
        'Share functionality coming soon!\n\nThis will export your card as an image optimized for Instagram Stories and X.',
        [{ text: 'OK' }]
      );

      // TODO: Share API 사용
      // await Share.share({
      //   url: uri,
      //   message: `I own ${item.name} on Solana! 🏠💎\n\nCheck your crypto real estate: sol-lionaire.app`,
      // });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  /**
   * QR 코드 생성 (앱 다운로드용)
   */
  const generateQRCode = () => {
    // TODO: QR 코드 생성
    return 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=sol-lionaire.app';
  };

  return (
    <View style={styles.container}>
      {/* 카드 프리뷰 */}
      <View ref={cardRef} style={styles.card}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.logo}>Sol-lionaire</Text>
          <Text style={styles.badge}>{isMicro ? '🎯' : '🏆'}</Text>
        </View>

        {/* 메인 컨텐츠 */}
        <View style={styles.content}>
          {/* 가치 */}
          <Text style={styles.value}>${totalValue.toLocaleString()}</Text>
          
          {/* 아이템 이름 */}
          <Text style={styles.itemName}>{item.name}</Text>
          
          {/* 위치 */}
          <Text style={styles.location}>📍 {item.location}</Text>

          {/* Rarity (Micro만) */}
          {isMicro && item.rarity && (
            <View style={[styles.rarityBadge, { borderColor: getRarityColor(item.rarity) }]}>
              <Text style={[styles.rarityText, { color: getRarityColor(item.rarity) }]}>
                {item.rarity}
              </Text>
            </View>
          )}

          {/* Property 상세 (Macro만) */}
          {!isMicro && (
            <View style={styles.propertyDetails}>
              <Text style={styles.detailText}>🏢 Floor {property.floor}</Text>
              <Text style={styles.detailText}>📐 {ownedArea?.toFixed(1) || property.area} m²</Text>
              <Text style={styles.detailText}>🌆 {property.view}</Text>
            </View>
          )}

          {/* Description */}
          <Text style={styles.description}>
            {isMicro ? item.description : `Owner of ${cityType}`}
          </Text>
        </View>

        {/* 푸터 */}
        <View style={styles.footer}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={styles.statValue}>{balance.toFixed(2)} SOL</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>City</Text>
              <Text style={styles.statValue}>{cityType}</Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrSection}>
            <Image 
              source={{ uri: generateQRCode() }}
              style={styles.qrCode}
            />
            <Text style={styles.qrText}>Scan to check yours</Text>
          </View>

          {/* 타임스탬프 */}
          <Text style={styles.timestamp}>
            Data: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* 공유 버튼 */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>📤 Share to X / Instagram</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        💡 9:16 ratio optimized for Stories
      </Text>
    </View>
  );
};

/**
 * Rarity 색상 매핑
 */
const getRarityColor = (rarity) => {
  const colors = {
    Common: '#9E9E9E',
    Uncommon: '#4CAF50',
    Rare: '#2196F3',
    Epic: '#9C27B0',
    Legendary: '#FFD700',
  };
  return colors[rarity] || '#FFF';
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  card: {
    aspectRatio: 9 / 16, // 9:16 비율
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 25,
    borderWidth: 3,
    borderColor: '#FFD700',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  badge: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00A86B',
    marginBottom: 15,
  },
  itemName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  rarityBadge: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginVertical: 10,
  },
  rarityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  propertyDetails: {
    marginVertical: 15,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: '#FFF',
    marginVertical: 3,
  },
  description: {
    fontSize: 16,
    color: '#FFD700',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 3,
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  qrText: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
  timestamp: {
    fontSize: 9,
    color: '#444',
    textAlign: 'center',
    marginTop: 5,
  },
  shareButton: {
    backgroundColor: '#1DA1F2',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ShareCard;
