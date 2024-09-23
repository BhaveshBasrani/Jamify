const { PermissionsBitField } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'unlock',
    description: 'Unlocks the current channel.',
    category: 'Moderation',
    aliases: ['unlockchannel', 'channelunlock'],
    execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('You do not have permissions to manage channels.');
        }

        // Set the SEND_MESSAGES permission to true
        message.channel.permissionOverwrites.create(message.guild.id, {
            SEND_MESSAGES: true,
        })
            .then(() => {
            const embed = new EmbedBuilder()
                .setTitle('Channel Unlocked')
                .setDescription(`This channel has been unlocked.\n\n**Unlocked by:** ${message.author.tag}`)
                .setColor(0x00ff00)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
            })
            .catch(error => {
                console.error('Error unlocking channel:', error);
                message.reply('There was an error trying to unlock the channel.');
            });
    },
};
