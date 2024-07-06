const { EmbedBuilder } = require('discord.js');
const { footer, logo} = require('../../../config.json')

module.exports = {
    name: 'ship',
    description: 'Ship two users together.',
    category: 'fun',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply('Please mention two users to ship.');
        }

        const user1 = message.mentions.users.first();
        const user2 = message.mentions.users.last();

        if (!user1 || !user2) {
            return message.reply('Please mention two valid users to ship.');
        }

        const shipName = user1.username.slice(0, Math.floor(user1.username.length / 2)) + user2.username.slice(Math.floor(user2.username.length / 2));
        const shipPercentage = Math.floor(Math.random() * 100) + 1;
        let description;

        if (shipPercentage > 75) {
            description = 'A match made in heaven! 💖';
        } else if (shipPercentage > 50) {
            description = 'A pretty good match! 😊';
        } else if (shipPercentage > 25) {
            description = 'Could work out with some effort. 🤔';
        } else {
            description = 'Not looking too good... 😕';
        }

        const embed = new EmbedBuilder()
            .setTitle('MATCHMAKING 💕')
            .setDescription(`${user1.username} ❤️ ${user2.username}`)
            .addFields(
                { name: 'Ship Name', value: shipName, inline: true },
                { name: 'Match Percentage', value: `${shipPercentage}%`, inline: true },
                { name: 'Description', value: description }
            )
            .setThumbnail(user1.displayAvatarURL({ dynamic: true }))
            .setImage(user2.displayAvatarURL({ dynamic: true }))
            .setColor('Pink')
            .setFooter({ text: footer , iconURL: logo }); 

        message.channel.send({ embeds: [embed] });
    },
};
