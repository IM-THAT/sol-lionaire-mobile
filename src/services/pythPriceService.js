/**
 * Price Data Service - Sol-lionaire
 *
 * SOL/USD + 24h change%: CoinGecko simple/price (no key, real-time)
 * Sparkline (24h hourly):  CoinGecko market_chart (no key, ~24 points)
 * Fallback: last cached value → 0 / [] (shows "---" / no chart)
 */

const COINGECKO_PRICE_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true';

// 24-hour hourly chart — gives ~24 price points for the sparkline
const COINGECKO_CHART_URL =
  'https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=1';

class PriceDataService {
  constructor() {
    this.cache = {
      solPrice:         0,
      solChange24h:     0,
      solSparkline:     [],
      lastPriceUpdate:  0,
      lastChartUpdate:  0,
    };
    this.PRICE_CACHE     = 30_000;       // 30 seconds
    this.SPARKLINE_CACHE = 5 * 60_000;   // 5 minutes (chart data is slower-moving)
  }

  async fetchSolPrice() {
    const now = Date.now();
    if (this.cache.solPrice && now - this.cache.lastPriceUpdate < this.PRICE_CACHE) {
      return this.cache.solPrice;
    }

    try {
      const response = await fetch(COINGECKO_PRICE_URL, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`CoinGecko HTTP ${response.status}`);

      const data     = await response.json();
      const price    = data?.solana?.usd;
      const change24 = data?.solana?.usd_24h_change ?? 0;

      if (!price || typeof price !== 'number') {
        throw new Error('Invalid price data from CoinGecko');
      }

      this.cache.solPrice        = price;
      this.cache.solChange24h    = change24;
      this.cache.lastPriceUpdate = now;
      console.log(`💰 SOL $${price} (${change24 >= 0 ? '+' : ''}${change24.toFixed(2)}% 24h)`);
      return price;
    } catch (error) {
      console.error('❌ CoinGecko price fetch failed:', error);
      return this.cache.solPrice || 0;
    }
  }

  // Returns ~12 sampled hourly prices from the last 24h
  async fetchSolSparkline() {
    const now = Date.now();
    if (
      this.cache.solSparkline.length > 0 &&
      now - this.cache.lastChartUpdate < this.SPARKLINE_CACHE
    ) {
      return this.cache.solSparkline;
    }

    try {
      const response = await fetch(COINGECKO_CHART_URL, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) return this.cache.solSparkline;

      const data   = await response.json();
      const all    = (data.prices || []).map(([, p]) => p);
      // Downsample to ~12 points so the line isn't too noisy
      const step   = Math.max(1, Math.floor(all.length / 12));
      const sampled = all.filter((_, i) => i % step === 0);

      this.cache.solSparkline    = sampled;
      this.cache.lastChartUpdate = now;
      return sampled;
    } catch {
      return this.cache.solSparkline;
    }
  }

  async fetchPricePerSqm(cityType) {
    // Real estate benchmarks (premium residential, Q1 2026)
    // Manhattan: ~$23,000/m² (condo avg, Miller Samuel Q4 2025 ×10.764)
    // Dubai: ~$9,000/m² (premium areas avg, 2026)
    const basePrices = {
      MANHATTAN: 23000,
      DUBAI: 9000,
    };
    return basePrices[cityType] ?? 10000;
  }

  async fetchAllPrices(cityType) {
    const [solPrice, pricePerSqm, solSparkline] = await Promise.all([
      this.fetchSolPrice(),
      this.fetchPricePerSqm(cityType),
      this.fetchSolSparkline(),
    ]);
    return {
      solPrice,
      pricePerSqm,
      priceChange24h: this.cache.solChange24h,
      solSparkline,
      timestamp: new Date().toISOString(),
    };
  }
}

export const priceDataService = new PriceDataService();
export default priceDataService;
