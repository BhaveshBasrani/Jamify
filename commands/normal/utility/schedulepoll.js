const { scheduleJob } = require('node-schedule');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'schedulepoll',
    description: 'Schedule a poll for a later time.',
    aliases: ['spolltime', 'delayedpoll'],
    category: 'utility',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('🚫 Only admins can schedule polls.');
        }

        const time = args[0];  // Time format: 'YYYY-MM-DD HH:mm:ss'
        const question = args.slice(1).join(' ');

        if (!time || !question) {
            return message.reply('⚠️ Provide a time and a poll question with options separated by semicolons.');
        }

        const [pollQuestion, ...pollOptions] = question.split(';').map(o => o.trim());
        if (pollOptions.length < 2) {
            return message.reply('⚠️ At least two options are required for a poll.');
        }

        const job = scheduleJob(time, async function () {
            const maxOptions = 6;
            const optionsToUse = pollOptions.slice(0, maxOptions);
            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

            const pollEmbed = new EmbedBuilder()
                .setTitle('🗳️ **Scheduled Poll**')
                .setDescription(pollQuestion)
                .setColor('#00FF7F')
                .setThumbnail(logo)
                .setImage(banner)
                .setFooter({ text: footer, iconURL: logo });

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
