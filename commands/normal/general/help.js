const { EmbedBuilder } = require('discord.js');
const { banner, logo, footer } = require('../../../config.json')

module.exports = {
    name: 'help',
    description: 'Displays all the commands and details about them.',
    category: 'general',
    async execute(message) {
        const { commands } = message.client;

        const funCommands = commands.filter(cmd => cmd.category === 'fun').map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');
        const generalCommands = commands.filter(cmd => cmd.category === 'general').map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');
        const utilityCommands = commands.filter(cmd => cmd.category === 'utility').map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');
        const musicCommands = commands.filter(cmd => cmd.category === 'music').map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('Here are the available commands:')
            .addFields(
                { name: 'Fun Commands', value: funCommands || 'No commands available', inline: false },
                { name: 'General Commands', value: generalCommands || 'No commands available', inline: false },
                { name: 'Utility Commands', value: utilityCommands || 'No commands available', inline: false },
                { name: 'Music Commands', value: musicCommands || 'No commands available', inline: false}
            )
            .setColor(0x0099FF)
            .setImage( banner )
            .setFooter({ text: footer , iconURL: logo });

        message.channel.send({ embeds: [embed] });
    },
};
