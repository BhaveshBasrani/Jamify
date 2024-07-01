const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Checks the bot\'s latency.',
    category: 'general',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('Ping')
            .setDescription(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms.`)
            .setColor('Yellow')
            .setImage( 'https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&' )
            .setThumbnail('https://cdn.discordapp.com/attachments/1083025959659245578/1256226568997703790/e2e7d7f843961fdb91063a5dac128ccb.png?ex=667fffa9&is=667eae29&hm=17f714a7058d5c68e731d76e12fafa94cce4af9d0a2992ad4fad2a5b47af464c&')
            .setFooter({ text: '© 2024 Jamify All rights reserved.', iconURL:'https://cdn.discordapp.com/attachments/1083025959659245578/1256226568997703790/e2e7d7f843961fdb91063a5dac128ccb.png?ex=667fffa9&is=667eae29&hm=17f714a7058d5c68e731d76e12fafa94cce4af9d0a2992ad4fad2a5b47af464c&'});

        message.channel.send({ embeds: [embed] });
    },
};
