const fs = require('fs');
const { envPath, loadEnv } = require('./config/env');

function main() {
  if (!fs.existsSync(envPath)) {
    console.error('.env 파일이 없습니다. .env.example 을 복사해서 .env 를 먼저 만드세요.');
    process.exit(1);
  }

  const env = loadEnv();

  console.log('환경 변수 확인 완료');
  console.log(`- COMMAND_SCOPE: ${env.commandScope}`);
  console.log(`- TARGET_GUILD_ID: ${env.targetGuildId ? '설정됨' : '미설정'}`);
  console.log(`- REGISTER_COMMANDS_ON_BOOT: ${env.registerCommandsOnBoot}`);
  console.log(`- NODE_ENV: ${env.nodeEnv}`);
  console.log('보안 체크: 실제 토큰 값은 출력하지 않습니다.');
}

main();
