const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js'); // Adjust the path as needed
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'report',
    description: 'Reports a user.',
    category: 'Moderation',
    aliases: ['rep', 'complain'],
    async execute(message, args) {
        console.log('Executing command: report');
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to report.');
        }
        const reason = args.slice(1).join(' ') || 'No reason provided';

        // Get the log channel ID from the database (assuming you've stored it)
        const guildId = message.guild.id;
        const guildConfig = await GuildConfig.findOne({ guildId });
        const logChannelId = guildConfig?.logChannelId;

        if (!logChannelId) {
            return message.reply('Log channel not set. Please configure a log channel for audit logs.');
        }
        
        const reportEmbed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('User Reported')
        .setDescription(`<@${user.id}> has been reported by <@${message.author.id}> for: ${reason}`)
        .setTimestamp()
        .setFooter({ text: footer, iconUrl: logo });

        // Send the report message to the log channel
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            logChannel.send({ embeds: [reportEmbed] });
        } else {
            console.error(`Log channel with ID ${logChannelId} not found.`);
        }

        // Send DM to the server owner
        const owner = await message.guild.fetchOwner();
        if (owner) {
            owner.send({ embeds: [reportEmbed] }).catch(error => {
                console.error('Failed to send DM to the server owner:', error);
            });
        } else {
            console.error('Server owner not found.');
        }

        message.reply({ embeds: [reportEmbed] });
    },
};
// Send DM to the reported user
user.send({ embeds: [reportEmbed] }).catch(error => {
    console.error('Failed to send DM to the reported user:', error);
});

// Create a modal for the reason

const modal = new ModalBuilder()
    .setCustomId('reportReasonModal')
    .setTitle('Report Reason');

const reasonInput = new TextInputBuilder()
    .setCustomId('reportReasonInput')
    .setLabel('Reason for reporting')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

const actionRow = new ActionRowBuilder().addComponents(reasonInput);
modal.addComponents(actionRow);

// Show the modal to the user
await message.showModal(modal);

// Handle the modal submission
message.client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'reportReasonModal') {
        const reason = interaction.fields.getTextInputValue('reportReasonInput');
        reportEmbed.setDescription(`<@${user.id}> has been reported by <@${message.author.id}> for: ${reason}`);
        
        // Send the updated report message to the log channel
        if (logChannel) {
            logChannel.send({ embeds: [reportEmbed] });
        } else {
            console.error(`Log channel with ID ${logChannelId} not found.`);
        }

        // Send the updated report message to the server owner
        if (owner) {
            owner.send({ embeds: [reportEmbed] }).catch(error => {
                console.error('Failed to send DM to the server owner:', error);
            });
        } else {
            console.error('Server owner not found.');
        }

        // Send the updated report message to the reported user
        user.send({ embeds: [reportEmbed] }).catch(error => {
            console.error('Failed to send DM to the reported user:', error);
        });

        // Send the updated report message to the command issuer
        interaction.reply({ embeds: [reportEmbed], ephemeral: true });
    }
});