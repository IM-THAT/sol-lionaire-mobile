/**
 * Value Calculator - Enhanced for Asset Odyssey
 * Calculates property tiers for past, present, and future
 */

export const CityType = {
  MANHATTAN: 'MANHATTAN',
  DUBAI: 'DUBAI',
};

// Property tiers with USD thresholds
export const PROPERTY_TIERS = [
  {
    id: 'manhole',
    name: 'Iron Manhole Cover',
    shortName: 'Manhole',
    emoji: '🔩',
    minUSD: 0,
    maxUSD: 500,
    description: 'A small but real stake in the city streets.',
    location: { MANHATTAN: '5th Ave, Manhattan', DUBAI: 'Downtown Dubai' },
    rarity: 'Common',
    color: '#9E9E9E',
  },
  {
    id: 'bench',
    name: 'Park Bench',
    shortName: 'Bench',
    emoji: '🪑',
    minUSD: 500,
    maxUSD: 2000,
    description: 'Your own corner of the urban landscape.',
    location: { MANHATTAN: 'Central Park, NYC', DUBAI: 'Jumeirah Beach' },
    rarity: 'Common',
    color: '#8BC34A',
  },
  {
    id: 'parking',
    name: 'Parking Spot',
    shortName: 'Parking',
    emoji: '🅿️',
    minUSD: 2000,
    maxUSD: 10000,
    description: 'Prime real estate in the concrete jungle.',
    location: { MANHATTAN: 'Midtown Manhattan', DUBAI: 'Dubai Marina' },
    rarity: 'Uncommon',
    color: '#2196F3',
  },
  {
    id: 'studio',
    name: 'Studio Apartment',
    shortName: 'Studio',
    emoji: '🏠',
    minUSD: 10000,
    maxUSD: 100000,
    description: 'Your first real foothold in the city.',
    location: { MANHATTAN: 'Lower East Side, NYC', DUBAI: 'JLT, Dubai' },
    rarity: 'Uncommon',
    color: '#2196F3',
  },
  {
    id: 'onebedroom',
    name: 'One Bedroom Apartment',
    shortName: '1 Bedroom',
    emoji: '🏢',
    minUSD: 100000,
    maxUSD: 500000,
    description: 'Established. A proper address in the city.',
    location: { MANHATTAN: 'Upper West Side, NYC', DUBAI: 'Business Bay' },
    rarity: 'Rare',
    color: '#9C27B0',
  },
  {
    id: 'luxury',
    name: 'Luxury Apartment',
    shortName: 'Luxury Apt',
    emoji: '🏙️',
    minUSD: 500000,
    maxUSD: 2000000,
    description: 'The top 1%. A statement of wealth.',
    location: { MANHATTAN: 'Central Park South', DUBAI: 'Palm Jumeirah' },
    rarity: 'Epic',
    color: '#FF9800',
  },
  {
    id: 'penthouse',
    name: 'Penthouse Suite',
    shortName: 'Penthouse',
    emoji: '👑',
    minUSD: 2000000,
    maxUSD: Infinity,
    description: 'Above it all. The pinnacle of urban wealth.',
    location: { MANHATTAN: '432 Park Avenue', DUBAI: 'Burj Khalifa' },
    rarity: 'Legendary',
    color: '#FFD700',
  },
];

// Historical SOL prices (USD) for past simulation
const HISTORICAL_SOL_PRICES = [
  { date: '2024-01', price: 102.5 },
  { date: '2024-02', price: 118.3 },
  { date: '2024-03', price: 189.7 },
  { date: '2024-04', price: 178.2 },
  { date: '2024-05', price: 169.4 },
  { date: '2024-06', price: 145.8 },
  { date: '2024-07', price: 158.2 },
  { date: '2024-08', price: 143.6 },
  { date: '2024-09', price: 152.9 },
  { date: '2024-10', price: 174.3 },
  { date: '2024-11', price: 228.5 },
  { date: '2024-12', price: 196.8 },
  { date: '2025-01', price: 241.2 },
  { date: '2025-02', price: 162.4 },
  { date: '2025-03', price: 135.7 },
  { date: '2025-04', price: 148.9 },
  { date: '2025-05', price: 172.3 },
  { date: '2025-06', price: 158.6 },
  { date: '2025-07', price: 143.2 },
  { date: '2025-08', price: 156.8 },
  { date: '2025-09', price: 168.4 },
  { date: '2025-10', price: 145.9 },
  { date: '2025-11', price: 139.2 },
  { date: '2025-12', price: 152.7 },
  { date: '2026-01', price: 143.8 },
  { date: '2026-02', price: 139.8 },
];

