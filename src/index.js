const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  REST,
  Routes
} = require('discord.js');

const { commands } = require('./commands');
const { loadEnv } = require('./config/env');
const { getExpiryMs, parseMembers, renderTeams, splitTeams } = require('./utils');

const env = loadEnv();
const token = env.token;
const clientId = env.clientId;
const targetGuildId = env.targetGuildId;
const commandScope = env.commandScope;
const registerOnBoot = env.registerCommandsOnBoot;
const rerollTtlMs = getExpiryMs(env.rerollTtlMinutes);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const rerollStore = new Map();

function cleanupExpiredRerolls() {
  const now = Date.now();
  for (const [key, value] of rerollStore.entries()) {
    if (value.expiresAt <= now) {
      rerollStore.delete(key);
    }
  }
}

function makeRerollKey(interaction) {
  return `${interaction.user.id}:${interaction.id}`;
}

function buildTeamMessage(title, teams) {
  return `${title}\n\n${renderTeams(teams)}`;
}

function buildRerollRow(key) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`reroll:${key}`)
      .setLabel('다시 섞기')
      .setStyle(ButtonStyle.Primary)
  );
}

async function registerCommandsIfNeeded() {
  if (!registerOnBoot) {
    return;
  }

  const rest = new REST({ version: '10' }).setToken(token);
  const body = commands.map((command) => command.toJSON());

  if (commandScope === 'global') {
    await rest.put(Routes.applicationCommands(clientId), { body });
    console.log('부팅 시 전역 명령어 등록 완료');
    return;
  }

  if (!targetGuildId) {
    throw new Error('REGISTER_COMMANDS_ON_BOOT=true 이고 COMMAND_SCOPE=guild 인 경우 TARGET_GUILD_ID가 필요합니다.');
  }

  await rest.put(Routes.applicationGuildCommands(clientId, targetGuildId), { body });
  console.log('부팅 시 길드 명령어 등록 완료');
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`로그인됨: ${readyClient.user.tag}`);
  cleanupExpiredRerolls();
  setInterval(cleanupExpiredRerolls, 1000 * 60 * 10).unref();

  try {
    await registerCommandsIfNeeded();
  } catch (error) {
    console.error('명령어 자동 등록 실패:', error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName !== '팀짜기') {
        return;
      }

      const rawMembers = interaction.options.getString('멤버', true);
      const teamCount = interaction.options.getInteger('팀수', true);
      const members = parseMembers(rawMembers);

      if (members.length < 2) {
        await interaction.reply({
          content: '최소 2명 이상 입력해 주세요.',
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (members.length < teamCount) {
        await interaction.reply({
          content: `멤버 수(${members.length})가 팀 수(${teamCount})보다 적습니다.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const teams = splitTeams(members, teamCount);
      const key = makeRerollKey(interaction);

      rerollStore.set(key, {
        ownerId: interaction.user.id,
        members,
        teamCount,
        expiresAt: Date.now() + rerollTtlMs
      });

      await interaction.reply({
        content: buildTeamMessage('랜덤으로 팀을 나눠봤어요! 🎲', teams),
        components: [buildRerollRow(key)]
      });
      return;
    }

    if (interaction.isButton()) {
      if (!interaction.customId.startsWith('reroll:')) {
        return;
      }

      cleanupExpiredRerolls();
      const key = interaction.customId.replace('reroll:', '');
      const saved = rerollStore.get(key);

      if (!saved) {
        await interaction.reply({
          content: '재추첨 정보가 만료되었어요. 다시 /팀짜기 명령어를 사용해 주세요.',
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (saved.ownerId !== interaction.user.id) {
        await interaction.reply({
          content: '이 버튼은 처음 명령어를 실행한 사용자만 사용할 수 있어요.',
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const teams = splitTeams(saved.members, saved.teamCount);
      saved.expiresAt = Date.now() + rerollTtlMs;
      rerollStore.set(key, saved);

      await interaction.update({
        content: buildTeamMessage('다시 섞은 결과예요! 🎲', teams),
        components: [buildRerollRow(key)]
      });
    }
  } catch (error) {
    console.error('인터랙션 처리 중 오류:', error);

    if (interaction.isRepliable()) {
      const payload = {
        content: '오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
        flags: MessageFlags.Ephemeral
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(payload).catch(() => {});
      } else {
        await interaction.reply(payload).catch(() => {});
      }
    }
  }
});

client.login(token).catch((error) => {
  console.error('로그인 실패:', error);
  process.exit(1);
});
