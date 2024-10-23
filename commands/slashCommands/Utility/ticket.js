const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const TicketSetup = require('../../../models/Ticket.js');
const { color } = require('../../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket management commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup the ticket system'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('panel')
                .setDescription('Show the ticket panel')),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'setup') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor(color)
                .setDescription('## Permission Denied');
            return interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
            const modal = new ModalBuilder()
                .setCustomId('ticketSetupModal')
                .setTitle('Ticket Setup');

            const categoryInput = new TextInputBuilder()
                .setCustomId('categoryInput')
                .setLabel('Ticket Categories (comma separated)')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const prefixInput = new TextInputBuilder()
                .setCustomId('prefixInput')
                .setLabel('Ticket Prefix')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const panelEmbedInput = new TextInputBuilder()
                .setCustomId('panelEmbedInput')
                .setLabel('Panel Embed Description')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const managementPanelEmbedInput = new TextInputBuilder()
                .setCustomId('managementPanelEmbedInput')
                .setLabel('Management Panel Embed Description')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const emojiInput = new TextInputBuilder()
                .setCustomId('emojiInput')
                .setLabel('Category Emojis (comma separated)')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const categoryIdInput = new TextInputBuilder()
                .setCustomId('categoryIdInput')
                .setLabel('Category ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const adminRoleIdInput = new TextInputBuilder()
                .setCustomId('adminRoleIdInput')
                .setLabel('Admin Role ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(categoryInput),
                new ActionRowBuilder().addComponents(prefixInput),
                new ActionRowBuilder().addComponents(panelEmbedInput),
                new ActionRowBuilder().addComponents(managementPanelEmbedInput),
                new ActionRowBuilder().addComponents(emojiInput),
                new ActionRowBuilder().addComponents(categoryIdInput),
                new ActionRowBuilder().addComponents(adminRoleIdInput)
            );

            await interaction.showModal(modal);

            const filter = (i) => i.customId === 'ticketSetupModal' && i.user.id === interaction.user.id;
            interaction.awaitModalSubmit({ filter, time: 60000000 })
                .then(async (modalInteraction) => {
                const categories = modalInteraction.fields.getTextInputValue('categoryInput').split(',').map(cat => cat.trim());
                const prefix = modalInteraction.fields.getTextInputValue('prefixInput');
                const panelEmbedDescription = modalInteraction.fields.getTextInputValue('panelEmbedInput');
                const managementPanelEmbedDescription = modalInteraction.fields.getTextInputValue('managementPanelEmbedInput');
                const emojis = modalInteraction.fields.getTextInputValue('emojiInput').split(',').map(emoji => emoji.trim());
                const categoryId = modalInteraction.fields.getTextInputValue('categoryIdInput');
                const adminRoleId = modalInteraction.fields.getTextInputValue('adminRoleIdInput');

                // Save to MongoDB
                const ticketSetup = new TicketSetup({
                    guildId: interaction.guild.id,
                    categories,
                    prefix,
                    panelEmbedDescription,
                    managementPanelEmbedDescription,
                    emojis,
                    categoryId,
                    adminRoleId
                });

                await ticketSetup.save();

                const embed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('Ticket Setup Information')
                    .setDescription(`**Categories:** ${categories.join(', ')}\n**Prefix:** ${prefix}\n**Panel Embed Description:** ${panelEmbedDescription}\n**Management Panel Embed Description:** ${managementPanelEmbedDescription}\n**Emojis:** ${emojis.join(', ')}\n**Category ID:** ${categoryId}\n**Admin Role ID:** ${adminRoleId}`)
                    .setFooter({ text: 'Footer text' });

                // Send the embed with the collected data
                await modalInteraction.reply({ embeds: [embed] });
                })
                .catch(err => {
                console.error(err);
                const timeoutEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setDescription('## Modal Timed Out');
                interaction.followUp({ embeds: [timeoutEmbed], ephemeral: true });
                });
            }
        } else if (subcommand === 'panel') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor(color)
                .setDescription('## Permission Denied');
            return interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
            const ticketSetup = await TicketSetup.findOne({ guildId: interaction.guild.id });
            if (!ticketSetup) {
                const embed = new EmbedBuilder()
                .setColor(color)
                .setDescription('## The ticket system has not been set up yet. Please use `/ticket setup` first.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const embed = new EmbedBuilder()
                .setColor(color)
                .setDescription(ticketSetup.panelEmbedDescription);

            const selectMenu = new ActionRowBuilder()
                .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticketCategorySelect')
                    .setPlaceholder('Select a category')
                    .addOptions(ticketSetup.categories.map((category, index) => ({
                    label: category,
                    value: category,
                    emoji: ticketSetup.emojis[index] // Fetch the corresponding emoji
                    })))
                );

            await interaction.reply({ embeds: [embed], components: [selectMenu] });

            const filter = (i) => i.customId === 'ticketCategorySelect' && i.user.id === interaction.user.id;

            const startCollector = () => {
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

                collector.on('collect', async (i) => {
                const selectedCategory = i.values[0];
                await i.deferUpdate();

                // Create a private channel
                const ticketNumber = await TicketSetup.countDocuments({ guildId: interaction.guild.id }) + 1;
                const channelName = `${ticketSetup.prefix}-${ticketNumber.toString().padStart(4, '0')}`;
                const channel = await interaction.guild.channels.create({
                    name: channelName,
                    type: 'GUILD_TEXT',
                    topic: `${selectedCategory} ticket for <@${interaction.user.id}>`,
                    parent: ticketSetup.categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id: ticketSetup.adminRoleId,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                        },
                    ],
                });

                const ticketCreatedEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`## Ticket Created! \n__**Category:**__ ${selectedCategory}\n__**Channel:**__ ${channel}`);

                await i.followUp({ embeds: [ticketCreatedEmbed], ephemeral: true });

                // Send the management panel embed with Claim and Close buttons
                const managementPanelEmbed = new EmbedBuilder()
                    .setColor(color)
                    .setDescription(ticketSetup.managementPanelEmbedDescription);

                const claimButton = new ButtonBuilder()
                    .setCustomId('claimTicket')
                    .setLabel('Claim')
                    .setStyle(ButtonStyle.Primary);

                const closeButton = new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger);
                    const buttonFilter = (i) => ['claimTicket', 'closeTicket'].includes(i.customId);
                    const buttonCollector = channel.createMessageComponentCollector({ filter: buttonFilter });

                    buttonCollector.on('collect', async (i) => {
                        if (i.customId === 'claimTicket') {
                            const claimedEmbed = new EmbedBuilder()
                                .setColor(color)
                                .setDescription(`## Hey ${interaction.user}! ${i.user} has claimed your ticket!`);

                            await i.reply({ embeds: [claimedEmbed] });
                        } else if (i.customId === 'closeTicket') {
                            if (!i.member.roles.cache.has(ticketSetup.adminRoleId)) {
                                return i.reply({ content: 'Only admins can close the ticket.', ephemeral: true });
                            }

                            await i.reply({ content: 'This ticket will be closed.', ephemeral: true });
                            await channel.delete();
                        }
                    });

                    // Keep the collector running indefinitely
                    buttonCollector.on('end', (_, reason) => {
                        if (reason !== 'channelDelete') {
                            buttonCollector.resetTimer();
                        }
                    });

                    channel.on('deleted', () => {
                        buttonCollector.stop('channelDelete');
                    });

                    // Handle the close ticket reason modal
                    const closeTicketReasonModal = new ModalBuilder()
                        .setCustomId('closeTicketReasonModal')
                        .setTitle('Close Ticket Reason');

                    const reasonInput = new TextInputBuilder()
                        .setCustomId('reasonInput')
                        .setLabel('Reason for closing the ticket')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true);

                    closeTicketReasonModal.addComponents(
                        new ActionRowBuilder().addComponents(reasonInput)
                    );

                    const closeTicketFilter = (i) => i.customId === 'closeTicketReasonModal' && i.user.id === interaction.user.id;

                    buttonCollector.on('collect', async (i) => {
                        if (i.customId === 'claimTicket') {
                            const claimedEmbed = new EmbedBuilder()
                                .setColor(color)
                                .setDescription(`## Hey ${interaction.user}! ${i.user} has claimed your ticket!`);

                            await i.reply({ embeds: [claimedEmbed] });
                        } else if (i.customId === 'closeTicket') {
                            if (!i.member.roles.cache.has(ticketSetup.adminRoleId)) {
                                return i.reply({ content: 'Only admins can close the ticket.', ephemeral: true });
                            }

                            await i.showModal(closeTicketReasonModal);

                            i.awaitModalSubmit({ filter: closeTicketFilter, time: 60000 })
                                .then(async (modalInteraction) => {
                                    const reason = modalInteraction.fields.getTextInputValue('reasonInput');

                                    const closedEmbed = new EmbedBuilder()
                                        .setColor(color)
                                        .setDescription(`## Ticket Closed! \n__**Reason:**__ ${reason}`);

                                    await modalInteraction.reply({ embeds: [closedEmbed], ephemeral: true });

                                    const notifyEmbed = new EmbedBuilder()
                                        .setColor(color)
                                        .setDescription(`## Your ticket has been closed for the following reason: \n__**Reason:**__ ${reason}`);

                                    await interaction.user.send({ embeds: [notifyEmbed] });
                                    await i.user.send({ embeds: [notifyEmbed] });

                                    await channel.delete();
                                })
                                .catch(err => {
                                    console.error(err);
                                    const timeoutEmbed = new EmbedBuilder()
                                        .setColor(color)
                                        .setDescription('## Modal Timed Out');
                                    i.followUp({ embeds: [timeoutEmbed], ephemeral: true });
                                });
                        }
                    });
                    const createTranscript = async (channel) => {
                        const messages = await channel.messages.fetch({ limit: 100 });
                        const transcript = messages.map(m => `${m.author.tag}: ${m.content}`).reverse().join('\n');
                        return transcript;
                    };

                    buttonCollector.on('end', async (_, reason) => {
                        if (reason !== 'channelDelete') {
                            buttonCollector.resetTimer();
                        } else {
                            const transcript = await createTranscript(channel);
                            const transcriptEmbed = new EmbedBuilder()
                                .setColor(color)
                                .setTitle('Ticket Transcript')
                                .setDescription(`Transcript for ticket ${channel.name}`)
                                .setFooter({ text: 'Footer text' });

                            await interaction.user.send({ embeds: [transcriptEmbed], files: [{ attachment: Buffer.from(transcript, 'utf-8'), name: `${channel.name}_transcript.txt` }] });
                            await i.user.send({ embeds: [transcriptEmbed], files: [{ attachment: Buffer.from(transcript, 'utf-8'), name: `${channel.name}_transcript.txt` }] });
                        }
                    });

                const actionRow = new ActionRowBuilder()
                    .addComponents(claimButton, closeButton);

                await channel.send(`${interaction.user} | <@${ticketSetup.adminRoleId}>`);
                await channel.send({ embeds: [managementPanelEmbed], components: [actionRow] });
                });

                startCollector();

                collector.on('end', collected => {
                if (collected.size === 0) {
                    startCollector(); 
                    interaction.followUp({ content: 'No category was selected in time.', ephemeral: true });
                }
                });
            };
            }
        }
    }
};
