const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks the bot\'s latency.'),
    async execute(interaction) {
        console.log('Executing slash command: ping');
        await interaction.reply('Pong!');
    },
};