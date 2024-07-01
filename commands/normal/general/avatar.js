module.exports = {
    name: 'avatar',
    description: 'Shows a user\'s avatar.',
    category: 'general',
    execute(message, args) {
        console.log('Executing command: avatar');
        const user = message.mentions.users.first() || message.author;
        message.channel.send(user.avatarURL({ dynamic: true, size: 512 }));
    },
};
