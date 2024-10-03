const ServerSettings = require('../models/ServerSettings');
const { EmbedBuilder } = require('discord.js');
const {adbanner, color, logo, footer} = require('../config.json')

let messageCounter = 0;

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        // Increment the message counter
        messageCounter++;

        // Check if the message counter is divisible by 4
        if (messageCounter % 4 === 0) {
            const adEmbed = new MessageEmbed()
                .setTitle('Advertisement')
                .setDescription('This is an ad. This Helps Us Maintain Run Jamify Check out the best hosting server!')
                .setColor(color)
                .setImage(adbanner)
                .setFooter({text: footer , iconURL: logo})

            const adMessage = await message.channel.send({ embeds: [adEmbed] });

            // Delete the ad message after 10 seconds
            setTimeout(() => adMessage.delete(), 10000);
        }

        // Fetch server settings from the database
        const serverSettings = await ServerSettings.findOne({ guildId: message.guild.id });
        const prefix = serverSettings && serverSettings.prefix ? serverSettings.prefix : require('../config.json').prefix;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
        }
    },
};