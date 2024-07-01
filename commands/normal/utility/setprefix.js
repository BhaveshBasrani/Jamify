const { EmbedBuilder } = require('discord.js');
const ServerSettings = require('../../../models/ServerSettings.js');

module.exports = {
    name: 'setprefix',
    description: 'Sets a custom prefix for the server.',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        const newPrefix = args[0];
        if (!newPrefix) {
            return message.reply('Please provide a new prefix.');
        }

        await ServerSettings.findOneAndUpdate(
            { guildId: message.guild.id },
            { prefix: newPrefix },
            { new: true, upsert: true }
        );

        const embed = new EmbedBuilder()
            .setTitle('Prefix Updated')
            .setDescription(`The prefix has been updated to \`${newPrefix}\`.`)
            .setColor('GREEN');

        message.channel.send({ embeds: [embed] });
    },
};
