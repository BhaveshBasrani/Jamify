const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const {banner, logo} = require('../../../config.json')
module.exports = {
    name: 'endpoll',
    description: 'End a currently running poll and display the results.',
    aliases: ['epoll', 'closepoll', 'terminatepoll', 'stoppoll', 'finishpoll'],
    category: 'Utility',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('🚫 Only admins can end polls.');
        }

        const fetchedMessages = await message.channel.messages.fetch({ limit: 50 });
        const pollMessage = fetchedMessages.find(msg => msg.embeds.length && msg.embeds[0].title.includes('🗳️ **Poll**'));

        if (!pollMessage) {
            return message.reply('⚠️ No active poll found.');
        }

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
        const pollEmbed = pollMessage.embeds[0];
        const pollQuestion = pollEmbed.description;
        const options = pollEmbed.fields.map(f => f.value);

        const serverIcon = message.guild.iconURL();
        const resultsEmbed = new EmbedBuilder()
            .setTitle('📊 **Poll Results**')
            .setDescription(pollQuestion)
            .setColor('#FF4500')
            .setThumbnail(serverIcon)
            .setImage(banner)
            .setFooter({ text: 'Poll ended', iconURL: logo });

        options.forEach((option, index) => {
            const reaction = pollMessage.reactions.cache.get(emojis[index]);
            const voteCount = reaction ? reaction.count - 1 : 0;
            resultsEmbed.addFields({ name: `${emojis[index]} ${option}`, value: `${voteCount} votes`, inline: true });
        });

        await message.channel.send({ embeds: [resultsEmbed] });
        await pollMessage.delete();
    },
};
