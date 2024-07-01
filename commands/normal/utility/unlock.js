module.exports = {
    name: 'unlock',
    description: 'Unlocks the current channel.',
    category: 'utility',
    execute(message) {
        console.log('Executing command: unlock');
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.reply('You do not have permissions to manage channels.');
        }
        message.channel.permissionOverwrites.create(message.guild.id, { SEND_MESSAGES: true })
            .then(() => {
                message.reply('Channel unlocked.');
                console.log('Channel unlocked.');
            })
            .catch(error => {
                console.error('Error unlocking channel:', error);
                message.reply('There was an error trying to unlock the channel.');
            });
    },
};
