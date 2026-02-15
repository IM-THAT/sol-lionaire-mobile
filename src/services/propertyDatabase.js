/**
 * 확장된 부동산 데이터베이스
 * Sol-lionaire v0.3
 * 
 * - 4개 도시 지원: Manhattan, Dubai, Seoul, Tokyo
 * - Micro/Macro 전체 범위 커버
 */

export const CityType = {
  MANHATTAN: 'MANHATTAN',
  DUBAI: 'DUBAI',
  SEOUL: 'SEOUL',
  TOKYO: 'TOKYO',
};

/**
 * Micro Objects Database
 * 가격대별 공공기물 데이터
 */
export const MicroObjects = {
  MANHATTAN: [
    {
      id: 'mh_micro_1',
      name: 'Street Gum Spot',
      location: 'Times Square, Manhattan',
      description: 'NYC Sidewalk Shareholder',
      minValue: 50,
      maxValue: 150,
      rarity: 'Common',
      imageUrl: '/assets/gum.png',
    },
    {
      id: 'mh_micro_2',
      name: 'Iron Manhole Cover',
      location: '5th Ave, Manhattan',
      description: 'NYC Street Shareholder',
      minValue: 150,
      maxValue: 500,
      rarity: 'Uncommon',
      imageUrl: '/assets/manhole.png',
    },
    {
      id: 'mh_micro_3',
      name: 'Park Bench',
      location: 'Central Park, Manhattan',
      description: 'Central Park Member',
      minValue: 500,
      maxValue: 1500,
      rarity: 'Rare',
      imageUrl: '/assets/bench.png',
    },
    {
      id: 'mh_micro_4',
      name: 'Hot Dog Stand Space',
      location: 'Brooklyn Bridge, Manhattan',
      description: 'Street Food Royalty',
      minValue: 1500,
      maxValue: 5000,
      rarity: 'Epic',
      imageUrl: '/assets/hotdog.png',
    },
  ],
  
  DUBAI: [
    {
      id: 'db_micro_1',
      name: 'Desert Sand (1kg)',
      location: 'Dubai Desert',
      description: 'Desert Owner',
      minValue: 50,
      maxValue: 150,
      rarity: 'Common',
      imageUrl: '/assets/sand.png',
    },
    {
      id: 'db_micro_2',
      name: 'Marina Lamp Post',
      location: 'Dubai Marina Walk',
      description: 'Marina Light Owner',
      minValue: 150,
      maxValue: 500,
      rarity: 'Uncommon',
      imageUrl: '/assets/lamp.png',
    },
    {
      id: 'db_micro_3',
      name: 'Gold Souk Counter',
      location: 'Gold Souk, Dubai',
      description: 'Gold District Member',
      minValue: 500,
      maxValue: 2000,
      rarity: 'Rare',
      imageUrl: '/assets/counter.png',
    },
    {
      id: 'db_micro_4',
      name: 'Burj Khalifa Window',
      location: 'Burj Khalifa, Dubai',
      description: 'Sky High Owner',
      minValue: 2000,
      maxValue: 8000,
      rarity: 'Epic',
      imageUrl: '/assets/window.png',
    },
  ],

  SEOUL: [
    {
      id: 'sl_micro_1',
      name: '편의점 앞 의자',
      location: '강남역, 서울',
      description: 'Gangnam Loiterer',
      minValue: 50,
      maxValue: 200,
      rarity: 'Common',
      imageUrl: '/assets/convenience_chair.png',
    },
    {
      id: 'sl_micro_2',
      name: '청담 가로수',
      location: '청담동, 서울',
      description: 'Luxury Street Member',
      minValue: 200,
      maxValue: 800,
      rarity: 'Uncommon',
      imageUrl: '/assets/tree.png',
    },
    {
      id: 'sl_micro_3',
      name: '한강 벤치',
      location: '반포한강공원, 서울',
      description: 'Han River VIP',
      minValue: 800,
      maxValue: 2500,
      rarity: 'Rare',
      imageUrl: '/assets/han_bench.png',
    },
    {
      id: 'sl_micro_4',
      name: 'N서울타워 계단 1칸',
      location: 'N서울타워, 서울',
      description: 'Tower Step Owner',
      minValue: 2500,
      maxValue: 6000,
      rarity: 'Epic',
      imageUrl: '/assets/tower_step.png',
    },
  ],

  TOKYO: [
    {
      id: 'tk_micro_1',
      name: 'Vending Machine Slot',
      location: 'Shibuya, Tokyo',
      description: 'Shibuya Resident',
      minValue: 50,
      maxValue: 200,
      rarity: 'Common',
      imageUrl: '/assets/vending.png',
    },
    {
      id: 'tk_micro_2',
      name: '銀座 Street Tile',
      location: 'Ginza, Tokyo',
      description: 'Ginza Landlord',
      minValue: 200,
      maxValue: 1000,
      rarity: 'Uncommon',
      imageUrl: '/assets/ginza_tile.png',
    },
    {
      id: 'tk_micro_3',
      name: 'Harajuku Bench',
      location: 'Harajuku, Tokyo',
      description: 'Fashion District Member',
      minValue: 1000,
      maxValue: 3000,
      rarity: 'Rare',
      imageUrl: '/assets/harajuku_bench.png',
    },
    {
      id: 'tk_micro_4',
      name: 'Tokyo Tower Light Bulb',
      location: 'Tokyo Tower, Tokyo',
      description: 'Tower Illuminator',
      minValue: 3000,
      maxValue: 7000,
      rarity: 'Epic',
      imageUrl: '/assets/tower_bulb.png',
    },
  ],
};

/**
 * Properties Database (Macro)
 * 실제 부동산 매물 데이터
 */