// City price per sqm (USD)
const CITY_PRICES = {
  MANHATTAN: 15000,
  DUBAI: 8500,
};

class ValueCalculator {
  /**
   * Get tier for a given USD value
   */
  getTierForUSD(usdValue) {
    return PROPERTY_TIERS.find(t => usdValue >= t.minUSD && usdValue < t.maxUSD)
      || PROPERTY_TIERS[PROPERTY_TIERS.length - 1];
  }

  /**
   * Main mapping function
   */
  determineMapping({ solAmount, solPrice, cityPricePerSqm, cityType }) {
    const totalUSD = solAmount * solPrice;
    const tier = this.getTierForUSD(totalUSD);

    return {
      type: totalUSD < 500 ? 'MICRO' : 'MACRO',
      totalValue: totalUSD,
      cityType,
      object: {
        name: tier.name,
        location: tier.location[cityType] || tier.location.MANHATTAN,
        description: tier.description,
        rarity: tier.rarity,
        emoji: tier.emoji,
      },
      property: {
        name: tier.name,
        location: tier.location[cityType] || tier.location.MANHATTAN,
        view: tier.description,
        floor: Math.floor(Math.random() * 50) + 1,
        area: Math.floor(totalUSD / (cityPricePerSqm || CITY_PRICES[cityType])),
      },
      tier,
    };
  }

  /**
   * Calculate upgrade info
   */
  calculateUpgrade({ solAmount, solPrice, cityType }) {
    const totalUSD = solAmount * solPrice;
    const currentTier = this.getTierForUSD(totalUSD);
    const currentIndex = PROPERTY_TIERS.indexOf(currentTier);
    const nextTier = PROPERTY_TIERS[currentIndex + 1];

    if (!nextTier) {
      return {
        message: '👑 You own the Penthouse! Maximum tier reached!',
        solNeeded: 0,
        nextTier: null,
        currentTier,
        progress: 100,
      };
    }

    const usdNeeded = nextTier.minUSD - totalUSD;
    const solNeeded = usdNeeded / solPrice;
    const progress = ((totalUSD - currentTier.minUSD) / (nextTier.minUSD - currentTier.minUSD)) * 100;

    return {
      message: `${solNeeded.toFixed(2)} SOL more → ${nextTier.shortName}`,
      solNeeded,
      usdNeeded,
      nextTier,
      currentTier,
      progress: Math.min(progress, 99),
    };
  }

  /**
   * Generate Asset Odyssey timeline
   * Shows tier progression over time
   */
  generateOdysseyTimeline({ solAmount, currentSolPrice, cityType, months = 12 }) {
    const timeline = [];

    // Past months
    const recentPrices = HISTORICAL_SOL_PRICES.slice(-months);

    recentPrices.forEach(({ date, price }) => {
      const usdValue = solAmount * price;
      const tier = this.getTierForUSD(usdValue);

      const [year, month] = date.split('-');
      const dateObj = new Date(parseInt(year), parseInt(month) - 1);
      const label = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      timeline.push({
        date,
        label,
        solPrice: price,
        usdValue,
        tier,
        tierIndex: PROPERTY_TIERS.indexOf(tier),
        isPast: true,
        isCurrent: date === '2026-02',
      });
    });

    // Future projections (+20%, +50%, +100%)
    const projections = [
      { multiplier: 1.2, label: '+20%' },
      { multiplier: 1.5, label: '+50%' },
      { multiplier: 2.0, label: '+100%' },
    ];

    projections.forEach(({ multiplier, label }) => {
      const projectedPrice = currentSolPrice * multiplier;
      const usdValue = solAmount * projectedPrice;
      const tier = this.getTierForUSD(usdValue);

      timeline.push({
        date: `future_${label}`,
        label,
        solPrice: projectedPrice,
        usdValue,
        tier,
        tierIndex: PROPERTY_TIERS.indexOf(tier),
        isPast: false,
        isCurrent: false,
        isFuture: true,
      });
    });

    return timeline;
  }
}

export const valueCalculator = new ValueCalculator();
export default valueCalculator;
