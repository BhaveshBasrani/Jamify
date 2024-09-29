const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const { banner, logo, footer, website, color } = require('../../../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays all the commands and details about them.'),
  async execute(interaction) {
    const commandsDir = path.join(__dirname, '../../../commands/slashCommands');
    const categories = fs.readdirSync(commandsDir).filter(file => fs.statSync(path.join(commandsDir, file)).isDirectory());

    const commands = categories.flatMap(category => {
      const categoryDir = path.join(commandsDir, category);
      const commandFiles = fs.readdirSync(categoryDir).filter(file => file.endsWith('.js'));

      return commandFiles.map(file => {
        const command = require(path.join(categoryDir, file));
        return {
          name: command.data.name,
          description: command.data.description,
          category: category
        };
      });
    });

    const uniqueCommands = [...new Set(commands.map(cmd => cmd.name))];

    const categoryEmojis = {
      fun: '<a:Fun_Cmds:1280033969185755247>',
      music: '<a:Music_Cmds:1280034171431026749>',
      settings: '<a:Settings:1280034262183051265>',
      utility: '<:Utilities:1287733735340642305>',
      moderation: '<a:Moderation_Cmds:1287732044071178320>'
    };

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help-menu')
      .setPlaceholder('Jamify Here | Select To Browse')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Home')
          .setValue('home')
          .setDescription('Return to the home page')
          .setEmoji('<:Home_Page:1280034086638846003>'),
        ...categories.map(category =>
          new StringSelectMenuOptionBuilder()
            .setLabel(category.charAt(0).toUpperCase() + category.slice(1))
            .setValue(category)
            .setDescription(`View ${category} commands`)
            .setEmoji(categoryEmojis[category.toLowerCase()])
        )
      );

    const homembed = new EmbedBuilder()
      .setTitle('<:Home_Page:1280034086638846003>  Home')
      .setDescription(`**Hey ${interaction.user} Its Me Jamif!!!**\n`)
      .setAuthor({
        name: 'Jamify',
        iconURL: logo
      })
      .addFields(
        { name: '<:Categories:1287702178974273557>  **__Categories__**', value: '**> <:Fun_Help:1287708149234663435>Fun\n > <:Music_Help:1287708455901204491>Music\n > <:Mod_Help:1287731671235563625>Moderation \n> <:Settings_Help:1287734580996214850>Settings\n > <:Utils_Help:1287733750733475910>Utility**' },
        { name: '<:Links:1287701497072717836>  **__Links__**', value: `> [Dashboard](${website})` }
      )
      .setColor(color)
      .setImage(banner)
      .setFooter({ text: footer, iconURL: logo })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(selectMenu);

    let msg;
    try {
      msg = await interaction.reply({ embeds: [homembed], components: [row], fetchReply: true });
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

      if (interaction.values[0] === 'home') {
        await interaction.update({ embeds: [homembed] });
        return;
      }

      const category = interaction.values[0];
      let categoryCommands = commands
        .filter(cmd => cmd.category === category)
        .map(cmd => `**${cmd.name}**: ${cmd.description}`)
        .join('\n');

      if (categoryCommands.length > 2048) {
        categoryCommands = categoryCommands.substring(0, 2045) + '...';
      }

      const numberOfCommands = commands.filter(cmd => cmd.category === category).length;
      const categoryEmbed = new EmbedBuilder()
        .setTitle(`<:Menu:1286008459204100158>  ${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
        .setAuthor({
          name: 'Jamify',
          iconURL: logo,
          url: website
        })
        .setDescription(categoryCommands ? categoryCommands.split('\n').map(cmd => `<a:Blue_Arrow:1280033714100768779> ${cmd}`).join('\n') : 'No commands available')
        .setColor(color)
        .setImage(banner)
        .setFooter({ text: footer, iconURL: logo })
        .setTimestamp()
        .addFields(
          { name: 'Category', value: category.charAt(0).toUpperCase() + category.slice(1), inline: true },
          { name: 'Number of Commands', value: `${numberOfCommands}`, inline: true },
          { name: 'Use command', value: `/command_name to use any command`, inline: false },
        );

      await interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on('end', async () => {
      const disabledSelectMenu = StringSelectMenuBuilder.from(selectMenu).setDisabled(true);
      const disabledRow = new ActionRowBuilder().addComponents(disabledSelectMenu);
      await msg.edit({ components: [disabledRow] });
    });
  }
};