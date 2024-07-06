const { EmbedBuilder, MessageActionRow, MessageSelectMenu } = require('discord.js');
const fetch = require('node-fetch');
const { footer , logo} = require('../../../config.json')

module.exports = {
    name: 'td',
    description: 'Play truth or dare.',
    category: 'fun',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('Truth or Dare')
            .setDescription('Choose truth or dare from the menu below.')
            .setColor('Purple')
            .setFooter({ text: footer , iconURL: logo })

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
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
            )
            .setFooter({ text: footer , iconURL: logo })

        const msg = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'truthordare' && i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.values[0] === 'truth') {
                const response = await fetch('https://api.truthordarebot.xyz/api/truth');
                const data = await response.json();
                const truthEmbed = new EmbedBuilder()
                    .setTitle('Truth')
                    .setDescription(data.question)
                    .setColor('Blue')
                    .setFooter({ text: footer , iconURL: logo });
                    
                await i.update({ embeds: [truthEmbed], components: [] });
            } else if (i.values[0] === 'dare') {
                const response = await fetch('https://api.truthordarebot.xyz/api/dare');
                const data = await response.json();
                const dareEmbed = new EmbedBuilder()
                    .setTitle('Dare')
                    .setDescription(data.question)
                    .setColor('Red')
                    .setFooter({ text: footer , iconURL: logo });
                await i.update({ embeds: [dareEmbed], components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                msg.edit({ components: [] });
            }
        });
    },
};
