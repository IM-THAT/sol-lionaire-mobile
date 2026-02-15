/**
 * Sol-lionaire 가치 환산 알고리즘
 * MONOLITH Hackathon
 * 
 * 기술 사양서 기준:
 * Owned_Area (m²) = (SOL Holdings × Current Price) / (Real-time m² Price of Target City)
 */

/**
 * 부동산 타입 정의
 */
export const PropertyType = {
  MICRO: 'MICRO',   // 공공기물 (맨홀, 벤치 등)
  MACRO: 'MACRO',   // 실제 부동산
};

/**
 * 도시 타입 정의
 */
export const CityType = {
  MANHATTAN: 'MANHATTAN',
  DUBAI: 'DUBAI',
};

/**
 * 가치 환산 계산기
 */
class ValueCalculator {
  /**
   * 총 자산 가치 계산 (USD)
   * @param {number} solAmount - SOL 보유량
   * @param {number} solPrice - 현재 SOL 가격 (USD)
   * @returns {number} 총 자산 가치 (USD)
   */
  calculateTotalValue(solAmount, solPrice) {
    return solAmount * solPrice;
  }

  /**
   * 점유 가능 면적 계산 (m²)
   * @param {number} totalValue - 총 자산 가치 (USD)
   * @param {number} pricePerSqm - m²당 가격 (USD)
   * @returns {number} 점유 가능 면적 (m²)
   */
  calculateOwnedArea(totalValue, pricePerSqm) {
    if (pricePerSqm === 0) return 0;
    return totalValue / pricePerSqm;
  }

  /**
   * 자산 규모 분류 (Micro vs Macro)
   * @param {number} ownedArea - 점유 가능 면적 (m²)
   * @param {number} solAmount - SOL 보유량
   * @returns {string} PropertyType
   */
  classifyPropertyType(ownedArea, solAmount) {
    // 기술 사양서 기준: 1.0 m² 미만 또는 10 SOL 미만은 Micro
    const MIN_AREA_THRESHOLD = 1.0; // m²
    const MIN_SOL_THRESHOLD = 10;    // SOL
    
    if (ownedArea < MIN_AREA_THRESHOLD || solAmount < MIN_SOL_THRESHOLD) {
      return PropertyType.MICRO;
    }
    return PropertyType.MACRO;
  }

  /**
   * 매핑할 오브젝트/부동산 결정
   * @param {Object} params
   * @returns {Object} 매핑 결과
   */
  determineMapping(params) {
    const {
      solAmount,
      solPrice,
      cityPricePerSqm,
      cityType,
    } = params;

    // Step 1: 총 자산 가치 계산
    const totalValue = this.calculateTotalValue(solAmount, solPrice);

    // Step 2: 점유 가능 면적 계산
    const ownedArea = this.calculateOwnedArea(totalValue, cityPricePerSqm);

    // Step 3: 자산 규모 분류
    const propertyType = this.classifyPropertyType(ownedArea, solAmount);

    // Step 4: 매핑 로직
    if (propertyType === PropertyType.MICRO) {
      return this.mapMicroProperty(totalValue, cityType);
    } else {
      return this.mapMacroProperty(ownedArea, totalValue, cityType);
    }
  }

  /**
   * Micro Property 매핑 (공공기물)
   * @param {number} totalValue - 총 자산 가치 (USD)
   * @param {string} cityType - 도시 타입
   * @returns {Object} 매핑 결과
   */
  mapMicroProperty(totalValue, cityType) {
    const microObjects = this.getMicroObjectsDatabase(cityType);
    
    // 가격대에 맞는 오브젝트 찾기
    const matchedObject = microObjects.find(obj => 
      totalValue >= obj.minValue && totalValue < obj.maxValue
    );

    return {
      type: PropertyType.MICRO,
      totalValue,
      object: matchedObject || microObjects[0], // 기본값은 첫 번째 오브젝트
      cityType,
    };
  }

