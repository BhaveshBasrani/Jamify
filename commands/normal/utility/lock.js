module.exports = {
    name: 'lock',
    description: 'Locks the current channel.',
    category: 'utility',
    execute(message) {
        console.log('Executing command: lock');
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.reply('You do not have permissions to manage channels.');
        }
        message.channel.permissionOverwrites.create(message.guild.id, { SEND_MESSAGES: false })
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
