const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'meme',
    description: 'Fetches a random meme.',
    category: 'fun',
    async execute(message) {
        console.log('Executing command: meme');
        try {
            const res = await fetch('https://meme-api.com/gimme');
            const data = await res.json();
            const embed = new EmbedBuilder()
                .setTitle(data.title)
                .setImage(data.url)
                .setFooter({ text: `Category: ${data.subreddit}`})
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.channel.send('Failed to fetch a meme. Please try again later.');
        }
    },
};