  /**
   * Macro Property 매핑 (실제 부동산)
   * @param {number} ownedArea - 점유 가능 면적 (m²)
   * @param {number} totalValue - 총 자산 가치 (USD)
   * @param {string} cityType - 도시 타입
   * @returns {Object} 매핑 결과
   */
  mapMacroProperty(ownedArea, totalValue, cityType) {
    // 실제 매물 데이터베이스에서 검색 (현재는 Mock)
    const properties = this.getPropertiesDatabase(cityType);
    
    // ±5% 오차 범위 내의 매물 찾기
    const TOLERANCE = 0.05;
    const matchedProperty = properties.find(prop => {
      const priceDiff = Math.abs(prop.price - totalValue) / totalValue;
      return priceDiff <= TOLERANCE;
    });

    if (matchedProperty) {
      // 전체 매물 구매 가능
      return {
        type: PropertyType.MACRO,
        totalValue,
        ownedArea,
        property: matchedProperty,
        ownershipType: 'FULL',
        cityType,
      };
    } else {
      // 부분 소유 (Partial Zoning)
      return this.mapPartialOwnership(ownedArea, totalValue, cityType);
    }
  }

  /**
   * 부분 소유 매핑 (Partial Zoning)
   */
  mapPartialOwnership(ownedArea, totalValue, cityType) {
    const properties = this.getPropertiesDatabase(cityType);
    
    // 가격대가 높은 매물 선택 (일부만 소유)
    const property = properties.find(prop => prop.price > totalValue) || properties[0];
    
    // 소유 비율 계산
    const ownershipRatio = totalValue / property.price;
    const ownedRooms = this.determineOwnedRooms(ownershipRatio);

    return {
      type: PropertyType.MACRO,
      totalValue,
      ownedArea,
      property,
      ownershipType: 'PARTIAL',
      ownershipRatio,
      ownedRooms,
      cityType,
    };
  }

  /**
   * 소유 비율에 따른 방 할당
   */
  determineOwnedRooms(ratio) {
    if (ratio >= 0.7) return ['Living Room', 'Master Bedroom', 'Bathroom'];
    if (ratio >= 0.4) return ['Living Room', 'Bathroom'];
    if (ratio >= 0.2) return ['Bathroom', 'Veranda'];
    return ['Veranda'];
  }

  /**
   * Micro Objects 데이터베이스 (Mock)
   */
  getMicroObjectsDatabase(cityType) {
    if (cityType === CityType.MANHATTAN) {
      return [
        {
          id: 'mh_manhole_1',
          name: 'Iron Manhole Cover',
          location: '5th Ave, Manhattan',
          description: 'NYC Street Shareholder',
          minValue: 100,
          maxValue: 500,
          imageUrl: 'https://example.com/manhole.jpg', // 실제로는 assets에서 로드
        },
        {
          id: 'mh_bench_1',
          name: 'Park Bench',
          location: 'Central Park, Manhattan',
          description: 'Central Park Member',
          minValue: 500,
          maxValue: 1500,
          imageUrl: 'https://example.com/bench.jpg',
        },
      ];
    } else {
      // Dubai
      return [
        {
          id: 'db_lamp_1',
          name: 'Street Lamp',
          location: 'Dubai Marina Walk',
          description: 'Marina Light Owner',
          minValue: 100,
          maxValue: 500,
          imageUrl: 'https://example.com/lamp.jpg',
        },
      ];
    }
  }

  /**
   * Properties 데이터베이스 (Mock)
   * 실제로는 Zillow/Property Finder API에서 가져옴
   */
  getPropertiesDatabase(cityType) {
    if (cityType === CityType.MANHATTAN) {
      return [
        {
          id: 'mh_apt_1',
          name: '1 Bedroom Apartment',
          location: 'Upper East Side, Manhattan',
          price: 750000,
          area: 65,
          floor: 12,
          view: 'Central Park View',
          imageUrl: 'https://example.com/manhattan_apt.jpg',
        },
        {
          id: 'mh_apt_2',
          name: 'Penthouse',
          location: '5th Ave, Manhattan',
          price: 5000000,
          area: 250,
          floor: 42,
          view: 'Empire State Building View',
          imageUrl: 'https://example.com/manhattan_penthouse.jpg',
        },
      ];
    } else {
      // Dubai
      return [
        {
          id: 'db_apt_1',
          name: '1 Bedroom Apartment',
          location: 'Marina Gate, Dubai',
          price: 800000,
          area: 80,
          floor: 24,
          view: 'Marina Yacht View',
          imageUrl: 'https://example.com/dubai_apt.jpg',
        },
        {
          id: 'db_apt_2',
          name: 'Penthouse',
          location: 'Burj Khalifa Area, Dubai',
          price: 8000000,
          area: 400,
          floor: 65,
          view: 'Burj Khalifa View',
          imageUrl: 'https://example.com/dubai_penthouse.jpg',
        },
      ];
    }
  }
}

// Singleton 인스턴스 생성
export const valueCalculator = new ValueCalculator();

export default valueCalculator;
