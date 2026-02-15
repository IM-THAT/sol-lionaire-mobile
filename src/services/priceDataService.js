/**
 * 가격 데이터 서비스
 * - SOL 가격: Pyth Network (실시간)
 * - 부동산 가격: Mock 데이터 (추후 Zillow/Property Finder API 연동)
 */

import axios from 'axios';

/**
 * SOL 가격 조회 서비스
 * TODO: 실제 Pyth Network API 연동
 */
class PriceDataService {
  constructor() {
    // Mock 가격 (개발용)
    this.mockSolPrice = 150; // $150
    this.mockPricesPerSqm = {
      MANHATTAN: 15000, // $15,000/m²
      DUBAI: 10000,     // $10,000/m²
    };
  }

  /**
   * 현재 SOL 가격 조회 (USD)
   * @returns {Promise<number>} SOL 가격
   */
  async fetchSolPrice() {
    try {
      // TODO: Pyth Network API 연동
      // const response = await axios.get('https://hermes.pyth.network/api/...');
      
      // 현재는 Mock 데이터 반환
      // 실제 변동 시뮬레이션 (±5% 랜덤)
      const variance = (Math.random() - 0.5) * 0.1; // -5% ~ +5%
      const simulatedPrice = this.mockSolPrice * (1 + variance);
      
      return Math.round(simulatedPrice * 100) / 100; // 소수점 2자리
    } catch (error) {
      console.error('SOL 가격 조회 실패:', error);
      return this.mockSolPrice;
    }
  }

  /**
   * 도시별 m² 당 가격 조회 (USD)
   * @param {string} cityType - 'MANHATTAN' | 'DUBAI'
   * @returns {Promise<number>} m² 당 가격
   */
  async fetchPricePerSqm(cityType) {
    try {
      // TODO: Zillow API (Manhattan) / Property Finder API (Dubai) 연동
      
      // 현재는 Mock 데이터 반환
      const basePrice = this.mockPricesPerSqm[cityType] || 10000;
      
      // 일간 변동 시뮬레이션 (±2%)
      const variance = (Math.random() - 0.5) * 0.04;
      const simulatedPrice = basePrice * (1 + variance);
      
      return Math.round(simulatedPrice);
    } catch (error) {
      console.error(`${cityType} 부동산 가격 조회 실패:`, error);
      return this.mockPricesPerSqm[cityType] || 10000;
    }
  }

  /**
   * 전체 가격 데이터 조회
   * @param {string} cityType
   * @returns {Promise<Object>}
   */
  async fetchAllPrices(cityType = 'MANHATTAN') {
    const [solPrice, pricePerSqm] = await Promise.all([
      this.fetchSolPrice(),
      this.fetchPricePerSqm(cityType),
    ]);

    return {
      solPrice,
      pricePerSqm,
      cityType,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 캐시된 데이터 조회 (개발용)
   * 실제로는 Redis 등 캐싱 레이어 사용
   */
  getCachedPrices() {
    return {
      solPrice: this.mockSolPrice,
      manhattanPricePerSqm: this.mockPricesPerSqm.MANHATTAN,
      dubaiPricePerSqm: this.mockPricesPerSqm.DUBAI,
    };
  }

  /**
   * Mock 가격 수동 설정 (테스트용)
   */
  setMockPrices({ solPrice, manhattanPrice, dubaiPrice }) {
    if (solPrice !== undefined) this.mockSolPrice = solPrice;
    if (manhattanPrice !== undefined) this.mockPricesPerSqm.MANHATTAN = manhattanPrice;
    if (dubaiPrice !== undefined) this.mockPricesPerSqm.DUBAI = dubaiPrice;
  }
}

// Singleton 인스턴스
export const priceDataService = new PriceDataService();

export default priceDataService;
