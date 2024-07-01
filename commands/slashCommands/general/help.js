const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { category } = require('./userinfo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays all the commands and details about them.')
        .addStringOption(option => 
            option.setName('category')
                .setDescription('The category of commands to display')
                .setRequired(false)
                .addChoices(
                    { name: 'fun', value: 'fun' },
                    { name: 'general', value: 'general' },
                    { name: 'utility', value: 'utility' }
                )),
    async execute(interaction) {
        const { client } = interaction;
        const category = interaction.options.getString('category');

        const commands = client.commands;

        const funCommands = commands.filter(cmd => cmd.category === 'fun').map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');
        const generalCommands = commands.filter(cmd => cmd.category === 'general').map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');
        const utilityCommands = commands.filter(cmd => cmd.category === 'utility').map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('Here are the available commands:')
            .addFields(
                { name: 'Fun Commands', value: funCommands || 'No commands available', inline: false },
                { name: 'General Commands', value: generalCommands || 'No commands available', inline: false },
                { name: 'Utility Commands', value: utilityCommands || 'No commands available', inline: false }
            )
            .setColor(0x0099FF)
            .setImage('https://cdn.discordapp.com/attachments/1083025959659245578/1255924342836170782/standard.gif?ex=667ee631&is=667d94b1&hm=df73dbc902c6b853b57e7f324244e272bda2a84c471d7a2e567f698e68326e35&')
            .setThumbnail('https://cdn.discordapp.com/attachments/1083025959659245578/1256226568997703790/e2e7d7f843961fdb91063a5dac128ccb.png?ex=667fffa9&is=667eae29&hm=17f714a7058d5c68e731d76e12fafa94cce4af9d0a2992ad4fad2a5b47af464c&')
            .setFooter({ text: '© 2024 Jamify All rights reserved.', iconURL: 'https://cdn.discordapp.com/attachments/1083025959659245578/1256226568997703790/e2e7d7f843961fdb91063a5dac128ccb.png?ex=667fffa9&is=667eae29&hm=17f714a7058d5c68e731d76e12fafa94cce4af9d0a2992ad4fad2a5b47af464c&' });

        await interaction.reply({ embeds: [embed] });
    },
};
