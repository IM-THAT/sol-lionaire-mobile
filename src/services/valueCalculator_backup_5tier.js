/**
 * Value Calculator - Sol-lionaire v0.4
 * 5-Tier System with Manhattan vs Dubai differential
 */

export const CityType = {
  MANHATTAN: 'MANHATTAN',
  DUBAI: 'DUBAI',
};

// Real estate price data (Benchmark as of Feb 2024)
export const CITY_CONFIG = {
  MANHATTAN: {
    pricePerSqm: 22000,
    currency: 'USD',
    lastUpdated: '2024-02',
    source: 'Manhattan Market Report',
    label: 'New York',
    emoji: '🗽',
    tone: 'cold',
  },
  DUBAI: {
    pricePerSqm: 7500,
    currency: 'USD',
    lastUpdated: '2024-02',
    source: 'Dubai Land Department (DLD)',
    label: 'Dubai',
    emoji: '🏙️',
    tone: 'warm',
  },
};












    tone: 'warm',
  },
};

// 5-Tier Property System
export const PROPERTY_TIERS = [
  {
    id: 'common',
    rarity: 'Common',
    color: '#9E9E9E',
    minUSD: 0,
    maxUSD: 2000,
    names: {
      MANHATTAN: 'Rusty Manhole',
      DUBAI: 'Sandstorm Studio',
    },
    locations: {
      MANHATTAN: 'Lower Manhattan, NYC',
      DUBAI: 'Desert Outskirts, Dubai',
    },
    narratives: {
      MANHATTAN: 'Every great empire began beneath the surface. Your foundation is now set.',
      DUBAI: 'The desert holds the seeds of fortune. Your journey begins here.',
    },
    imageKey: {
      MANHATTAN: 'ny_common',
      DUBAI: 'db_common',
    },
  },
  {
    id: 'uncommon',
    rarity: 'Uncommon',
    color: '#4CAF50',
    minUSD: 2000,
    maxUSD: 20000,
    names: {
      MANHATTAN: 'Walk-up Studio',
      DUBAI: 'Marina Bay 1-Bedroom',
    },
    locations: {
      MANHATTAN: 'Brooklyn, New York',
      DUBAI: 'Dubai Marina',
    },
    narratives: {
      MANHATTAN: 'Ascending from the depths. The vision of the skyline starts to take shape.',
      DUBAI: 'The emerald waters of the Marina await. Sophistication is within reach.',
    },
    imageKey: {
      MANHATTAN: 'ny_uncommon',
      DUBAI: 'db_uncommon',
    },
  },
  {
    id: 'rare',
    rarity: 'Rare',
    color: '#2196F3',
    minUSD: 20000,
    maxUSD: 200000,
    names: {
      MANHATTAN: 'Chelsea 1-Bedroom',
      DUBAI: 'High-floor 3-Bedroom',
    },
    locations: {
      MANHATTAN: 'Chelsea, Manhattan',
      DUBAI: 'Downtown Dubai',
    },
    narratives: {
      MANHATTAN: 'A space of your own in the digital metropolis. The journey to the top has officially begun.',
      DUBAI: 'Luxury is becoming your standard. The city lights reflect your growing influence.',
    },
    imageKey: {
      MANHATTAN: 'ny_rare',
      DUBAI: 'db_rare',
    },
  },
  {
    id: 'epic',
    rarity: 'Epic',
    color: '#9C27B0',
    minUSD: 200000,
    maxUSD: 10000000,
    names: {
      MANHATTAN: '5th Ave High-rise',
      DUBAI: 'Palm Jumeirah Villa',
    },
    locations: {
      MANHATTAN: '5th Avenue, Manhattan',
      DUBAI: 'Palm Jumeirah, Dubai',
    },
    narratives: {
      MANHATTAN: "The view is changing. You're no longer just observing the market — you're occupying it.",
      DUBAI: 'Your private beach awaits. The world looks different from the Palm.',
    },
    imageKey: {
      MANHATTAN: 'ny_epic',
      DUBAI: 'db_epic',
    },
  },
  {
    id: 'legendary',
    rarity: 'Legendary',
    color: '#FFD700',
    minUSD: 10000000,
    maxUSD: Infinity,
    names: {
      MANHATTAN: "Billionaires' Row Penthouse",
      DUBAI: 'Royal Atlantis Mansion',
    },
    locations: {
      MANHATTAN: '432 Park Avenue, NYC',
      DUBAI: 'Royal Atlantis, Palm',
    },
    narratives: {
      MANHATTAN: "You don't just live in the city. You look down upon it.",
      DUBAI: 'Ultimate sovereignty. You have redefined the meaning of a Sol-lionaire.',
    },
    imageKey: {
      MANHATTAN: 'ny_legendary',
      DUBAI: 'db_legendary',
    },
  },
];

