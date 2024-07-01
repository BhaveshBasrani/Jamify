const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Fetches a random meme.'),
    async execute(interaction) {
        try {
            const response = await fetch('https://meme-api.com/gimme');
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setTitle(data.title)
                .setImage(data.url) // Use data.url for the image URL
                .setFooter({text: `Category: ${data.subreddit}`});

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to fetch meme:', error);
            await interaction.reply('Failed to fetch a meme. Please try again later.');
        }
    },
};
