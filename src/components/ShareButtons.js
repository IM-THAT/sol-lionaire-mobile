import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { socialSharingService } from '../services/socialSharingService';
import { Colors, Typography, Spacing, BorderRadius } from '../styles/theme';

/**
 * Social Share Buttons Component
 */
export const ShareButtons = ({ mappingResult, balance, onShareSuccess }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleTwitterShare = async () => {
    setIsSharing(true);
    try {
      const result = await socialSharingService.shareToTwitter(mappingResult, balance);
      socialSharingService.trackShareEvent('Twitter', mappingResult);
      
      if (onShareSuccess) {
        onShareSuccess(result);
      }

      Alert.alert(
        '🐦 Shared to Twitter!',
        'Thanks for spreading the word!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Share Failed',
        'Could not open Twitter. Try copying the text instead.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const result = await socialSharingService.copyToClipboard(mappingResult, balance);
      
      Alert.alert(
        '✅ Copied!',
        'Share text copied to clipboard',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleNativeShare = async () => {
    setIsSharing(true);
    try {
      const result = await socialSharingService.shareNative(mappingResult, balance);
      socialSharingService.trackShareEvent('Native', mappingResult);
      
      if (onShareSuccess) {
        onShareSuccess(result);
      }
    } catch (error) {
      console.log('Share cancelled or failed');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📤 Share Your Territory</Text>

      {/* Twitter Share */}
      <TouchableOpacity
        style={[styles.button, styles.twitterButton]}
        onPress={handleTwitterShare}
        disabled={isSharing}
      >
        <Text style={styles.buttonIcon}>🐦</Text>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonTitle}>Share on X (Twitter)</Text>
          <Text style={styles.buttonSubtitle}>Instant post with hashtags</Text>
        </View>
      </TouchableOpacity>

      {/* Native Share */}
      <TouchableOpacity
        style={[styles.button, styles.nativeButton]}
        onPress={handleNativeShare}
        disabled={isSharing}
      >
        <Text style={styles.buttonIcon}>📱</Text>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonTitle}>Share via...</Text>
          <Text style={styles.buttonSubtitle}>WhatsApp, Instagram, etc.</Text>
        </View>
      </TouchableOpacity>

      {/* Copy to Clipboard */}
      <TouchableOpacity
        style={[styles.button, styles.copyButton]}
        onPress={handleCopyToClipboard}
      >
        <Text style={styles.buttonIcon}>📋</Text>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonTitle}>Copy Text</Text>
          <Text style={styles.buttonSubtitle}>Paste anywhere</Text>
        </View>
      </TouchableOpacity>

      {/* Hashtags Preview */}
      <View style={styles.hashtagsContainer}>
        <Text style={styles.hashtagsTitle}>Suggested hashtags:</Text>
        <Text style={styles.hashtags}>
          #Solionaire #Solana #CryptoRealEstate #Web3 #NFT #MONOLITH
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.white,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  twitterButton: {
    backgroundColor: Colors.twitter,
  },
  nativeButton: {
    backgroundColor: '#25D366', // WhatsApp green
  },
  copyButton: {
    backgroundColor: Colors.mediumGray,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  buttonIcon: {
    fontSize: 28,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.white,
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: Typography.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  hashtagsContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.base,
    backgroundColor: Colors.mediumGray,
    borderRadius: BorderRadius.md,
  },
  hashtagsTitle: {
    fontSize: Typography.sm,
    color: Colors.lightGray,
    marginBottom: Spacing.xs,
  },
  hashtags: {
    fontSize: Typography.sm,
    color: Colors.gold,
    lineHeight: Typography.relaxed * Typography.sm,
  },
});

export default ShareButtons;
