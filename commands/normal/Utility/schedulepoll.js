const { scheduleJob } = require('node-schedule');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const {color} = require('../../../config.json')
module.exports = {
    name: 'schedulepoll',
    description: 'Schedule a poll for a later time.',
    aliases: ['schedulepoll', 'delayedpoll', 'futurepoll'],
    category: 'Utility',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('🚫 Only admins can schedule polls.');
        }

        const time = args[0]; // Time format: 'YYYY-MM-DD HH:mm:ss'
        const question = args.slice(1).join(' ');

        if (!time || !question) {
            return message.reply('⚠️ Provide a time and a poll question with options separated by semicolons.');
        }

        const [pollQuestion, ...pollOptions] = question.split(';').map(o => o.trim());
        if (pollOptions.length < 2) {
            return message.reply('⚠️ At least two options are required for a poll.');
        }

        scheduleJob(time, async () => {
            const maxOptions = 6;
            const optionsToUse = pollOptions.slice(0, maxOptions);
            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

            const pollEmbed = new EmbedBuilder()
                .setTitle('🗳️ **Scheduled Poll**')
                .setDescription(pollQuestion)
                .setColor(color)
                .setThumbnail('https://example.com/logo.png') // Replace with actual logo URL
                .setImage('https://example.com/banner.png') // Replace with actual banner URL
                .setFooter({ text: 'Poll Footer', iconURL: 'https://example.com/logo.png' }); // Replace with actual footer text and logo URL

            optionsToUse.forEach((option, index) => {
                pollEmbed.addFields({ name: `${emojis[index]} Option ${index + 1}`, value: option });
            });

            const pollMessage = await message.channel.send({ embeds: [pollEmbed] });
            for (let i = 0; i < optionsToUse.length; i++) {
                await pollMessage.react(emojis[i]);
            }
        });

        message.reply(`✅ Poll scheduled for ${time} with the question: **${pollQuestion}**`);
    },
};
