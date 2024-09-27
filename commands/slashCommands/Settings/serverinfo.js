const { EmbedBuilder, ChannelType } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays server information.'),
    async execute(interaction) {
        const { guild } = interaction;
        const fetchedMembers = await guild.members.fetch();
        const botCount = fetchedMembers.filter(member => member.user.bot).size;
        const roles = await guild.roles.fetch();
        const textChannels = await guild.channels.fetch().then(channels => channels.filter(channel => channel.type === ChannelType.GuildText).size);
        const voiceChannels = await guild.channels.fetch().then(channels => channels.filter(channel => channel.type === ChannelType.GuildVoice).size);

        const embed = new EmbedBuilder()
            .setTitle(`__<a:Info_Cmds:1286008578515271710> ${guild.name} Server Information__`)
            .setAuthor({
                name: 'Jamify',
                iconURL: logo,
            })
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '<:People:1288116021743456347>  **__Members__**', value: `> **${guild.memberCount.toLocaleString()}**`, inline: false },
                { name: '<:Bot:1288115849919729756>  **__Bots__**', value: `> **${botCount.toLocaleString()}**`, inline: false },
                { name: '<:Owner:1288115443260719155>  **__Owner__**', value: `> **<@${guild.ownerId}>**`, inline: false },
                { name: '<:People:1288116021743456347>  **__Created On__**', value: `> <t:${Math.floor(guild.createdAt.getTime() / 1000)}:D>`, inline: false },
                { name: '<:Server:1288116464435593226>  **__Region__**', value: `> **${guild.preferredLocale}**`, inline: false },
                { name: '<:Lock:1288116764500033702>  **__Verification Level__**', value: `**> ${guild.verificationLevel}**`, inline: false },
                { name: '<:Text_Channels:1288114783568134164>  **__Text Channels__**', value: `**> ${textChannels.toLocaleString()}**`, inline: false },
                { name: '<:Volume:1288117044369424394>  **__Voice Channels__**', value: `**> ${voiceChannels.toLocaleString()}**`, inline: false },
                { name: '<:Roles:1288115163408633997>  **__Roles__**', value: `**> ${roles.size.toLocaleString()}**`, inline: false },
                { name: '<:Boost:1288117445411868712>  **__Boost Level__**', value: `**> ${guild.premiumTier}**`, inline: false }
            )
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};