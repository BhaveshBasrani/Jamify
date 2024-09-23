const { EmbedBuilder } = require('discord.js');
const { logo, footer } = require('../../../config.json');

module.exports = {
    name: 'avatar',
    description: 'Shows a user\'s avatar.',
    category: 'Settings',
    aliases: ['profilepic', 'pfp', 'profile', 'picture', 'pic'],
    async execute(message, args) {
        try {
            console.log('Executing command: avatar');
            const user = message.mentions.users.first() || message.author;
            const avatarURL = user.avatarURL({ dynamic: true, size: 512 });

            if (!avatarURL) {
                return message.channel.send('User does not have an avatar.');
            }

            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s Avatar`)
                .setDescription(`[Avatar URL](${avatarURL})`)
                .setImage(avatarURL)
                .setColor('Red')
                .setFooter({ text: footer, iconURL: logo })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing avatar command:', error);
            message.channel.send('An error occurred while executing the command.');
        }
    },
};
