import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Card } from './ui/Card';
import AnimatedCounter from './AnimatedCounter';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/theme';

/**
 * Premium Result Card Component
 * Shows territory/property with animations
 */
export const ResultCard = ({ mappingResult, onMount }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onMount) onMount();
    });
  }, []);

  const { type, totalValue, object, property, ownedArea, ownershipType, ownedRooms } = mappingResult;
  const isMicro = type === 'MICRO';
  const item = isMicro ? object : property;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Title */}
      <Text style={styles.title}>
        {isMicro ? '🎯 Your Territory' : '🏆 Your Property'}
      </Text>

      {/* Main Card */}
      <Card variant="gold" padding="large" shadow>
        {/* Total Value */}
        <AnimatedCounter
          targetValue={totalValue}
          prefix="$"
          decimals={2}
          style={styles.valueText}
        />

        {/* Micro Object */}
        {isMicro && (
          <View style={styles.objectContainer}>
            <Text style={styles.objectName}>{object.name}</Text>
            <Text style={styles.objectLocation}>📍 {object.location}</Text>
            <Text style={styles.objectDescription}>{object.description}</Text>

            {object.rarity && (
              <View style={[styles.rarityBadge, { borderColor: getRarityColor(object.rarity) }]}>
                <Text style={[styles.rarityText, { color: getRarityColor(object.rarity) }]}>
                  {object.rarity}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Macro Property */}
        {!isMicro && (
          <View style={styles.propertyContainer}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <Text style={styles.propertyLocation}>📍 {property.location}</Text>

            {/* Property Details */}
            <View style={styles.detailsRow}>
              <DetailItem icon="🏢" label={`Floor ${property.floor}`} />
              <DetailItem icon="📐" label={`${ownedArea?.toFixed(1) || property.area} m²`} />
            </View>

            <Text style={styles.propertyView}>🌆 {property.view}</Text>

            {/* Partial Ownership */}
            {ownershipType === 'PARTIAL' && (
              <View style={styles.partialSection}>
                <Text style={styles.partialTitle}>You Own:</Text>
                {ownedRooms.map((room, index) => (
                  <AnimatedRoom key={index} room={room} delay={index * 100} />
                ))}
                <Text style={styles.ownershipRatio}>
                  ({((ownedArea / property.area) * 100).toFixed(1)}% ownership)
                </Text>
              </View>
            )}
          </View>
        )}
      </Card>

      {/* Timestamp */}
      <Text style={styles.timestamp}>
        Data based on {new Date().toLocaleDateString()}
      </Text>
    </Animated.View>
  );
};

/**
 * Animated Room Item
 */
const AnimatedRoom = ({ room, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.Text style={[styles.roomItem, { opacity: fadeAnim }]}>
      • {room}
    </Animated.Text>
  );
};

/**
 * Property Detail Item
 */
const DetailItem = ({ icon, label }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <Text style={styles.detailLabel}>{label}</Text>
  </View>
);

/**
 * Get rarity color
 */
const getRarityColor = (rarity) => {
  const colors = {
    Common: Colors.common,
    Uncommon: Colors.uncommon,
    Rare: Colors.rare,
    Epic: Colors.epic,
    Legendary: Colors.legendary,
  };
  return colors[rarity] || Colors.white;
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.gold,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  valueText: {
    fontSize: Typography.huge,
    fontWeight: Typography.bold,
    color: Colors.success,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  
  // Micro Object
  objectContainer: {
    alignItems: 'center',
  },
  objectName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  objectLocation: {
    fontSize: Typography.base,
    color: Colors.lightGray,
    marginBottom: Spacing.sm,
  },
  objectDescription: {
    fontSize: Typography.md,
    color: Colors.gold,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  rarityBadge: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
  },
  rarityText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  
  // Macro Property
  propertyContainer: {
    // Styles for property
  },
  propertyName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  propertyLocation: {
    fontSize: Typography.base,
    color: Colors.lightGray,
    marginBottom: Spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailIcon: {
    fontSize: Typography.base,
  },
  detailLabel: {
    fontSize: Typography.base,
    color: Colors.white,
    fontWeight: Typography.medium,
  },
  propertyView: {
    fontSize: Typography.base,
    color: Colors.gold,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  partialSection: {
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  partialTitle: {
    fontSize: Typography.base,
    color: Colors.lightGray,
    marginBottom: Spacing.sm,
  },
  roomItem: {
    fontSize: Typography.base,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  ownershipRatio: {
    fontSize: Typography.sm,
    color: Colors.gold,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  timestamp: {
    fontSize: Typography.xs,
    color: Colors.darkText,
    textAlign: 'center',
    marginTop: Spacing.base,
    fontStyle: 'italic',
  },
});

export default ResultCard;
