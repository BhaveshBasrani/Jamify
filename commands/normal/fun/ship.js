const { EmbedBuilder } = require('discord.js');

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
            .setFooter({ text: 'SHIPP!!!', iconURL: 'https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&' }); // Placeholder for the rectangle GIF URL

        message.channel.send({ embeds: [embed] });
    },
};
