const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { logo, website } = require('../../../config.json');

module.exports = {
    name: 'meme',
    description: 'Fetches a random meme.',
    category: 'fun',
    aliases: ['mem', 'me'],
    async execute(message) {
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
                    url: website
                })
                .setURL(data.postLink)
                .setTitle(data.title)
                .setImage(data.url)
                .addFields(
                    { name: '<:Profile_Cmds:1286008280950374480> **Author**', value: data.author, inline: true },
                    { name: '<a:Upvotes:1287573991992721440> **Upvotes**', value: data.ups.toString(), inline: true },
                )
                .setFooter({ text: `Category: ${data.subreddit}`});
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            if (error.name === 'AbortError') {
                message.channel.send('Request timed out. Please try again later.');
            } else {
                message.channel.send('Failed to fetch a meme. Please try again later.');
            }
        }
    },
};
