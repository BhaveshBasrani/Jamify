const { category } = require("../general/uptime");

module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    category: 'utility',
    execute(message, args) {
        console.log('Executing command: ban');
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('You do not have permissions to ban members.');
        }
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to ban.');
        }
        const member = message.guild.members.resolve(user);
        if (!member) {
            return message.reply('User not found.');
        }
        const reason = args.slice(1).join(' ') || 'No reason provided';
        member.ban({ reason })
            .then(() => {
                message.reply(`Successfully banned ${user.tag}.`);
                console.log(`Successfully banned ${user.tag}`);
            })
            .catch(error => {
                console.error('Error banning user:', error);
                message.reply('Unable to ban user.');
            });
    },
};
