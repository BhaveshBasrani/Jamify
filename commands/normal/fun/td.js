const { EmbedBuilder, MessageActionRow, MessageSelectMenu } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'td',
    description: 'Play truth or dare.',
    category: 'fun',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('Truth or Dare')
            .setDescription('Choose truth or dare from the menu below.')
            .setColor('Purple')
            .setFooter({ iconURL: 'https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&' })

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
            .setFooter({ text: 'Daring..', iconURL: 'https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&' });

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
                    .setColor('Blue');
                await i.update({ embeds: [truthEmbed], components: [] });
            } else if (i.values[0] === 'dare') {
                const response = await fetch('https://api.truthordarebot.xyz/api/dare');
                const data = await response.json();
                const dareEmbed = new EmbedBuilder()
                    .setTitle('Dare')
                    .setDescription(data.question)
                    .setColor('Red');
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
