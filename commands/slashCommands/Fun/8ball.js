const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Answers your question with a magic 8-ball response.')
    .addStringOption(option => option.setName('question').setDescription('The question to ask the 8-ball').setRequired(true)),
  async execute(interaction) {
    const responses = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes - definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      'Don’t count on it.',
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.'
    ];

    const question = interaction.options.getString('question');
    const response = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setTitle('Magic 8-Ball')
      .addFields(
        { name: 'Question', value: question },
        { name: 'Answer', value: response }
      )
      .setColor(color)
      .setImage(banner)
      .setFooter({ text: footer, iconUrl: logo });

    await interaction.reply({ embeds: [embed] });
  },
};