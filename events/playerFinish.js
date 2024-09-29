const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer, color } = require('../config.json');

module.exports = {
    name: 'playerFinish',
    async execute(queue) {
            const thankYouEmbed = new EmbedBuilder()
                .setTitle('Thank you for listening!')
                .setDescription('I hope you enjoyed the music! If you have any feedback, please let me know.')
                .setColor(color)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .setFooter(footer)
                .setImage(banner)
                .setTimestamp();

            const channel = queue.metadata.channel; 
            channel.send({ embeds: [thankYouEmbed] });
    },
};