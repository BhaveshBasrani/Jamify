const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Ship two users together.')
        .addUserOption(option => option.setName('user1').setDescription('First user').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('Second user').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply(); // Deferring the reply

        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');

        const shipName = user1.username.slice(0, Math.floor(user1.username.length / 2)) + user2.username.slice(Math.floor(user2.username.length / 2));
        const shipPercentage = Math.floor(Math.random() * 100) + 1;
        let description;

        if (shipPercentage > 75) {
            description = 'A match made in heaven! 💖';
        } else if (shipPercentage > 50) {
            description = 'A pretty good match! 😊';
        } else if (shipPercentage > 25) {
            description = 'Could work out with some effort. 🤔';
        } else {
            description = 'Not looking too good... 😕';
        }

        const ship = await new canvafy.Ship()
            .setAvatars(user1.displayAvatarURL({ forceStatic: true, extension: 'png' }), user2.displayAvatarURL({ forceStatic: true, extension: 'png' }))
            .setBackground('image', 'https://wallpaperaccess.com/full/6304464.jpg')
            .setBorder('#C658E5')
            .setCustomNumber(shipPercentage)
            .setOverlayOpacity(0.5)
            .build();

        const buffer = Buffer.from(ship);

        const embed = new EmbedBuilder()
            .setTitle('MATCHMAKING <a:Ship_Cmd:1286008211765198928>')
            .setDescription(`<@${user1.id}> <a:Ship_Cmd:1286008211765198928> <@${user2.id}>`)
            .addFields(
                { name: 'Ship Name', value: shipName, inline: true },
                { name: 'Match Percentage', value: `${shipPercentage}%`, inline: true },
                { name: 'Description', value: description }
            )
            .setImage('attachment://ship.png')
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo });

        // Editing the deferred reply instead of replying directly
        await interaction.editReply({ embeds: [embed], files: [{ attachment: buffer, name: 'ship.png' }] });
    }
};
