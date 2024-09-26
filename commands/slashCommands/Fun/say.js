const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Makes the bot say a specified message.')
        .addStringOption(option => option.setName('message').setDescription('The message to say').setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString('message');

        try {
            await interaction.channel.send(text);
        } catch (error) {
            console.error('Error executing the say command:', error);
            interaction.reply('There was an error trying to execute that command.');
        }
    },
};