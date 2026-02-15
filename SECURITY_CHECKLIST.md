# 🔒 GitHub 업로드 전 보안 체크리스트

**CRITICAL: 이 파일을 업로드 전에 꼭 확인하세요!**

---

## ✅ 필수 체크 항목

### 1. Private Key 확인

```bash
# 프로젝트 전체에서 private key 검색
grep -r "private" .
grep -r "secret" .
grep -r "key" .

# ⚠️ 발견되면 절대 커밋하지 마세요!
```

**안전한 것:**
- ✅ Public Address (공개 주소)
- ✅ `7gh5fZGdnGQWLajuGj8u4rEPNZrVjtxPbCXNHDzkQ5LX` (테스트 지갑 공개 주소)

**위험한 것:**
- ❌ Private Key (64자리 hex)
- ❌ Seed Phrase (12-24 단어)
- ❌ API Secret Keys

---

### 2. API Key 확인

```bash
# API key 검색
grep -r "API_KEY" .
grep -r "apiKey" .
grep -r "PYTH" .
grep -r "ZILLOW" .
```

**현재 상태:**
- ✅ 아직 실제 API 연동 안 함
- ✅ Mock 데이터만 사용 중

**향후 추가시:**
- ⚠️ `.env` 파일에만 저장
- ⚠️ `.gitignore`에 `.env` 포함 (이미 완료)
- ⚠️ `.env.example` 파일로 형식만 공유

---

### 3. .env 파일 체크

```bash
# .env 파일 존재 여부 확인
ls -la | grep .env

# .gitignore에 포함 확인
cat .gitignore | grep .env
```

**현재 상태:**
- ✅ `.env` 파일 없음 (안전)
- ✅ `.gitignore`에 `.env` 포함됨

---

### 4. 테스트 데이터 확인

**App_v3.js 파일:**
```javascript
const TEST_WALLET = '7gh5fZGdnGQWLajuGj8u4rEPNZrVjtxPbCXNHDzkQ5LX';
```

**상태:**
- ✅ **안전** - 이것은 공개 주소(Public Key)입니다
- ✅ Private Key가 아니므로 커밋해도 됩니다
- ✅ Devnet 테스트 지갑 (실제 돈 없음)

---

## 📋 GitHub 업로드 전 최종 체크

### Step 1: 파일 검토

```bash
# 커밋할 파일 목록 확인
git status

# 각 파일 내용 검토
git diff
```

### Step 2: 민감 정보 검색

```bash
# 위험한 키워드 검색
grep -r "privateKey" .
grep -r "secretKey" .
grep -r "password" .
grep -r "token" .
```

### Step 3: .gitignore 동작 확인

```bash
# .gitignore가 제대로 작동하는지 확인
git check-ignore -v .env
# 출력: .gitignore:5:.env    .env

# node_modules도 무시되는지 확인
git check-ignore -v node_modules
```

---

## 🚨 만약 실수로 Private Key를 커밋했다면?

### 즉시 조치사항:

1. **Repository 삭제**
   ```bash
   # GitHub에서 repository 완전 삭제
   ```

2. **새 지갑 생성**
   ```bash
   # 노출된 지갑은 절대 사용 금지
   # 새 지갑 주소 발급받기
   ```

3. **자금 이동**
   ```bash
   # 만약 실제 자금이 있었다면
   # 즉시 새 지갑으로 전송
   ```

4. **Git History 완전 삭제**
   ```bash
   # 단순 커밋 취소로는 부족!
   # Git history에 남아있음
   # Repository 완전 재생성 필요
   ```

---

## ✅ 안전한 업로드 절차

### 1. 로컬에서 최종 확인

```bash
cd ~/sol-lionaire-mobile

# 1. .gitignore 확인
cat .gitignore

# 2. 민감 정보 검색
grep -r "private" . --exclude-dir=node_modules
grep -r "secret" . --exclude-dir=node_modules

# 3. 커밋할 파일 확인
git status
```

### 2. Git 초기화 (아직 안 했다면)

```bash
git init
git add .
git status  # 다시 한번 확인!
```

### 3. .gitignore 먼저 커밋

```bash
# .gitignore를 제일 먼저 커밋
git add .gitignore
git commit -m "Add .gitignore for security"
```

### 4. 나머지 파일 커밋

```bash
# 안전 확인 후
git add .
git commit -m "Initial commit: Sol-lionaire v0.3"
```

### 5. GitHub에 푸시

```bash
# GitHub에서 repository 생성 후
git remote add origin https://github.com/yourusername/sol-lionaire.git
git branch -M main
git push -u origin main
```

---

## 📝 .env.example 템플릿

**향후 API 추가시 이 파일을 생성하세요:**

```bash
# .env.example (GitHub에 커밋 가능)

# Pyth Network
PYTH_API_KEY=your_pyth_api_key_here

# Zillow API
ZILLOW_API_KEY=your_zillow_api_key_here

# Property Finder (Dubai)
PROPERTY_FINDER_KEY=your_property_finder_key_here

# Solana
SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
```

**실제 사용:**
```bash
# .env (GitHub에 절대 커밋 금지!)
PYTH_API_KEY=abc123real_key_here
ZILLOW_API_KEY=xyz789real_key_here
```

---

## 🎯 현재 프로젝트 보안 상태

### ✅ 안전한 항목

- Public wallet address (공개 주소만 사용)
- Mock 데이터
- 오픈소스 라이브러리
- README.md
- 코드 로직

### ⚠️ 주의 항목

- 향후 API key 추가시 `.env` 사용 필수
- Private key 절대 코드에 넣지 않기

### ❌ 절대 커밋 금지

- Private keys
- Seed phrases
- API secret keys
- Passwords
- 개인 정보

---

## 📞 의심되면 질문하기!

**확신이 서지 않으면:**
1. 일단 커밋하지 마세요
2. 개발자(배우자)님께 확인 요청
3. 또는 Claude에게 다시 물어보세요

**안전이 최우선입니다!** 🔒

---

**마지막 체크:**
- [ ] Private Key 검색 완료
- [ ] API Key 검색 완료
- [ ] .gitignore 확인 완료
- [ ] 테스트 지갑만 사용 확인
- [ ] README.md 작성 완료

**모두 체크했다면 안전하게 업로드하세요!** ✅
