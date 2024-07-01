module.exports = {
    name: 'clear',
    description: 'Deletes a specified number of messages.',
    category: 'utility',
    execute(message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permissions to manage messages.');
        }
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('Please specify a number between 1 and 100.');
        }
        message.channel.bulkDelete(amount, true)
            .then(deleted => {
                message.channel.send(`Successfully deleted ${deleted.size} messages.`)
                    .then(msg => setTimeout(() => msg.delete(), 5000));
            })
            .catch(error => {
                console.error('Error deleting messages:', error);
                message.reply('There was an error trying to delete messages in this channel.');
            });
    },
};