export const Properties = {
  MANHATTAN: [
    {
      id: 'mh_prop_1',
      name: 'Studio Apartment',
      location: 'Harlem, Manhattan',
      price: 400000,
      area: 35,
      floor: 4,
      view: 'Street View',
      type: 'Studio',
      imageUrl: '/assets/mh_studio.jpg',
    },
    {
      id: 'mh_prop_2',
      name: '1 Bedroom Apartment',
      location: 'Upper East Side, Manhattan',
      price: 850000,
      area: 65,
      floor: 12,
      view: 'Central Park View',
      type: '1BR',
      imageUrl: '/assets/mh_1br.jpg',
    },
    {
      id: 'mh_prop_3',
      name: '2 Bedroom Luxury',
      location: 'Tribeca, Manhattan',
      price: 2500000,
      area: 120,
      floor: 25,
      view: 'Hudson River View',
      type: '2BR',
      imageUrl: '/assets/mh_2br.jpg',
    },
    {
      id: 'mh_prop_4',
      name: 'Penthouse',
      location: '5th Ave, Manhattan',
      price: 8000000,
      area: 280,
      floor: 42,
      view: 'Empire State Building View',
      type: 'Penthouse',
      imageUrl: '/assets/mh_penthouse.jpg',
    },
  ],

  DUBAI: [
    {
      id: 'db_prop_1',
      name: 'Studio Apartment',
      location: 'Dubai Sports City',
      price: 350000,
      area: 40,
      floor: 8,
      view: 'Pool View',
      type: 'Studio',
      imageUrl: '/assets/db_studio.jpg',
    },
    {
      id: 'db_prop_2',
      name: '1 Bedroom Apartment',
      location: 'Marina Gate, Dubai',
      price: 900000,
      area: 80,
      floor: 24,
      view: 'Marina Yacht View',
      type: '1BR',
      imageUrl: '/assets/db_1br.jpg',
    },
    {
      id: 'db_prop_3',
      name: '2 Bedroom Luxury',
      location: 'Palm Jumeirah, Dubai',
      price: 3500000,
      area: 150,
      floor: 35,
      view: 'Palm Island View',
      type: '2BR',
      imageUrl: '/assets/db_2br.jpg',
    },
    {
      id: 'db_prop_4',
      name: 'Penthouse',
      location: 'Burj Khalifa Area, Dubai',
      price: 10000000,
      area: 400,
      floor: 65,
      view: 'Burj Khalifa View',
      type: 'Penthouse',
      imageUrl: '/assets/db_penthouse.jpg',
    },
  ],

  SEOUL: [
    {
      id: 'sl_prop_1',
      name: '원룸 (Studio)',
      location: '신림동, 서울',
      price: 200000,
      area: 20,
      floor: 3,
      view: '골목 뷰',
      type: 'Studio',
      imageUrl: '/assets/sl_studio.jpg',
    },
    {
      id: 'sl_prop_2',
      name: '강남 오피스텔',
      location: '역삼동, 서울',
      price: 600000,
      area: 45,
      floor: 15,
      view: '테헤란로 뷰',
      type: '1BR',
      imageUrl: '/assets/sl_officetel.jpg',
    },
    {
      id: 'sl_prop_3',
      name: '압구정 아파트',
      location: '압구정 현대아파트, 서울',
      price: 2000000,
      area: 85,
      floor: 20,
      view: '한강 뷰',
      type: '2BR',
      imageUrl: '/assets/sl_apt.jpg',
    },
    {
      id: 'sl_prop_4',
      name: '청담 펜트하우스',
      location: '청담동 타워팰리스, 서울',
      price: 12000000,
      area: 300,
      floor: 68,
      view: '서울 스카이라인 뷰',
      type: 'Penthouse',
      imageUrl: '/assets/sl_penthouse.jpg',
    },
  ],

  TOKYO: [
    {
      id: 'tk_prop_1',
      name: 'ワンルーム (Studio)',
      location: 'Nakano, Tokyo',
      price: 250000,
      area: 25,
      floor: 5,
      view: 'City View',
      type: 'Studio',
      imageUrl: '/assets/tk_studio.jpg',
    },
    {
      id: 'tk_prop_2',
      name: '1LDK Apartment',
      location: 'Shibuya, Tokyo',
      price: 800000,
      area: 55,
      floor: 18,
      view: 'Shibuya Crossing View',
      type: '1BR',
      imageUrl: '/assets/tk_1ldk.jpg',
    },
    {
      id: 'tk_prop_3',
      name: '銀座 Luxury Apt',
      location: 'Ginza, Tokyo',
      price: 3000000,
      area: 100,
      floor: 28,
      view: 'Imperial Palace View',
      type: '2BR',
      imageUrl: '/assets/tk_ginza.jpg',
    },
    {
      id: 'tk_prop_4',
      name: 'Roppongi Penthouse',
      location: 'Roppongi Hills, Tokyo',
      price: 15000000,
      area: 350,
      floor: 52,
      view: 'Mt. Fuji View',
      type: 'Penthouse',
      imageUrl: '/assets/tk_penthouse.jpg',
    },
  ],
};

/**
 * 도시별 m² 단가 (Mock)
 */
export const PricesPerSqm = {
  MANHATTAN: 15000,
  DUBAI: 10000,
  SEOUL: 8000,
  TOKYO: 12000,
};

/**
 * Rarity 레벨별 색상
 */
export const RarityColors = {
  Common: '#9E9E9E',
  Uncommon: '#4CAF50',
  Rare: '#2196F3',
  Epic: '#9C27B0',
  Legendary: '#FFD700',
};

export default {
  CityType,
  MicroObjects,
  Properties,
  PricesPerSqm,
  RarityColors,
};
