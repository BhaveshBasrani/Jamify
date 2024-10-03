const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { logo, banner, footer, color } = require('../../../config.json');
const ServerSettings = require('../../models/ServerSettings.js'); // Add this line

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

        const serverSettings = await ServerSettings.findOne({ guildId: message.guild.id });
        serverSettings.twentyFourSeven = !serverSettings.twentyFourSeven;
        await serverSettings.save();

        const voiceChannel = message.member.voice.channel;
        const guildId = message.guild.id;
        const channelId = voiceChannel.id;
        const adapterCreator = message.guild.voiceAdapterCreator;

        if (serverSettings.twentyFourSeven) {
            try {
                const connection = joinVoiceChannel({
                    channelId,
                    guildId,
                    adapterCreator,
                });

                const stayEmbed = new EmbedBuilder()
                    .setTitle('**Staying in Voice Channel**')
                    .setImage(banner)
                    .setDescription('I will now stay in this voice channel indefinitely, ensuring I am always here for your music needs!\n\n*Note: This is NOT a premium feature.*')
                    .setColor(color)
                    .setFooter({ text: footer, iconURL: logo });
                message.reply({ embeds: [stayEmbed] });

                connection.on('stateChange', (oldState, newState) => {
                    if (newState.status === 'disconnected' && serverSettings.twentyFourSeven) {
                        joinVoiceChannel({
                            channelId,
                            guildId,
                            adapterCreator,
                        });
                    }
                });
            } catch (error) {
                console.error(error);
                message.reply('There was an error connecting to the voice channel.');
            }
        } else {
            const leaveEmbed = new EmbedBuilder()
                .setTitle('**Leaving Voice Channel**')
                .setImage(banner)
                .setDescription('I will no longer stay in the voice channel indefinitely. Use the command again if you need me to stay.')
                .setColor(color)
                .setFooter({ text: footer, iconURL: logo });
            message.reply({ embeds: [leaveEmbed] });

            const connection = getVoiceConnection(guildId);
            if (connection) {
                connection.destroy();
            }
        }
    },
};