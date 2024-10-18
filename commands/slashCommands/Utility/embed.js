const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { color } = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Embeds any text. (don\'t use external emojis or they won\'t work!)'),

    async execute(interaction) {
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

        await interaction.showModal(modal);

        const filter = i => i.customId === 'embedModal' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.ModalSubmit, time: 15000 });

        collector.on('collect', async i => {
            const text = i.fields.getTextInputValue('embedText');

            const confirmationEmbed = new EmbedBuilder()
                .setDescription('Are you sure you want to send this embed?')
                .setColor(color);

            const confirmButton = new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Primary);

            const cancelButton = new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder()
                .addComponents(confirmButton, cancelButton);

            await i.reply({ embeds: [confirmationEmbed], components: [row] });

            const buttonFilter = btn => btn.user.id === interaction.user.id;
            const buttonCollector = i.channel.createMessageComponentCollector({ buttonFilter, componentType: ComponentType.Button, time: 15000 });

            buttonCollector.on('collect', async btn => {
                if (btn.customId === 'confirm') {
                    const embed = new EmbedBuilder()
                        .setDescription(text)
                        .setColor(color);

                    await interaction.channel.send({ embeds: [embed] });
                    await btn.update({ content: 'Embed sent!', components: [] });
                } else if (btn.customId === 'cancel') {
                    await btn.update({ content: 'Embed creation cancelled.', components: [] });
                }
            });

            buttonCollector.on('end', collected => {
                if (collected.size === 0) {
                    i.editReply({ content: 'No response, embed creation cancelled.', components: [] });
                }
            });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'No response, embed creation cancelled.', components: [] });
            }
        });
    }
};