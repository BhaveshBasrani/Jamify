const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Fetches a random meme.'),
    async execute(interaction) {
        console.log('Executing command: meme');
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, 5000); // 5 seconds timeout

            const res = await fetch('https://meme-api.com/gimme', { signal: controller.signal });
            clearTimeout(timeout);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: 'Jamify',
                    iconURL: logo,
                })
                .setURL(data.postLink)
                .setColor(color)
                .setTitle(data.title)
                .setImage(data.url)
                .addFields(
                    { name: '<:Profile_Cmds:1286008280950374480> **Author**', value: data.author, inline: true },
                    { name: '<a:Upvotes:1287573991992721440> **Upvotes**', value: data.ups.toString(), inline: true },
                )
                .setFooter({ text: `Category: ${data.subreddit}`});
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            if (error.name === 'AbortError') {
                interaction.reply('Request timed out. Please try again later.');
            } else {
                interaction.reply('Failed to fetch a meme. Please try again later.');
            }
        }
    },
};