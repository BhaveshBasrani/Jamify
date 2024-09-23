const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const { banner, logo, footer, website } = require('../../../config.json');
const ServerSettings = require('../../../models/ServerSettings.js');
module.exports = {
  name: 'help',
  description: 'Displays all the commands and details about them.',
  category: 'general',
  aliases: ['h', 'he', 'hel'],
  async execute(message) {
    const { commands } = message.client;

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
      .setTitle('<:Help_Cmd:1280034026656370739> Help Menu')
      .setDescription(`Select a category to view its commands.`)
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
      componentType: ComponentType.StringSelect,
      time: 3_600_000,
    });

    collector.on('collect', async interaction => {
      if (interaction.customId !== 'help-menu') return;
      
      const category = interaction.values[0];
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

      const numberOfCommands = uniqueCommands.filter(cmd => {
        const cmdObj = commands.find(c => c.name === cmd);
        return cmdObj && cmdObj.category === category;
      }).length;
      const serverSettings = await ServerSettings.findOne({ guildId: message.guild.id });
      const prefix = serverSettings && serverSettings.prefix ? serverSettings.prefix : require('../../../config.json').prefix;
      const categoryEmbed = new EmbedBuilder()
        .setTitle(`<:Menu:1286008459204100158>  ${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
        .setAuthor({
          name: 'Jamify',
          iconURL: logo,
          url: website
      })
        .setDescription(categoryCommands ? categoryCommands.split('\n').map(cmd => `<a:Blue_Arrow:1280033714100768779> ${cmd}`).join('\n') : 'No commands available')
        .setColor(0x32CD32)
        .setImage(banner)
        .setFooter({ text: footer, iconURL: logo })
        .setTimestamp()
        .addFields(
          { name: 'Category', value: category.charAt(0).toUpperCase() + category.slice(1), inline: true },
          { name: 'Number of Commands', value: `${numberOfCommands}`, inline: true },
          { name: 'Use command', value: `${prefix}command_name to use any command`, inline: false },
        );

      await interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on('end', async () => {
      await msg.edit({ components: [] });
    });
  },
};