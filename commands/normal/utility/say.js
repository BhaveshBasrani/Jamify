module.exports = {
    name: 'say',
    description: 'Makes the bot say a specified message.',
    category: 'utility',
    execute(message, args) {
        console.log('Executing command: say');
        const text = args.join(' ');
        if (!text) {
            return message.reply('Please provide a message to say.');
        }
        message.delete();
        message.channel.send(text);
    },
};