// Historical SOL prices
const HISTORICAL_SOL_PRICES = [
  { date: '2024-01', price: 102.5 },
  { date: '2024-04', price: 178.2 },
  { date: '2024-07', price: 158.2 },
  { date: '2024-10', price: 174.3 },
  { date: '2025-01', price: 241.2 },
  { date: '2025-04', price: 148.9 },
  { date: '2025-07', price: 143.2 },
  { date: '2025-10', price: 145.9 },
  { date: '2026-01', price: 143.8 },
  { date: '2026-02', price: 139.8 },
];

class ValueCalculator {
  getTierForUSD(usdValue) {
    return (
      PROPERTY_TIERS.find(t => usdValue >= t.minUSD && usdValue < t.maxUSD) ||
      PROPERTY_TIERS[PROPERTY_TIERS.length - 1]
    );
  }

  determineMapping({ solAmount, solPrice, cityType = 'MANHATTAN' }) {
    const totalUSD = solAmount * solPrice;
    const tier = this.getTierForUSD(totalUSD);
    const city = CITY_CONFIG[cityType];

    return {
      totalValue: totalUSD,
      cityType,
      tier,
      propertyName: tier.names[cityType],
      location: tier.locations[cityType],
      narrative: tier.narratives[cityType],
      imageKey: tier.imageKey[cityType],
      sqm: Math.floor(totalUSD / city.pricePerSqm),
    };
  }

  calculateUpgrade({ solAmount, solPrice, cityType = 'MANHATTAN' }) {
    const totalUSD = solAmount * solPrice;
    const currentTier = this.getTierForUSD(totalUSD);
    const currentIndex = PROPERTY_TIERS.indexOf(currentTier);
    const nextTier = PROPERTY_TIERS[currentIndex + 1];

    if (!nextTier) {
      return {
        message: '👑 Ultimate tier reached.',
        solNeeded: 0,
        nextTier: null,
        currentTier,
        progress: 100,
      };
    }

    const usdNeeded = nextTier.minUSD - totalUSD;
    const solNeeded = usdNeeded / solPrice;
    const progress =
      ((totalUSD - currentTier.minUSD) /
        (nextTier.minUSD - currentTier.minUSD)) *
      100;

    return {
      solNeeded,
      usdNeeded,
      nextTier,
      currentTier,
      progress: Math.min(Math.max(progress, 0), 99),
    };
  }

  generateOdysseyTimeline({ solAmount, currentSolPrice, cityType = 'MANHATTAN' }) {
    return HISTORICAL_SOL_PRICES.map(({ date, price }) => {
      const usdValue = solAmount * price;
      const tier = this.getTierForUSD(usdValue);
      const [year, month] = date.split('-');
      const q = Math.ceil(parseInt(month) / 3);
      const isQuarterStart = parseInt(month) % 3 === 1;
      const label = isQuarterStart ? `Q${q}'${year.slice(2)}` : '';

      return {
        date,
        label,
        solPrice: price,
        usdValue,
        tier,
        tierIndex: PROPERTY_TIERS.indexOf(tier),
        isCurrent: date === '2026-02',
      };
    });
  }

  // Global Benchmarking (시뮬레이션)
  getPercentile(usdValue) {
    if (usdValue >= 10000000) return 0.1;
    if (usdValue >= 200000)   return 5;
    if (usdValue >= 20000)    return 15;
    if (usdValue >= 2000)     return 40;
    return 70;
  }
}

export const valueCalculator = new ValueCalculator();
export default valueCalculator;
