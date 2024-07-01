module.exports = {
    name: 'rate',
    description: 'Rates a user.',
    category: 'utility',
    execute(message, args) {
        console.log('Executing command: rate');
        const user = message.mentions.users.first() || message.author;
        const rating = Math.floor(Math.random() * 10) + 1;
        message.channel.send(`${user.tag} is rated ${rating}/10.`);
        console.log(`Rated ${user.tag} ${rating}/10`);
    },
};
