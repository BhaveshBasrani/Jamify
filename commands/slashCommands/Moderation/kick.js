const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for kicking')),
    async execute(interaction) {
        console.log('Executing slash command: kick');
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply('You do not have permissions to kick members.');
        }
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.resolve(user);
        if (!member) {
            return interaction.reply('User not found.');
        }
        const reason = interaction.options.getString('reason') || 'No reason provided';
        try {
            await member.kick(reason);
            await interaction.reply(`Successfully kicked ${user.tag}.`);
            console.log(`Successfully kicked ${user.tag}`);
        } catch (error) {
            console.error('Error kicking user:', error);
            await interaction.reply('Unable to kick user.');
        }
    },
};
