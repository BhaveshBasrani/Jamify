const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { color } = require('../../../config.json')
module.exports = {
    name: 'rate',
    description: 'Allows a user to rate another user.',
    category: 'Utility',
    aliases: ['review', 'evaluate', 'score'],
    async execute(message) {
        console.log('Executing command: rate');

        // Check if the user mentioned someone
        if (!message.mentions.users.size) {
            return message.reply('you need to mention a user to rate!');
        }

        const rater = message.author;
        const ratedUser = message.mentions.users.first();

        // Prevent users from rating themselves
        if (rater.id === ratedUser.id) {
            return message.reply(`${message.author} You can't rate yourself!`);
        }

        // Create five star buttons
        const starButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('star_1').setLabel('⭐').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('star_2').setLabel('⭐').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('star_3').setLabel('⭐').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('star_4').setLabel('⭐').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('star_5').setLabel('⭐').setStyle(ButtonStyle.Primary)
        );

        // Send the buttons to the channel
        const ratingMessage = await message.channel.send({ content: 'Rate the user by clicking on the stars:', components: [starButtons] });

        // Create a message collector to handle button interactions
        const filter = (interaction) => interaction.isButton() && interaction.message.id === ratingMessage.id && interaction.user.id === rater.id;
        const collector = ratingMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (interaction) => {
            const rating = parseInt(interaction.customId.split('_')[1]);
            await interaction.update({ content: `You rated ${ratedUser.tag} ${rating}/5 stars!`, components: [] });

            // Create an embed message for a better visual presentation
            const embed = new EmbedBuilder()
            .setTitle('User Rating')
            .setDescription(`${rater.tag} rated ${ratedUser.tag}`)
            .addFields({ name: 'Rating', value: `${rating}/5` })
            .setColor(color)
            .setTimestamp();

            // Send the embed message to the channel
            await message.channel.send({ embeds: [embed] });

            console.log(`${rater.tag} rated ${ratedUser.tag} ${rating}/5 stars`);
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                ratingMessage.edit({ content: 'Rating timed out.', components: [] });
            }
        });

    },
};
