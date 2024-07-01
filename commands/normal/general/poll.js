const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'poll',
    description: 'Creates a poll with reactions.',
    category: 'general',
    async execute(message, args) {
        console.log('Executing command: poll');
        
        const question = args.join(' ');
        if (!question) {
            return message.reply('Please provide a question for the poll.');
        }

        // Split the question and options
        const [pollQuestion, ...pollOptions] = question.split(';').map(option => option.trim());

        if (!pollOptions.length) {
            return message.reply('Please provide options for the poll separated by semicolons.');
        }

        // Limit to 6 options
        const maxOptions = 6;
        const optionsToUse = pollOptions.slice(0, maxOptions);

        // Default emojis for up to 6 options
        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

        const embed = new EmbedBuilder()
            .setTitle('Poll')
            .setDescription(pollQuestion)
            .setColor('#00AAFF');

        // Add options to the embed
        optionsToUse.forEach((option, index) => {
            embed.addFields({ name: `${emojis[index]} Option ${index + 1}`, value: option });
        })
        .setImage( 'https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&' )
        .setThumbnail('https://cdn.discordapp.com/attachments/1083025959659245578/1256226568997703790/e2e7d7f843961fdb91063a5dac128ccb.png?ex=667fffa9&is=667eae29&hm=17f714a7058d5c68e731d76e12fafa94cce4af9d0a2992ad4fad2a5b47af464c&')
        .setFooter({ text: '© 2024 Jamify All rights reserved.', iconURL:'https://cdn.discordapp.com/attachments/1083025959659245578/1256226568997703790/e2e7d7f843961fdb91063a5dac128ccb.png?ex=667fffa9&is=667eae29&hm=17f714a7058d5c68e731d76e12fafa94cce4af9d0a2992ad4fad2a5b47af464c&'});
        const pollMessage = await message.channel.send({ embeds: [embed] });

        // Add reactions based on available options
        for (let i = 0; i < optionsToUse.length; i++) {
            await pollMessage.react(emojis[i]);
        }

        // Collect reactions
        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot;
        const collector = pollMessage.createReactionCollector({ filter, dispose: true });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        });

        collector.on('remove', (reaction, user) => {
            console.log(`Removed ${reaction.emoji.name} from ${user.tag}`);
        });

        collector.on('end', collected => {
            const resultsEmbed = new EmbedBuilder()
                .setTitle('Poll Results')
                .setDescription(pollQuestion)
                .setColor('#00AAFF')
                .setFooter({ iconURL: 'https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&' });

            // Add results for each option
            optionsToUse.forEach((option, index) => {
                resultsEmbed.addFields({ name: `${emojis[index]} ${option}`, value: `${collected.get(emojis[index]) ? collected.get(emojis[index]).users.cache.size - 1 : 0} votes`, inline: true });
            });

            message.channel.send({ embeds: [resultsEmbed] });
        });
    },
};
