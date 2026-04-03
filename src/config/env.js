const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`${name} 환경 변수가 필요합니다.`);
  }
  return String(value).trim();
}

function getOptionalEnv(name, defaultValue) {
  const value = process.env[name];
  if (value === undefined || value === null || String(value).trim() === '') {
    return defaultValue;
  }
  return String(value).trim();
}

function getBooleanEnv(name, defaultValue = false) {
  const value = process.env[name];
  if (value === undefined || value === null || String(value).trim() === '') {
    return defaultValue;
  }
  return String(value).trim().toLowerCase() === 'true';
}

function validateCommandScope(value) {
  const normalized = String(value).trim().toLowerCase();
  if (!['guild', 'global'].includes(normalized)) {
    throw new Error(`COMMAND_SCOPE 값은 guild 또는 global 이어야 합니다. 현재 값: ${value}`);
  }
  return normalized;
}

function loadEnv() {
  const config = {
    token: getRequiredEnv('DISCORD_TOKEN'),
    clientId: getRequiredEnv('CLIENT_ID'),
    targetGuildId: getOptionalEnv('TARGET_GUILD_ID', ''),
    commandScope: validateCommandScope(getOptionalEnv('COMMAND_SCOPE', 'guild')),
    nodeEnv: getOptionalEnv('NODE_ENV', 'production'),
    registerCommandsOnBoot: getBooleanEnv('REGISTER_COMMANDS_ON_BOOT', false),
    rerollTtlMinutes: getOptionalEnv('REROLL_TTL_MINUTES', '720')
  };

  if (config.commandScope === 'guild' && !config.targetGuildId) {
    throw new Error('COMMAND_SCOPE=guild 인 경우 TARGET_GUILD_ID 환경 변수가 필요합니다.');
  }

  return config;
}

module.exports = {
  envPath,
  loadEnv
};
