const { PermissionsBitField } = require("discord.js");
const GuildConfig = require('../../../models/guildConfig.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogchannel')
        .setDescription('Set the log channel and specify whom to ping (ping is optional)')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to set as the log channel')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to ping (optional)')
                .setRequired(false)),
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply('Only users with Administrator permissions can set the log channel.');
            }

            const logChannel = interaction.options.getChannel('channel');
            if (!logChannel) {
                return interaction.reply('Please mention a valid channel to set as the log channel.');
            }

            const pingRole = interaction.options.getRole('role');

            await saveConfigToDB(interaction.guild.id, logChannel.id, pingRole?.id);
            interaction.reply('Log channel and ping role set successfully.');
        } catch (error) {
            handleError(error, interaction);
        }
    },
};

async function saveConfigToDB(guildId, logChannelId, pingRoleId) {
    await GuildConfig.findOneAndUpdate(
        { guildId },
        { logChannelId, pingRoleId },
        { upsert: true }
    );
}

function handleError(error, interaction) {
    console.error('Error:', error);
    interaction.reply('There was an error setting the log channel and ping role.');
}