const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { banner, logo, footer } = require('../../../config.json');

module.exports = {
  name: 'help',
  description: 'Displays all the commands and details about them.',
  category: 'general',
  aliases: ['h', 'he', 'hel'],
  async execute(message) {
    const { commands } = message.client;

    const categories = [...new Set(commands.map(cmd => cmd.category))];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help-menu')
      .setPlaceholder('Select a category')
      .addOptions(
        categories.map(category => ({
          label: category.charAt(0).toUpperCase() + category.slice(1),
          description: `View ${category} commands`,
          value: category,
        })),
      );

    const embed = new EmbedBuilder()
      .setTitle('Help')
      .setDescription('Select a category to view its commands')
      .setColor(0x0099FF)
      .setImage(banner)
      .setFooter({ text: footer, iconURL: logo });

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 60000,
    });

    collector.on('collect', async interaction => {
      if (interaction.customId !== 'help-menu') return;

      const category = interaction.values[0];
      const categoryCommands = commands.filter(cmd => cmd.category === category).map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
        .setDescription(categoryCommands || 'No commands available')
        .setColor(0x0099FF)
        .setImage(banner)
        .setFooter({ text: footer, iconURL: logo });

      await interaction.deferUpdate();
      await interaction.editReply({ embeds: [categoryEmbed] });
    });

    collector.on('end', async () => {
      await msg.edit({ components: [] });
    });
  },
};