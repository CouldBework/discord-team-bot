const { REST, Routes } = require('discord.js');
const { commands } = require('./commands');
const { loadEnv } = require('./config/env');

const env = loadEnv();
const token = env.token;
const clientId = env.clientId;
const targetGuildId = env.targetGuildId;
const scopeArg = process.argv[2];
const scope = scopeArg || env.commandScope || 'guild';

async function main() {
  const rest = new REST({ version: '10' }).setToken(token);
  const body = commands.map((command) => command.toJSON());

  if (scope === 'global') {
    await rest.put(Routes.applicationCommands(clientId), { body });
    console.log('전역 명령어 등록 완료');
    return;
  }

  if (!targetGuildId) {
    throw new Error('guild 범위 등록에는 TARGET_GUILD_ID 환경 변수가 필요합니다.');
  }

  await rest.put(Routes.applicationGuildCommands(clientId, targetGuildId), { body });
  console.log('길드 명령어 등록 완료');
}

main().catch((error) => {
  console.error('명령어 등록 실패:', error);
  process.exit(1);
});
