const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const { color } = require('../../../config.json');

module.exports = {
    name: 'purge',
    description: 'Deletes all the messages in that channel',
    category: 'Utility',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const noPermsEmbed = new EmbedBuilder()
                .setColor(color)
                .setDescription('You do not have permissions to manage channels.');
            return message.reply({ embeds: [noPermsEmbed] });
        }

        const channel = message.channel;
        const guild = channel.guild;

        const channelSettings = {
            name: channel.name,
            type: channel.type,
            parent: channel.parent,
            position: channel.position,
            topic: channel.topic,
            nsfw: channel.nsfw,
            rateLimitPerUser: channel.rateLimitPerUser,
            permissionOverwrites: channel.permissionOverwrites.cache.map(overwrite => ({
                id: overwrite.id,
                allow: overwrite.allow.bitfield,
                deny: overwrite.deny.bitfield,
                type: overwrite.type,
            })),
            reason: 'Channel purged by command',
        };

        const confirmEmbed = new EmbedBuilder()
            .setColor(color)
            .setDescription(`Are you sure you want to delete all the messages?`);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary)
            );

        message.reply({ embeds: [confirmEmbed], components: [row] }).then(sentMessage => {
            const filter = i => i.user.id === message.author.id;
            const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'confirm') {
                    await i.deferUpdate();
                    try {
                        await channel.delete();

                        const newChannel = await guild.channels.create({
                            name: channelSettings.name,
                            type: channelSettings.type,
                            parent: channelSettings.parent,
                            position: channelSettings.position,
                            topic: channelSettings.topic,
                            nsfw: channelSettings.nsfw,
                            rateLimitPerUser: channelSettings.rateLimitPerUser,
                            permissionOverwrites: channelSettings.permissionOverwrites,
                            reason: channelSettings.reason,
                        });

                        const successEmbed = new EmbedBuilder()
                            .setColor(color)
                            .setDescription(`Channel ${newChannel.toString()} recreated successfully.`);
                        newChannel.send({ embeds: [successEmbed] });
                    } catch (error) {
                        console.error('Error purging channel:', error);
                        const errorEmbed = new EmbedBuilder()
                            .setColor(color)
                            .setDescription('There was an error trying to purge the channel.');
                        message.reply({ embeds: [errorEmbed] });
                    }
                } else if (i.customId === 'cancel') {
                    await i.deferUpdate();
                    const cancelEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setDescription('Channel purge canceled.');
                    message.reply({ embeds: [cancelEmbed] });
                }
                collector.stop();
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    const timeoutEmbed = new EmbedBuilder()
                        .setColor(color)
                        .setDescription('Confirmation timed out.');
                    message.reply({ embeds: [timeoutEmbed] });
                }
            });
        });
    },
};