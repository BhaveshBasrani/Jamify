const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { logo, banner, footer } = require('../../../config.json');

module.exports = {
    name: 'setpoll',
    description: 'Create a poll with permission check.',
    category: 'Utility',
    aliases: ['poll', 'createpoll', 'startpoll'],
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('🚫 Only admins can create polls.');
        }

        const question = args.join(' ');
        if (!question) {
            return message.reply('⚠️ Please provide a poll question and options separated by semicolons.');
        }

        const [pollQuestion, ...pollOptions] = question.split(';').map(o => o.trim());
        if (pollOptions.length < 2) {
            return message.reply('⚠️ Please provide at least two options for the poll.');
        }

        const maxOptions = 6;
        const optionsToUse = pollOptions.slice(0, maxOptions);
        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

        const embed = new EmbedBuilder()
            .setTitle('🗳️ **Poll**')
            .setDescription(pollQuestion)
            .setColor('#00FF7F')
            .setThumbnail(logo)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        optionsToUse.forEach((option, index) => {
            embed.addFields({ name: `${emojis[index]} Option ${index + 1}`, value: option });
        });

        const pollMessage = await message.channel.send({ embeds: [embed] });
        for (let i = 0; i < optionsToUse.length; i++) {
            await pollMessage.react(emojis[i]);
        }
    },
};
