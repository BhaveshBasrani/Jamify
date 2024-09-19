const {PermissionsBitField,EmbedBuilder} = require('discord.js')
module.exports = {
    name: 'endpoll',
    description: 'End a currently running poll.',
    aliases: ['epoll', 'closepoll'],
    category: 'utility',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('🚫 Only admins can end polls.');
        }

        const fetchedMessages = await message.channel.messages.fetch({ limit: 10 });
        const pollMessage = fetchedMessages.find(msg => msg.embeds.length && msg.embeds[0].title.includes('🗳️ **Poll**'));

        if (!pollMessage) {
            return message.reply('⚠️ No active poll found.');
        }

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
        const pollQuestion = pollMessage.embeds[0].description;
        const options = pollMessage.embeds[0].fields.map(f => f.value);

        const resultsEmbed = new EmbedBuilder()
            .setTitle('📊 **Poll Results**')
            .setDescription(pollQuestion)
            .setColor('#FF4500')
            .setThumbnail(logo)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        options.forEach((option, index) => {
            const reaction = pollMessage.reactions.cache.get(emojis[index]);
            const voteCount = reaction ? reaction.count - 1 : 0;
            resultsEmbed.addFields({ name: `${emojis[index]} ${option}`, value: `${voteCount} votes`, inline: true });
        });

        await message.channel.send({ embeds: [resultsEmbed] });
        await pollMessage.delete();
    },
};
