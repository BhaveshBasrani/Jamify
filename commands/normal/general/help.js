const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const { banner, logo, footer } = require('../../../config.json');

module.exports = {
  name: 'help',
  description: 'Displays all the commands and details about them.',
  category: 'general',
  aliases: ['h', 'he', 'hel'],
  async execute(message) {
    const { commands } = message.client;

    const categories = [...new Set(commands.filter(cmd => cmd.category).map(cmd => cmd.category))];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help-menu')
      .setPlaceholder('Select a category')
      .addOptions(
        categories.map(category => 
          new StringSelectMenuOptionBuilder()
            .setLabel(category.charAt(0).toUpperCase() + category.slice(1))
            .setValue(category)
            .setDescription(`View ${category} commands`)
        )
      );

    const embed = new EmbedBuilder()
      .setTitle('📜 Help Menu')
      .setDescription('Select a category to view its commands.')
      .setColor(0x1E90FF)
      .setImage(banner)
      .setFooter({ text: footer, iconURL: logo })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(selectMenu);

    let msg;
    try {
      msg = await message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error('Error sending help menu:', error);
      return;
    }

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect, // Corrected componentType
      time: 3_600_000,
    });

    collector.on('collect', async interaction => {
      if (interaction.customId !== 'help-menu') return;

      const category = interaction.values[0];
      let categoryCommands = commands.filter(cmd => cmd.category === category).map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');

      if (categoryCommands.length > 2048) {
        categoryCommands = categoryCommands.substring(0, 2045) + '...';
      }

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`🗂️ ${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
        .setDescription(categoryCommands || 'No commands available')
        .setColor(0x32CD32)
        .setImage(banner)
        .setFooter({ text: footer, iconURL: logo })
        .setTimestamp()
        .addFields(
          { name: 'Category', value: category.charAt(0).toUpperCase() + category.slice(1), inline: true },
          { name: 'Number of Commands', value: `${commands.filter(cmd => cmd.category === category).length}`, inline: true },
          { name: 'Use command', value: '`!command_name` to use any command', inline: false },
        );

      await interaction.update({ embeds: [categoryEmbed] }); // Update interaction with the new embed
    });

    collector.on('end', async () => {
      await msg.edit({ components: [] }); // Remove components after the collector ends
    });
  },
};