/**
 * Social Sharing Service
 * Sol-lionaire Final Version
 * 
 * Handles sharing to Twitter, Instagram with deep links
 */

import { Linking, Platform } from 'react-native';

/**
 * Generate share text for social media
 */
const generateShareText = (mappingResult, balance) => {
  const { type, totalValue, object, property, cityType } = mappingResult;
  const isMicro = type === 'MICRO';
  const item = isMicro ? object : property;

  const baseText = isMicro
    ? `I own a ${item.name} in ${cityType}!`
    : `I own ${item.name} in ${cityType}!`;

  const value = `Worth $${totalValue.toLocaleString()}`;
  const cryptoValue = `(${balance.toFixed(2)} SOL)`;

  return `${baseText} ${value} ${cryptoValue}

Check your crypto real estate:`;
};

/**
 * Generate hashtags
 */
const generateHashtags = () => {
  return [
    'Solionaire',
    'Solana',
    'CryptoRealEstate',
    'Web3',
    'NFT',
    'MONOLITH',
  ];
};

/**
 * Social Sharing Service
 */
class SocialSharingService {
  constructor() {
    this.appUrl = 'https://solionaire.app';
    this.appStoreUrl = 'https://apps.apple.com/app/solionaire';
    this.playStoreUrl = 'https://play.google.com/store/apps/details?id=com.solionaire';
  }

  /**
   * Share to Twitter (X)
   */
  async shareToTwitter(mappingResult, balance) {
    try {
      const text = generateShareText(mappingResult, balance);
      const hashtags = generateHashtags().join(',');
      const url = this.appUrl;

      // Twitter share URL
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;

      // Try to open Twitter app first, fallback to web
      const twitterAppUrl = `twitter://post?message=${encodeURIComponent(text + ' ' + url)}`;

      const canOpenApp = await Linking.canOpenURL(twitterAppUrl);

      if (canOpenApp) {
        await Linking.openURL(twitterAppUrl);
      } else {
        await Linking.openURL(twitterUrl);
      }

      return { success: true, platform: 'Twitter' };
    } catch (error) {
      console.error('Twitter share failed:', error);
      throw error;
    }
  }

  /**
   * Share to Instagram Stories
   * Note: Instagram Stories sharing requires special setup
   */
  async shareToInstagram(imageUri) {
    try {
      // Instagram Stories API (requires Facebook SDK setup)
      const instagramUrl = `instagram://story-camera`;

      const canOpen = await Linking.canOpenURL(instagramUrl);

      if (canOpen) {
        await Linking.openURL(instagramUrl);
        return { success: true, platform: 'Instagram' };
      } else {
        throw new Error('Instagram app not installed');
      }
    } catch (error) {
      console.error('Instagram share failed:', error);
      throw error;
    }
  }

  /**
   * Generate referral link with tracking
   */
  generateReferralLink(userId) {
    return `${this.appUrl}?ref=${userId}`;
  }

  /**
   * Copy share text to clipboard
   */
  async copyToClipboard(mappingResult, balance) {
    try {
      const text = generateShareText(mappingResult, balance);
      const hashtags = generateHashtags().map(h => `#${h}`).join(' ');
      const fullText = `${text}\n${this.appUrl}\n\n${hashtags}`;

      // Use Clipboard API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullText);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = fullText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      return { success: true, text: fullText };
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      throw error;
    }
  }

  /**
   * Share via native share sheet (mobile)
   */
  async shareNative(mappingResult, balance, imageUri = null) {
    try {
      const text = generateShareText(mappingResult, balance);
      const url = this.appUrl;

      if (Platform.OS === 'web') {
        // Web Share API
        if (navigator.share) {
          await navigator.share({
            title: 'Sol-lionaire',
            text: text,
            url: url,
          });
          return { success: true, platform: 'Native Share' };
        } else {
          // Fallback to copy
          return await this.copyToClipboard(mappingResult, balance);
        }
      } else {
        // React Native Share
        const Share = require('react-native').Share;
        await Share.share({
          message: `${text}\n${url}`,
          url: imageUri || url,
        });
        return { success: true, platform: 'Native Share' };
      }
    } catch (error) {
      console.error('Native share failed:', error);
      throw error;
    }
  }

  /**
   * Track share event (analytics)
   */
  trackShareEvent(platform, mappingResult) {
    // TODO: Integrate with analytics (Mixpanel, Amplitude, etc.)
    console.log('📊 Share Event:', {
      platform,
      territoryType: mappingResult.type,
      value: mappingResult.totalValue,
      timestamp: new Date().toISOString(),
    });
  }
}

// Singleton
export const socialSharingService = new SocialSharingService();

export default socialSharingService;
