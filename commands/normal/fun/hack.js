const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'hack',
    description: 'Simulate a terrifyingly realistic hack on a user.',
    aliases: ['phack', 'scaryhack', 'targethack'],
    category: 'fun',
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) return message.reply('⚠️ You must mention a user to hack.');

        const hackEmbed = new EmbedBuilder()
            .setTitle(`🛡️ Initiating hack on ${user.username}...`)
            .setColor('#FF0000')
            .setFooter({ text: 'Warning: This is highly classified!', iconURL: message.author.displayAvatarURL() });

        const msg = await message.channel.send({ embeds: [hackEmbed] });

        setTimeout(() => {
            hackEmbed.setTitle(`⚠️ Breaching ${user.username}'s firewalls...`);
            msg.edit({ embeds: [hackEmbed] });
        }, ms('2s'));

        setTimeout(() => {
            hackEmbed.setTitle('🗝️ Retrieving login credentials...');
            msg.edit({ embeds: [hackEmbed] });
        }, ms('4s'));

        setTimeout(() => {
            hackEmbed.setTitle('🔍 Searching for sensitive data... Found!');
            msg.edit({ embeds: [hackEmbed] });
        }, ms('6s'));

        setTimeout(() => {
            hackEmbed.setTitle('💾 Downloading personal files... [Progress: 10%]');
            msg.edit({ embeds: [hackEmbed] });
        }, ms('8s'));

        setTimeout(() => {
            hackEmbed.setTitle('💾 Downloading personal files... [Progress: 40%]');
            msg.edit({ embeds: [hackEmbed] });
        }, ms('10s'));

        setTimeout(() => {
            hackEmbed.setTitle('💾 Downloading personal files... [Progress: 80%]');
            msg.edit({ embeds: [hackEmbed] });
        }, ms('12s'));

        setTimeout(() => {
            hackEmbed.setTitle('💾 Download complete! Data secured.');
            msg.edit({ embeds: [hackEmbed] });
        }, ms('14s'));

        setTimeout(() => {
            hackEmbed.setTitle('⚠️ Injecting malware into their system...');
            msg.edit({ embeds: [hackEmbed] });
        }, ms('16s'));

        setTimeout(() => {
            hackEmbed.setTitle('🖥️ Accessing camera feed...');
            msg.edit({ embeds: [hackEmbed] });
        }, ms('18s'));

        setTimeout(() => {
            hackEmbed.setTitle(`💻 ${user.username}'s system is now fully compromised.`);
            msg.edit({ embeds: [hackEmbed] });
        }, ms('20s'));

        setTimeout(() => {
            const finalEmbed = new EmbedBuilder()
                .setTitle('💀 **HACK COMPLETE**')
                .setDescription(`All data from ${user.username} has been stolen. The operation is complete.`)
                .setColor('#000000');

            msg.edit({ embeds: [finalEmbed] });
        }, ms('22s'));

        setTimeout(() => {
            const jokeEmbed = new EmbedBuilder()
                .setTitle('😂 Just Kidding!')
                .setDescription(`Relax, ${user.username}. No real hacking happened! It was all a joke!`)
                .setColor('#00FF00')
                .setFooter({ text: 'Don\'t worry! Your data is safe.', iconURL: message.author.displayAvatarURL() });

            msg.edit({ embeds: [jokeEmbed] });
        }, ms('26s'));
    },
};
