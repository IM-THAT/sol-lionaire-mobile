/**
 * Geofencing Service
 * Sol-lionaire v0.3
 * 
 * GPS 위치를 추적하여 사용자가 실제 영토에 방문하면 특수 보상 제공
 */

/**
 * 주요 랜드마크 좌표
 */
export const Landmarks = {
  MANHATTAN: [
    {
      id: 'mh_landmark_1',
      name: '5th Avenue',
      lat: 40.7614,
      lng: -73.9776,
      radius: 100, // 미터
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
      name: '강남역',
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
      name: 'N서울타워',
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
      name: '청담동',
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
 * 두 좌표 간 거리 계산 (Haversine formula)
 * @returns {number} 거리 (미터)
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a = 
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * 
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터
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
   * 위치 추적 시작
   */
  startTracking(onLocationUpdate, onRewardUnlock) {
    if (this.isTracking) {
      console.log('⚠️ Already tracking location');
      return;
    }

    // Geolocation API 사용 (React Native에서는 다른 라이브러리 사용)
    if ('geolocation' in navigator) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          this.currentLocation = { lat: latitude, lng: longitude };
          
          // 콜백 호출
          if (onLocationUpdate) {
            onLocationUpdate(this.currentLocation);
          }

          // 랜드마크 체크
          this.checkLandmarks(this.currentLocation, onRewardUnlock);
        },
        (error) => {
          console.error('위치 추적 에러:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      this.isTracking = true;
      console.log('📍 위치 추적 시작');
    } else {
      console.error('❌ Geolocation not supported');
    }
  }

  /**
   * 위치 추적 중단
   */
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
      console.log('🛑 위치 추적 중단');
    }
  }

  /**
   * 랜드마크 근처인지 체크
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

        // 반경 내에 진입
        if (distance <= landmark.radius) {
          // 이미 획득했는지 체크
          if (!this.hasUnlockedReward(landmark.id)) {
            console.log(`🎉 랜드마크 도착: ${landmark.name}`);
            
            // 보상 해금
            this.unlockReward(landmark);
            
            // 콜백 호출
            if (onRewardUnlock) {
              onRewardUnlock(landmark);
            }
          }
        }
      });
    });
  }

  /**
   * 보상 해금
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
      console.log('🏆 보상 해금:', landmark.reward);

      // 푸시 알림 (웹에서는 Notification API 사용)
      this.sendNotification(landmark);
    } catch (error) {
      console.error('보상 저장 실패:', error);
    }
  }

  /**
   * 보상 획득 여부 확인
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
   * 푸시 알림 전송
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
   * 알림 권한 요청
   */
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  /**
   * 획득한 보상 목록 조회
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
