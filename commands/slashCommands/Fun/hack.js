const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const ms = require('ms');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Simulate a terrifyingly realistic hack on a user.')
    .addUserOption(option => option.setName('target').setDescription('The user to hack').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('target');
    const hackEmbed = new EmbedBuilder()
      .setTitle(`🛡️ Initiating hack on ${user.username}...`)
      .setColor(color)
      .setImage(banner)
      .setFooter({ text: 'Warning: This is highly classified!', iconURL: interaction.user.displayAvatarURL() });

    const msg = await interaction.reply({ embeds: [hackEmbed], fetchReply: true });

    const steps = [
      { title: `⚠️ Breaching ${user.username}'s firewalls...`, delay: ms('2s') },
      { title: '🗝️ Retrieving login credentials...', delay: ms('4s') },
      { title: '🔍 Searching for sensitive data... Found!', delay: ms('6s') },
      { title: '💾 Downloading personal files... [Progress: 10%]', delay: ms('8s') },
      { title: '💾 Downloading personal files... [Progress: 40%]', delay: ms('10s') },
      { title: '💾 Downloading personal files... [Progress: 80%]', delay: ms('12s') },
      { title: '💾 Download complete! Data secured.', delay: ms('14s') },
      { title: '⚠️ Injecting malware into their system...', delay: ms('16s') },
      { title: '🖥️ Accessing camera feed...', delay: ms('18s') },
      { title: `💻 ${user.username}'s system is now fully compromised.`, delay: ms('20s') },
      { title: '💀 **HACK COMPLETE**', description: `All data from ${user.username} has been stolen. The operation is complete.`, delay: ms('22s') },
      { title: '😂 Just Kidding!', description: `Relax, ${user.username}. No real hacking happened! It was all a joke!`, delay: ms('26s') }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      hackEmbed.setTitle(step.title);
      if (step.description) hackEmbed.setDescription(step.description);
      await msg.edit({ embeds: [hackEmbed] });
    }
  },
};