module.exports = {
    name: 'report',
    description: 'Reports a user.',
    category: 'utility',
    execute(message, args) {
        console.log('Executing command: report');
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to report.');
        }
        const reason = args.slice(1).join(' ') || 'No reason provided';
        message.channel.send(`Reported ${user.tag} for: ${reason}`);
        console.log(`Reported ${user.tag} for: ${reason}`);
    },
};
