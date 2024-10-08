const { EmbedBuilder } = require('discord.js');
const { logo, banner, website, footer, color } = require('../../../config.json');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite-me')
        .setDescription('Provides the invite link for the bot'),
    async execute(interaction) {
        const inviteEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle('<a:Invite_Me:1280034135947083826> Invite Me')
            .setDescription('<:S_BlueEvent:1280034204637335676> Click the button below to invite me to your server!')
            .setAuthor({
                name: 'Jamify',
                iconURL: logo
            })
            .setImage(banner)
            .setTimestamp()
            .setFooter({ text: footer });

        const inviteButton = new ButtonBuilder()
            .setLabel('Invite Me')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/oauth2/authorize?client_id=1082711487828734002&permissions=8&response_type=code&redirect_uri=https%3A%2F%2Fwww.yourjamify.tech%2F&integration_type=0&scope=bot+applications.commands+identify`);

        const row = new ActionRowBuilder().addComponents(inviteButton);

        await interaction.reply({ embeds: [inviteEmbed], components: [row] });
    },
};