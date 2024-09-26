const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('td')
        .setDescription('Play truth or dare.'),
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Truth or Dare')
                .setDescription('Choose truth or dare from the menu below.')
                .setColor(color)
                .setFooter({ text: footer, iconURL: logo });

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('truthordare')
                        .setPlaceholder('Select an option')
                        .addOptions([
                            {
                                label: 'Truth',
                                description: 'Get a truth question.',
                                value: 'truth',
                            },
                            {
                                label: 'Dare',
                                description: 'Get a dare.',
                                value: 'dare',
                            },
                        ])
                );

            const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

            const filter = i => i.customId === 'truthordare' && i.user.id === interaction.user.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                try {
                    if (i.values[0] === 'truth') {
                        const response = await fetch('https://api.truthordarebot.xyz/api/truth');
                        const data = await response.json();
                        const truthEmbed = new EmbedBuilder()
                            .setTitle('Truth')
                            .setDescription(data.question)
                            .setColor(color)
                            .setFooter({ text: footer, iconURL: logo });

                        await i.update({ embeds: [truthEmbed], components: [] });

                        const answer = await interaction.followUp('Please respond with your answer to the truth question.');

                        const answerFilter = m => m.author.id === interaction.user.id;
                        const answerCollector = interaction.channel.createMessageCollector({ filter: answerFilter, time: 30000, max: 1 });

                        answerCollector.on('collect', async m => {
                            try {
                                const answerEmbed = new EmbedBuilder()
                                    .setTitle('Truth Answer')
                                    .setDescription(m.content)
                                    .setColor(color)
                                    .setFooter({ text: footer, iconURL: logo });

                                await interaction.followUp({ embeds: [answerEmbed] });
                            } catch (error) {
                                console.error(error);
                                await interaction.followUp({ content: 'An error occurred. Please try again.', ephemeral: true });
                            }
                        });
                    } else if (i.values[0] === 'dare') {
                        const response = await fetch('https://api.truthordarebot.xyz/api/dare');
                        const data = await response.json();
                        const dareEmbed = new EmbedBuilder()
                            .setTitle('Dare')
                            .setDescription(data.question)
                            .setColor(color)
                            .setFooter({ text: footer, iconURL: logo });

                        await i.update({ embeds: [dareEmbed], components: [] });

                        const answer = await interaction.followUp('Please respond with your answer to the dare.');

                        const answerFilter = m => m.author.id === interaction.user.id;
                        const answerCollector = interaction.channel.createMessageCollector({ filter: answerFilter, time: 30000, max: 1 });

                        answerCollector.on('collect', async m => {
                            try {
                                const answerEmbed = new EmbedBuilder()
                                    .setTitle('Dare Answer')
                                    .setDescription(m.content)
                                    .setColor(color)
                                    .setFooter({ text: footer, iconURL: logo });

                                await interaction.followUp({ embeds: [answerEmbed] });
                            } catch (error) {
                                console.error(error);
                                await interaction.followUp({ content: 'An error occurred. Please try again.', ephemeral: true });
                            }
                        });
                    }
                } catch (error) {
                    console.error(error);
                    await i.reply({ content: 'An error occurred. Please try again.', ephemeral: true });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    msg.edit({ components: [] });
                }
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred. Please try again.', ephemeral: true });
        }
    },
};