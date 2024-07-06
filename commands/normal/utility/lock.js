const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'lock',
    description: 'Locks the current channel.',
    category: 'utility',
    execute(message) {
        console.log('Executing command: lock');
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('You do not have permissions to manage channels.');
        }

        // Set the SEND_MESSAGES permission to false
        message.channel.permissionOverwrites.create(message.guild.id, {
            SEND_MESSAGES: false,
        })
            .then(() => {
                message.reply('Channel locked.');
                console.log('Channel locked.');
            })
            .catch(error => {
                console.error('Error locking channel:', error);
                message.reply('There was an error trying to lock the channel.');
            });
    },
};
