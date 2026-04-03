# Security Guide

이 프로젝트는 **실제 비밀값을 GitHub에 올리지 않는 것**을 기본 원칙으로 합니다.

## 원칙

- 실제 토큰은 오직 `.env` 또는 호스팅 플랫폼 환경 변수에만 저장합니다.
- Git에는 `.env.example` 만 커밋합니다.
- `.env`, `.env.local`, `.env.production` 같은 실제 값 파일은 모두 Git에서 무시합니다.
- 토큰이 한 번이라도 커밋되었으면 **즉시 재발급**합니다.

## 안전한 파일 구조

```text
.
├─ .env.example           # 커밋 가능, 예시 값만 포함
├─ .env                   # 커밋 금지, 실제 값 저장
├─ .gitignore             # .env* 차단
├─ SECURITY.md            # 보안 가이드
└─ src/
   └─ config/
      └─ env.js           # 환경 변수 로딩 및 검증
```

## 로컬 설정

1. `.env.example` 를 복사해서 `.env` 를 만듭니다.
2. 실제 토큰과 ID를 `.env` 에 입력합니다.
3. `npm run check:env` 로 시작 전 검증합니다.

```bash
cp .env.example .env
npm run check:env
```

## GitHub에 올리면 안 되는 것

- `.env`
- `.env.local`
- `.env.production`
- 실제 토큰, API Key, 쿠키, 인증서, 개인키

## Render / Railway 환경 변수 설정

### Render

- Dashboard → Service → Environment
- 아래 값을 직접 입력
  - `DISCORD_TOKEN`
  - `CLIENT_ID`
  - `TARGET_GUILD_ID`
  - `COMMAND_SCOPE`
  - `REGISTER_COMMANDS_ON_BOOT`
  - `REROLL_TTL_MINUTES`

### Railway

- Project → Variables
- 동일한 키를 직접 입력

## 사고 대응

토큰이 노출되었거나 GitHub가 secret scanning 경고를 띄우면:

1. GitHub에서 우회 허용하지 않기
2. Discord Developer Portal에서 토큰 재발급
3. 저장소와 배포 환경의 토큰을 새 값으로 교체
4. 필요하면 Git 히스토리 정리

## 권장 커밋 전 점검

```bash
git status
cat .gitignore
npm run check:env
```

실제 비밀값이 보이는 파일이 staging 되어 있으면 `git add` 를 취소한 뒤 먼저 제거하세요.
