const { PermissionsBitField } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { logo, banner, footer, color } = require('../../../config.json');
module.exports = {
    name: 'unlock',
    description: 'Unlocks the current channel.',
    category: 'Moderation',
    aliases: ['unlockchannel', 'channelunlock'],
    execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('You do not have permissions to manage channels.');
        }

        message.channel.permissionOverwrites.create(message.channel.guild.roles.everyone, {
            SendMessages: true,
        })
            .then(() => {
            const embed = new EmbedBuilder()
                .setTitle('Channel Unlocked')
                .setDescription(`This channel has been unlocked.\n\n**Unlocked by:** ${message.author.tag}`)
                .setColor(color)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
            })
            .catch(error => {
                console.error('Error unlocking channel:', error);
                message.reply('There was an error trying to unlock the channel.');
            });
    },
};
