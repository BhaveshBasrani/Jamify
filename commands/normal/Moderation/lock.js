const { PermissionsBitField } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'lock',
    description: 'Locks the current channel.',
    category: 'Moderation',
    aliases: ['lockchannel', 'channellock'],
    execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('You do not have permissions to manage channels.');
        }

        // Set the SEND_MESSAGES permission to false
        message.channel.permissionOverwrites.create(message.guild.id, {
            SEND_MESSAGES: false,
        })
            .then(() => {
            const embed = new EmbedBuilder()
                .setTitle('Channel Locked')
                .setDescription(`This channel has been locked until someone unlocks it.\n\n**Locked by:** ${message.author.tag}`)
                .setColor(color)
                .setImage(banner)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
            })
            .catch(error => {
                console.error('Error locking channel:', error);
                message.reply('There was an error trying to lock the channel.');
            });
    },
};
