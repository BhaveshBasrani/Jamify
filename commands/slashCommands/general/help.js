const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays all the commands and details about them.'),
  async execute(interaction) {
    const { commands } = interaction.client;

    const uniqueCommands = [...new Set(commands.map(cmd => cmd.name))];
    const categories = [...new Set(uniqueCommands.map(cmd => commands.find(c => c.name === cmd).category).filter(category => category))];

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
      msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    } catch (error) {
      console.error('Error sending help menu:', error);
      return;
    }

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 3_600_000,
    });

    collector.on('collect', async i => {
      if (i.customId !== 'help-menu') return;
      
      const category = i.values[0];
      let categoryCommands = uniqueCommands
        .filter(cmd => {
          const cmdObj = commands.find(c => c.name === cmd);
          return cmdObj && cmdObj.category === category;
        })
        .map(cmd => `**${cmd}**: ${commands.find(c => c.name === cmd).description}`)
        .join('\n');
      
      if (categoryCommands.length > 2048) {
        categoryCommands = categoryCommands.substring(0, 2045) + '...';
      }

      const numberOfCommands = commands.filter(cmd => cmd.category === category).length;

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`🗂️ ${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
        .setDescription(categoryCommands || 'No commands available')
        .setColor(0x32CD32)
        .setImage(banner)
        .setFooter({ text: footer, iconURL: logo })
        .setTimestamp()
        .addFields(
          { name: 'Category', value: category.charAt(0).toUpperCase() + category.slice(1), inline: true },
          { name: 'Number of Commands', value: `${numberOfCommands}`, inline: true },
          { name: 'Use command', value: '`/command_name` to use any command', inline: false },
        );

      await i.update({ embeds: [categoryEmbed] });
    });

    collector.on('end', async () => {
      await msg.edit({ components: [] });
    });
  },
};