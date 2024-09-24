const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const GuildConfig = require('../../../models/guildConfig.js'); // Adjust the path as needed
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'report',
    description: 'Reports a user.',
    category: 'Moderation',
    aliases: ['rep', 'complain'],
    async execute(message) {
        console.log('Executing command: report');
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Please mention a user to report.');
        }

        const guildId = message.guild.id;
        const guildConfig = await GuildConfig.findOne({ guildId });
        const logChannelId = guildConfig?.logChannelId;

        if (!logChannelId) {
            return message.reply('Log channel not set. Please configure a log channel for audit logs.');
        }

        const confirmEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle('Confirm Report')
            .setImage(banner)
            .setDescription(`Are you sure you want to report <@${user.id}>?`);

        const confirmButton = new ButtonBuilder()
            .setCustomId('confirmReport')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancelReport')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const actionRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

        const confirmMessage = await message.reply({ embeds: [confirmEmbed], components: [actionRow] });

        const filter = i => i.user.id === message.author.id;
        const collector = confirmMessage.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'confirmReport') {
                // No need to update the interaction after showing the modal
                // Create a modal for the reason
                const modal = new ModalBuilder()
                    .setCustomId('reportReasonModal')
                    .setTitle('Report Reason');

                const reasonInput = new TextInputBuilder()
                    .setCustomId('reportReasonInput')
                    .setLabel('Reason for reporting')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false);

                const modalActionRow = new ActionRowBuilder().addComponents(reasonInput);
                modal.addComponents(modalActionRow);

                await interaction.showModal(modal).catch(console.error);

                // Handle the modal submission
                const modalInteraction = await interaction.awaitModalSubmit({ time: 60000 }).catch(console.error);
                if (modalInteraction) {
                    const reason = modalInteraction.fields.getTextInputValue('reportReasonInput') || 'No reason provided';

                    const reportEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('User Reported')
                        .setImage(banner)
                        .setAuthor({
                            name: 'Jamify',
                            iconURL: logo,
                        })
                        .setDescription(`<@${user.id}> has been reported by <@${message.author.id}> for: ${reason}`)
                        .setTimestamp()
                        .setFooter({ text: footer, iconUrl: logo });

                    const logChannel = message.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        await logChannel.send({ embeds: [reportEmbed] });
                    } else {
                        console.error(`Log channel with ID ${logChannelId} not found.`);
                    }

                    const owner = await message.guild.fetchOwner();
                    if (owner) {
                        await owner.send({ embeds: [reportEmbed] }).catch(error => {
                            console.error('Failed to send DM to the server owner:', error);
                        });
                    }

                    // Reply only once after modal submission
                    await modalInteraction.reply({ embeds: [reportEmbed], ephemeral: true });

                    // Delete the report message and the user's command message
                    await confirmMessage.delete().catch(console.error);
                    await message.delete().catch(console.error);

                    confirmMessage.edit({ components: [new ActionRowBuilder().addComponents(confirmButton.setDisabled(true), cancelButton.setDisabled(true))] });
                }
            } else if (interaction.customId === 'cancelReport') {
                await interaction.update({ content: 'Report cancelled.', components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                confirmMessage.edit({ content: 'Report timed out.', components: [] });
            }
        });
    }
};
