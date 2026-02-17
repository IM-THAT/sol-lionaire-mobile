/**
 * Geofencing Service
 * Sol-lionaire v0.3
 * * Tracks GPS location and provides special rewards when users visit physical territories.
 */

/**
 * Major landmark coordinates
 */
import Geolocation from '@react-native-community/geolocation';
export const Landmarks = {
  MANHATTAN: [
    {
      id: 'mh_landmark_1',
      name: '5th Avenue',
      lat: 40.7614,
      lng: -73.9776,
      radius: 100, // meter
      reward: {
        type: 'SKIN',
        item: 'Gold Manhole',
        rarity: 'Epic',
      },
    },
    {
      id: 'mh_landmark_2',
      name: 'Central Park',
      lat: 40.7829,
      lng: -73.9654,
      radius: 200,
      reward: {
        type: 'SKIN',
        item: 'Platinum Bench',
        rarity: 'Legendary',
      },
    },
    {
      id: 'mh_landmark_3',
      name: 'Empire State Building',
      lat: 40.7484,
      lng: -73.9857,
      radius: 50,
      reward: {
        type: 'BADGE',
        item: 'Empire Visitor',
        rarity: 'Rare',
      },
    },
  ],

  DUBAI: [
    {
      id: 'db_landmark_1',
      name: 'Dubai Marina',
      lat: 25.0805,
      lng: 55.1398,
      radius: 150,
      reward: {
        type: 'SKIN',
        item: 'Golden Yacht',
        rarity: 'Epic',
      },
    },
    {
      id: 'db_landmark_2',
      name: 'Burj Khalifa',
      lat: 25.1972,
      lng: 55.2744,
      radius: 100,
      reward: {
        type: 'BADGE',
        item: 'Sky High Champion',
        rarity: 'Legendary',
      },
    },
    {
      id: 'db_landmark_3',
      name: 'Palm Jumeirah',
      lat: 25.1124,
      lng: 55.1390,
      radius: 200,
      reward: {
        type: 'SKIN',
        item: 'Palm Owner',
        rarity: 'Epic',
      },
    },
  ],

  SEOUL: [
    {
      id: 'sl_landmark_1',
      name: 'Gangnam Station',
      lat: 37.4979,
      lng: 127.0276,
      radius: 100,
      reward: {
        type: 'SKIN',
        item: 'Gangnam Style Chair',
        rarity: 'Rare',
      },
    },
    {
      id: 'sl_landmark_2',
      name: 'N Seoul Tower',
      lat: 37.5512,
      lng: 126.9882,
      radius: 80,
      reward: {
        type: 'BADGE',
        item: 'Tower Climber',
        rarity: 'Epic',
      },
    },
    {
      id: 'sl_landmark_3',
      name: 'Cheongdam-dong',
      lat: 37.5247,
      lng: 127.0495,
      radius: 120,
      reward: {
        type: 'SKIN',
        item: 'Luxury District',
        rarity: 'Legendary',
      },
    },
  ],

  TOKYO: [
    {
      id: 'tk_landmark_1',
      name: 'Shibuya Crossing',
      lat: 35.6595,
      lng: 139.7004,
      radius: 80,
      reward: {
        type: 'SKIN',
        item: 'Crossing Master',
        rarity: 'Rare',
      },
    },
    {
      id: 'tk_landmark_2',
      name: 'Tokyo Tower',
      lat: 35.6586,
      lng: 139.7454,
      radius: 100,
      reward: {
        type: 'BADGE',
        item: 'Tower Guardian',
        rarity: 'Epic',
      },
    },
    {
      id: 'tk_landmark_3',
      name: 'Ginza',
      lat: 35.6717,
      lng: 139.7651,
      radius: 150,
      reward: {
        type: 'SKIN',
        item: 'Ginza Elite',
        rarity: 'Legendary',
      },
    },
  ],
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @returns {number} distance (meters)
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // Earth radius (meters)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a = 
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // meters
};

/**
 * Geofencing Service
 */
class GeofencingService {
  constructor() {
    this.currentLocation = null;
    this.watchId = null;
    this.isTracking = false;
  }

  /**
   * Start location tracking
   */
  startTracking(onLocationUpdate, onRewardUnlock) {
    if (this.isTracking) {
      console.log('⚠️ Already tracking location');
      return;
    }

    // Use React Native Geolocation
      this.watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          this.currentLocation = { lat: latitude, lng: longitude };
          
          // Call callback
          if (onLocationUpdate) {
            onLocationUpdate(this.currentLocation);
          }

          // Check landmarks
          this.checkLandmarks(this.currentLocation, onRewardUnlock);
        },
        (error) => {
          console.error('Location tracking error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      this.isTracking = true;
      console.log('📍 Location tracking started');
    
  }

  /**
   * Stop location tracking
   */
  stopTracking() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
      console.log('🛑 Location tracking stopped');
    }
  }

  /**
   * Check if user is near any landmarks
   */
  checkLandmarks(currentLocation, onRewardUnlock) {
    Object.keys(Landmarks).forEach(cityKey => {
      Landmarks[cityKey].forEach(landmark => {
        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          landmark.lat,
          landmark.lng
        );

        // Entered within radius
        if (distance <= landmark.radius) {
          // Check if already unlocked
          if (!this.hasUnlockedReward(landmark.id)) {
            console.log(`🎉 Arrived at landmark: ${landmark.name}`);
            
            // Unlock reward
            this.unlockReward(landmark);
            
            // Call callback
            if (onRewardUnlock) {
              onRewardUnlock(landmark);
            }
          }
        }
      });
    });
  }

  /**
   * Unlock reward
   */
  unlockReward(landmark) {
    try {
      const key = 'unlocked_rewards';
      const existing = localStorage.getItem(key);
      const rewards = existing ? JSON.parse(existing) : [];
      
      rewards.push({
        landmarkId: landmark.id,
        landmarkName: landmark.name,
        reward: landmark.reward,
        unlockedAt: new Date().toISOString(),
      });
      
      localStorage.setItem(key, JSON.stringify(rewards));
      console.log('🏆 Reward unlocked:', landmark.reward);

      // Push notification (Use Notification API on web)
      this.sendNotification(landmark);
    } catch (error) {
      console.error('Failed to save reward:', error);
    }
  }

  /**
   * Check if reward is already unlocked
   */
  hasUnlockedReward(landmarkId) {
    try {
      const key = 'unlocked_rewards';
      const existing = localStorage.getItem(key);
      if (!existing) return false;
      
      const rewards = JSON.parse(existing);
      return rewards.some(r => r.landmarkId === landmarkId);
    } catch {
      return false;
    }
  }

  /**
   * Send push notification
   */
  sendNotification(landmark) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Sol-lionaire', {
        body: `You're at ${landmark.name}! ${landmark.reward.item} unlocked!`,
        icon: '/assets/logo.png',
      });
    }
  }

  /**
   * Request notification permission
   */
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  /**
   * Retrieve the list of unlocked rewards
   */
  getUnlockedRewards() {
    try {
      const key = 'unlocked_rewards';
      const existing = localStorage.getItem(key);
      return existing ? JSON.parse(existing) : [];
    } catch {
      return [];
    }
  }
}

// Singleton
export const geofencingService = new GeofencingService();

export default geofencingService;