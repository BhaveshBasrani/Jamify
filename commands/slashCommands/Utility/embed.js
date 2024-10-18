const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { color } = require('../../../config.json');

const data = new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Embeds any text. (don\'t use external emojis or they won\'t work!)');

async function execute(interaction) {
    const confirmationEmbed = new EmbedBuilder()
        .setDescription('Are you sure you want to create an embed?')
        .setColor(color);

    const confirmButton = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Primary);

    const cancelButton = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

    await interaction.reply({ embeds: [confirmationEmbed], components: [row] });

    const buttonFilter = btn => btn.user.id === interaction.user.id;
    const buttonCollector = interaction.channel.createMessageComponentCollector({ filter: buttonFilter, componentType: ComponentType.Button, time: 15000 });

    buttonCollector.on('collect', async btn => {
        if (btn.customId === 'confirm') {
            const modal = new ModalBuilder()
                .setCustomId('embedModal')
                .setTitle('Embed Text Input');

            const textInput = new TextInputBuilder()
                .setCustomId('embedText')
                .setLabel('Text to Embed')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(textInput);
            modal.addComponents(actionRow);

            await btn.showModal(modal);

            try {
                const modalInteraction = await btn.awaitModalSubmit({ time: 60000 });
                if (modalInteraction) {
                    const text = modalInteraction.fields.getTextInputValue('embedText');

                    const finalEmbed = new EmbedBuilder()
                        .setDescription(text)
                        .setColor(color)

                    await modalInteraction.reply({ embeds: [finalEmbed], fetchReply: true });
                }
            } catch (error) {
                console.error('An unexpected error occurred:', error);
            }
        } else if (btn.customId === 'cancel') {
            await btn.update({ content: 'Embed creation cancelled.', components: [] });
        }
    });

    buttonCollector.on('end', async collected => {
        if (collected.size === 0) {
            try {
                await interaction.editReply({ content: 'No response, embed creation cancelled.', components: [] });
            } catch (error) {
                console.error('Failed to edit reply:', error);
            }
        }
    });
}

module.exports = { data, execute };