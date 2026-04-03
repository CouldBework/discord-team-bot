const { SlashCommandBuilder } = require('discord.js');

const splitTeamsCommand = new SlashCommandBuilder()
  .setName('팀짜기')
  .setDescription('멤버 목록을 랜덤으로 팀으로 나눕니다.')
  .addStringOption((option) =>
    option
      .setName('멤버')
      .setDescription('쉼표(,) 또는 줄바꿈으로 구분해서 입력하세요.')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('팀수')
      .setDescription('나눌 팀 수')
      .setRequired(true)
      .setMinValue(2)
      .setMaxValue(10)
  );

module.exports = {
  commands: [splitTeamsCommand]
};
