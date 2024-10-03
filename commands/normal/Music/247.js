const { EmbedBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

let stayInChannel = false;

module.exports = {
    name: '247',
    description: 'Toggles the bot to stay in the voice channel forever.',
    category: 'Music',
    aliases: ['stay', 'forever', 'vc'],
    async execute(message) {
        if (!message.member.voice.channel) {
            const noVoiceChannel = new EmbedBuilder()
                .setTitle('**Not in a Voice Channel**')
                .setImage(banner)
                .setDescription('You need to join a voice channel first to use this command!')
                .setColor(color)
                .setFooter({ text: footer, iconURL: logo });
            return message.reply({ embeds: [noVoiceChannel] });
        }

        stayInChannel = !stayInChannel;

        if (stayInChannel) {
            const connection = await message.member.voice.channel.join();
            const stayEmbed = new EmbedBuilder()
                .setTitle('**Staying in Voice Channel**')
                .setImage(banner)
                .setDescription('I will now stay in this voice channel indefinitely, ensuring I am always here for your music needs!')
                .setColor(color)
                .setFooter({ text: footer, iconURL: logo });
            message.reply({ embeds: [stayEmbed] });

            connection.on('disconnect', () => {
                if (stayInChannel) {
                    message.member.voice.channel.join();
                }
            });
        } else {
            const leaveEmbed = new EmbedBuilder()
                .setTitle('**Leaving Voice Channel**')
                .setImage(banner)
                .setDescription('I will no longer stay in the voice channel indefinitely. Use the command again if you need me to stay.')
                .setColor(color)
                .setFooter({ text: footer, iconURL: logo });
            message.reply({ embeds: [leaveEmbed] });

            if (message.guild.me.voice.channel) {
                message.guild.me.voice.channel.leave();
            }
        }
    },
};