# Discord Team Bot

디스코드에서 `/팀짜기` 슬래시 명령어로 멤버를 랜덤 팀으로 나누는 봇입니다.

## 기능

- `/팀짜기` 명령어 지원
- 쉼표 또는 줄바꿈으로 멤버 목록 입력 가능
- 팀 수 지정 가능
- 결과 메시지 아래 `다시 섞기` 버튼 제공
- 버튼 재추첨은 최초 명령 실행자만 가능
- Render / Railway 같은 호스팅 환경에 바로 배포 가능

## 예시

```text
/팀짜기 멤버:"지상, smok, 그럴수도있지, 존잘보스" 팀수:2
```

출력 예시:

```text
랜덤으로 팀을 나눠봤어요! 🎲

🔴 팀 A — smok, 존잘보스
🔵 팀 B — 지상, 그럴수도있지
```

---

## 보안 중심 프로젝트 구조

```text
.
├─ .env.example            # 예시 값만 커밋 가능
├─ .env                    # 실제 비밀값, 커밋 금지
├─ .env.render.example     # Render 환경 변수 예시
├─ .env.railway.example    # Railway 환경 변수 예시
├─ .gitignore              # .env* 차단, example만 허용
├─ SECURITY.md             # 비밀값 관리 가이드
├─ package.json
└─ src
   ├─ check-env.js         # 시작 전 환경 변수 검증
   ├─ config/
   │  └─ env.js            # 환경 변수 로딩/검증
   ├─ commands.js
   ├─ index.js
   ├─ register-commands.js
   └─ utils.js
```

## 1. 로컬 실행

### 1) 준비

- Node.js 20+
- Discord Developer Portal에서 생성한 앱
- 테스트용 Discord 서버

### 2) 설치

```bash
npm install
```

### 3) 환경 변수 파일 생성

`.env.example` 를 복사해서 `.env` 로 만들고, **실제 값은 `.env` 에만** 입력하세요.

```bash
cp .env.example .env
```

예시:

```env
DISCORD_TOKEN=your_new_bot_token_here
CLIENT_ID=your_application_id_here
TARGET_GUILD_ID=your_test_guild_id_here
COMMAND_SCOPE=guild
REGISTER_COMMANDS_ON_BOOT=false
REROLL_TTL_MINUTES=720
NODE_ENV=production
```

환경 변수 형식이 맞는지 시작 전에 확인하세요.

```bash
npm run check:env
```

### 4) 길드 명령어 등록

개발 중에는 길드 명령어가 즉시 반영되어 편합니다.

```bash
npm run register:guild
```

### 5) 봇 실행

```bash
npm start
```

---

## 2. Discord Developer Portal 설정

### Bot 페이지

- Bot Token 발급
- Public Bot 여부 선택

### Installation 페이지

Guild Install 기준으로 아래를 설정하세요.

- Scopes:
  - `bot`
  - `applications.commands`
- Bot Permissions:
  - `Send Messages`

설치 링크로 테스트 서버에 봇을 추가합니다.

---

## 3. 전역 명령어로 배포하기

운영용으로 여러 서버에 배포할 때는 전역 명령어를 등록하세요.

```bash
npm run register:global
```

그다음 `.env` 또는 호스팅 환경 변수에서 아래처럼 바꾸면 됩니다.

```env
COMMAND_SCOPE=global
```

> 참고: 전역 명령어는 반영까지 시간이 조금 걸릴 수 있습니다.

---

## 4. Render 배포

이 프로젝트에는 `render.yaml` 이 포함되어 있어 Render Worker로 배포하기 쉽습니다.

### 방법

1. GitHub 저장소에 이 프로젝트를 푸시합니다.
2. Render에서 새 서비스를 생성합니다.
3. Blueprint 또는 Worker 방식으로 연결합니다.
4. 환경 변수에 아래 값을 입력합니다.

필수 환경 변수:

- `DISCORD_TOKEN`
- `CLIENT_ID`
- `TARGET_GUILD_ID` (길드 명령어 개발 시)
- `COMMAND_SCOPE`

원하면 아래 값을 추가할 수 있습니다.

- `REGISTER_COMMANDS_ON_BOOT=true`
- `REROLL_TTL_MINUTES=720`

추천 값:

```env
COMMAND_SCOPE=guild
REGISTER_COMMANDS_ON_BOOT=true
REROLL_TTL_MINUTES=720
```

---

## 5. Railway 배포

1. GitHub 저장소 연결
2. 환경 변수 등록
3. Start Command를 `npm start` 로 설정
4. 필요 시 명령어는 로컬에서 먼저 등록하거나 `REGISTER_COMMANDS_ON_BOOT=true` 사용

---

## 6. 환경 변수 설명

- `DISCORD_TOKEN`: Discord 봇 토큰
- `CLIENT_ID`: Discord Application ID
- `TARGET_GUILD_ID`: 길드 명령어 등록 대상 서버 ID
- `COMMAND_SCOPE`: `guild` 또는 `global`
- `REGISTER_COMMANDS_ON_BOOT`: `true` 이면 봇 시작 시 명령어 등록
- `REROLL_TTL_MINUTES`: 다시 섞기 버튼 상태 유지 시간(분)

---

## 7. 파일 구조

```text
.
├─ .env.example
├─ .gitignore
├─ package.json
├─ render.yaml
├─ README.md
└─ src
   ├─ commands.js
   ├─ index.js
   ├─ register-commands.js
   └─ utils.js
```

---

## 8. GitHub 업로드 예시

```bash
git init
git add .
git commit -m "feat: initial discord team bot"
git branch -M main
git remote add origin <YOUR_REPOSITORY_URL>
git push -u origin main
```

---

## 9. 보안 주의

- `.env`, `.env.local`, `.env.production` 같은 실제 값 파일은 GitHub에 올리지 마세요.
- `.gitignore` 는 `.env*` 전체를 차단하고, 예시 파일만 허용하도록 설정되어 있습니다.
- 시작 전 `npm run check:env` 로 환경 변수를 검증하세요.
- 토큰이 노출되었다면 Discord Developer Portal에서 즉시 재발급하세요.
- 자세한 보안 작업 순서는 `SECURITY.md` 를 참고하세요.

---

## 10. 향후 확장 아이디어

- `@봇 팀짜기` 멘션형 별칭 추가
- 음성 채널 접속자 자동 수집
- 팀장 자동 지정
- 밸런스 배정 모드
- 임베드 메시지 스타일 적용
