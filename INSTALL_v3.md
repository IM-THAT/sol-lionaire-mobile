# 🚀 Sol-lionaire v0.3 - 설치 및 업그레이드 가이드

**MONOLITH Hackathon Final Version**

---

## 📦 새로운 기능 (v0.2 → v0.3)

### ✨ 추가된 기능
1. **🎨 cNFT 발행 시스템** - 영토를 온체인 NFT로 발행
2. **📍 GPS Geofencing** - 실제 위치 방문시 보상 획득
3. **🌍 4개 도시 지원** - Manhattan, Dubai, Seoul, Tokyo
4. **💫 애니메이션** - 숫자 카운트업, 부드러운 전환
5. **📤 공유 기능** - 9:16 최적화 SNS 카드
6. **🏆 보상 시스템** - 랜드마크 방문 배지/스킨

---

## 🔧 업그레이드 방법

### Step 1: 기존 프로젝트 백업

```bash
cd ~/sol-lionaire-mobile
cp -r . ../sol-lionaire-mobile-backup
```

### Step 2: 새 파일 복사

```bash
# 다운로드한 v0.3 파일들을 프로젝트에 복사

# 1. 메인 App.js 교체
cp ~/Downloads/App_v3.js ./App.js

# 2. 새 서비스 파일 추가
cp ~/Downloads/propertyDatabase.js ./src/services/
cp ~/Downloads/nftMinter.js ./src/services/
cp ~/Downloads/geofencingService.js ./src/services/

# 3. 새 컴포넌트 추가
cp ~/Downloads/MintButton.js ./src/components/
cp ~/Downloads/AnimatedCounter.js ./src/components/
cp ~/Downloads/ShareCard.js ./src/components/

# 4. Hook 교체 (v0.2에서 이미 업데이트됨)
cp ~/Downloads/useWalletConnection_v2.js ./src/hooks/useWalletConnection.js
```

### Step 3: 새 패키지 설치 (선택사항)

```bash
# Geolocation (React Native 전용, 웹에서는 불필요)
# npm install @react-native-community/geolocation

# Image Capture (공유 기능, 나중에 추가 가능)
# npm install react-native-view-shot

# QR Code (이미지는 외부 API 사용 중)
```

### Step 4: 앱 재시작

```bash
npm start
```

웹 브라우저에서 **R** 키 또는 **Cmd+R**로 새로고침

---

## 🎮 v0.3 기능 테스트

### 1. NFT 발행 테스트

```
1. Connect Wallet
2. Calculate Territory
3. "Mint as NFT" 버튼 클릭
4. 결과: ✅ NFT Minted 메시지
5. LocalStorage에 NFT 저장 확인
```

### 2. GPS 기능 테스트 (웹)

```
1. 헤더에서 "📍 Location Rewards" 스위치 ON
2. 브라우저에서 위치 권한 허용
3. (테스트용) Mock 좌표 설정하여 랜드마크 시뮬레이션
```

**참고**: 웹에서는 실제 GPS 기능이 제한적입니다. 
실제 기기 테스트는 Seeker 폰 또는 Android 폰에서 해야 합니다.

### 3. 다중 도시 테스트

```
1. Manhattan 선택 → Calculate
2. Dubai 선택 → Calculate
3. Seoul 선택 → Calculate
4. Tokyo 선택 → Calculate
5. 각 도시별 오브젝트/부동산 확인
```

### 4. 공유 기능 테스트

```
1. Calculate 후 결과 확인
2. "📤 Share Your Territory" 클릭
3. 9:16 비율 카드 확인
4. (향후) 실제 공유 기능 연동
```

### 5. 보상 시스템 테스트

```
1. GPS 켜기
2. 맨해튼 5번가 좌표 근처로 설정
3. 🎉 알림 수신 확인
4. "🏆 Rewards" 버튼 클릭
5. 획득한 보상 목록 확인
```

---

## 📊 데이터 구조

### LocalStorage에 저장되는 데이터

```javascript
// NFT 목록
nfts_{walletAddress}: [
  {
    nftId: "cnft_...",
    metadata: {...},
    mintedAt: "2026-02-15T..."
  }
]

// 획득한 보상
unlocked_rewards: [
  {
    landmarkId: "mh_landmark_1",
    landmarkName: "5th Avenue",
    reward: { type: "SKIN", item: "Gold Manhole" },
    unlockedAt: "2026-02-15T..."
  }
]
```

---

## 🐛 트러블슈팅

### 문제 1: Geolocation 에러

```
해결: 브라우저에서 위치 권한 허용
Chrome: 주소창 왼쪽 자물쇠 → 권한 → 위치 허용
```

### 문제 2: NFT 발행 실패

```
원인: Mock 구현 (실제 온체인 연동 전)
해결: 정상 동작. 콘솔에서 "NFT 발행 완료 (Mock)" 확인
```

### 문제 3: 공유 버튼 클릭시 아무 반응 없음

```
원인: react-native-view-shot 미설치
해결: 현재는 "Coming Soon" 알림 표시 (정상)
향후: 패키지 설치 후 실제 구현
```

### 문제 4: GPS가 작동 안 함

```
원인: 웹에서는 실제 GPS 제한적
해결: 
1. Seeker 폰 또는 Android 기기에서 테스트
2. 또는 코드에서 Mock 좌표로 테스트
```

---

## 🎯 다음 단계 (Week 2)

### Phase 1: 실제 API 연동
- [ ] Pyth Network 실시간 가격
- [ ] Zillow API (Manhattan)
- [ ] Property Finder API (Dubai)
- [ ] Metaplex Bubblegum (cNFT)

### Phase 2: Seeker 최적화
- [ ] React Native Geolocation
- [ ] Android 위젯 개발
- [ ] Push Notification
- [ ] react-native-view-shot (공유)

### Phase 3: UI 개선
- [ ] 실제 부동산 이미지
- [ ] 더 많은 애니메이션
- [ ] 다크모드 완성도
- [ ] 로딩 스켈레톤

### Phase 4: 최종 제출
- [ ] 데모 영상 제작
- [ ] 기술 문서 작성
- [ ] 우승 전략 정리

---

## 📞 지원

**문제 발생시:**
1. 에러 메시지 전체 복사
2. 어느 단계에서 발생했는지 설명
3. 스크린샷 첨부

**민지 파운더님, 화이팅!** 🚀

---

**Sol-lionaire v0.3**  
*From Volatile Numbers to Tangible Luxury*  
MONOLITH Hackathon 2026
