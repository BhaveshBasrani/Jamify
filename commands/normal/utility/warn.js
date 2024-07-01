module.exports = {
    name: 'warn',
    description: 'Issues a warning to a user.',
    category: 'utility',
    execute(message, args) {
        console.log('Executing command: warn');
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('You do not have permissions to warn members.');
        }
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to warn.');
        }
        const reason = args.slice(1).join(' ') || 'No reason provided';
        message.channel.send(`${user.tag} has been warned for: ${reason}`);
        console.log(`Warned ${user.tag} for: ${reason}`);
    },
};
