module.exports = {
    name: 'kick',
    description: 'Kicks a user.',
    category: 'utility',
    execute(message, args) {
        console.log('Executing command: kick');
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('You do not have permissions to kick members.');
        }
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to kick.');
        }
        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('User not found.');
        }
        const reason = args.slice(1).join(' ') || 'No reason provided';
        member.kick(reason)
            .then(() => {
                message.reply(`Successfully kicked ${user.tag}.`);
                console.log(`Successfully kicked ${user.tag}`);
            })
            .catch(error => {
                console.error('Error kicking user:', error);
                message.reply('Unable to kick user.');
            });
    },
};
