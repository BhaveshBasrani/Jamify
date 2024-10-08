const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

const userCooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('review')
        .setDescription('Submit a review.')
        .addStringOption(option => option.setName('content').setDescription('The content of your review').setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const now = Date.now();
        const cooldownAmount = 60 * 1000; // 1 minute cooldown

        if (userCooldowns.has(userId)) {
            const expirationTime = userCooldowns.get(userId) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more seconds before submitting another review.`, ephemeral: true });
            }
        }

        userCooldowns.set(userId, now);

        const content = interaction.options.getString('content');

        const serverBanner = interaction.guild.bannerURL();
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.displayName}'s Review`)
            .setDescription(`### ${content} \n Thanks For Your Feedback!`)
            .setThumbnail(interaction.guild.iconURL())
            .setColor(color)
            .setImage(serverBanner ? serverBanner : banner)
            .setFooter({ text: footer, iconURL: logo })
            .setTimestamp();


        await interaction.reply({ embeds: [embed] });

    }
};