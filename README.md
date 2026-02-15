# Sol-lionaire 🏠💎

**MONOLITH Hackathon Submission**  
*From Volatile Numbers to Tangible Luxury*

---

## 📋 프로젝트 개요

Sol-lionaire는 당신의 SOL 잔고를 **맨해튼과 두바이의 실제 부동산 가치**로 환산하여 시각화하는 Web3 자산 시뮬레이션 플랫폼입니다.

- **소액 유저**: 맨홀 뚜껑이나 공원 벤치를 "소유"하는 위트 있는 경험
- **고액 유저**: 실제 펜트하우스 매물과 1:1 매칭되는 럭셔리 경험

---

## 🚀 빠른 시작 (Quick Start)

### Mac mini + Warp 환경 기준

```bash
# 1. 자동 설치 스크립트 실행
cd ~
chmod +x auto-setup.sh
./auto-setup.sh

# 2. 프로젝트 폴더로 이동
cd ~/sol-lionaire-mobile

# 3. 소스코드 파일 복사 (클로드가 제공한 파일들)
# - src/hooks/useWalletConnection.js
# - src/services/valueCalculator.js
# - src/services/priceDataService.js
# - App.js (메인 파일)

# 4. 개발 서버 실행
npm start
```

---

## 📦 기술 스택

### Frontend
- **React Native** + **Expo SDK 50+**
- Solana Mobile Wallet Adapter (MWA)

### Blockchain
- **Solana Web3.js** (Devnet)
- Pyth Network (실시간 가격 오라클)

### Data Sources
- Zillow API (맨해튼 부동산 데이터)
- Property Finder API (두바이 부동산 데이터)
- 현재는 Mock 데이터 사용 (프로토타입)

---

## 🏗️ 프로젝트 구조

```
sol-lionaire-mobile/
├── App.js                              # 메인 엔트리 포인트
├── src/
│   ├── hooks/
│   │   └── useWalletConnection.js      # 지갑 연동 Hook
│   ├── services/
│   │   ├── valueCalculator.js          # 가치 환산 알고리즘
│   │   └── priceDataService.js         # 가격 데이터 서비스
│   ├── components/
│   │   ├── WalletButton.js             # (추후 개발)
│   │   └── PropertyCard.js             # (추후 개발)
│   └── screens/
│       └── HomeScreen.js               # (추후 개발)
├── assets/
│   └── images/                         # 부동산 이미지
└── package.json
```

---

## 🔑 핵심 기능

### 1. 지갑 연동
```javascript
// useWalletConnection Hook 사용
const { balance, connectWallet } = useWalletConnection();
await connectWallet('YOUR_WALLET_ADDRESS');
```

### 2. 가치 환산 알고리즘
```javascript
// 기술 사양서 기준 공식
Owned_Area (m²) = (SOL Holdings × Current Price) / (m² Price)
```

### 3. 자동 분기 로직
- **Micro Mode**: 1.0 m² 미만 → 공공기물 매칭 (맨홀, 벤치)
- **Macro Mode**: 1.0 m² 이상 → 실제 부동산 매칭

---

## 🧪 테스트 방법

### 로컬 테스트 (Devnet)

```bash
# 1. Expo 개발 서버 실행
npm start

# 2. 옵션 선택
# - iOS: i 키 누르기 (Mac 전용)
# - Android: a 키 누르기
# - Web: w 키 누르기 (브라우저 테스트)

# 3. 테스트용 지갑 주소 (이미 코드에 포함됨)
# 7gh5fZGdnGQWLajuGj8u4rEPNZrVjtxPbCXNHDzkQ5LX
```

### 시나리오 테스트

**Scenario 1: Micro User (2 SOL)**
1. Connect Wallet 버튼 클릭
2. Balance: 2 SOL 확인
3. Calculate 버튼 클릭
4. 결과: "Iron Manhole Cover on 5th Ave" 

**Scenario 2: Macro User (수정 필요시)**
1. Mock 데이터 조정 (`priceDataService.js`)
2. 높은 잔액으로 테스트
3. 결과: "Marina Gate Apartment" 등

---

## 🛠️ 개발 로드맵

### ✅ Phase 1 - MVP (완료)
- [x] 프로젝트 초기 세팅
- [x] 지갑 연동 Hook
- [x] 가치 환산 알고리즘
- [x] 기본 UI

### 🚧 Phase 2 - API 연동 (진행 중)
- [ ] Pyth Network 실시간 가격 연동
- [ ] Zillow API 연동
- [ ] Property Finder API 연동
- [ ] Redis 캐싱 레이어

### 📅 Phase 3 - UI/UX 개선
- [ ] Seeker 폰 최적화 (9:16 세로형)
- [ ] 자산 인증 카드 디자인
- [ ] 공유 기능 (SNS)
- [ ] 애니메이션 효과

### 🎯 Phase 4 - 최종 제출
- [ ] Seeker 위젯 개발
- [ ] 데모 영상 제작
- [ ] 문서 작성
- [ ] 3월 9일 제출

---

## 🐛 트러블슈팅

### 문제 1: npm install 실패
```bash
# Node.js 버전 확인
node -v  # v18 이상 권장

# Homebrew로 재설치
brew uninstall node
brew install node@18
```

### 문제 2: Expo 앱이 실행 안 됨
```bash
# 캐시 삭제
npm start -- --clear

# 또는 완전 재설치
rm -rf node_modules
rm package-lock.json
npm install
```

### 문제 3: 지갑 연결 에러
- Devnet RPC 엔드포인트 확인
- 지갑 주소 형식 확인 (Base58)
- 네트워크 연결 확인

---

## 📞 문의

**Founder**: 이민지 (imthatsol)  
**해커톤**: MONOLITH 2026  
**마감**: 2026년 3월 9일

---

## 📄 라이선스

MIT License - MONOLITH Hackathon Submission

---

## 🌟 특별 감사

- Solana Foundation
- RadiantsDAO
- MONOLITH Hackathon 운영진

---

**"From Volatile Numbers to Tangible Luxury"**  
🏠 Sol-lionaire - Your Crypto Real Estate Simulator
