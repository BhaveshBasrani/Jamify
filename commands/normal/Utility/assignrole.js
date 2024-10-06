const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { logo, banner, footer, color } = require('../../../config.json');

module.exports = {
    name: 'assignrole',
    description: 'Assigns roles based on your choice.',
    category: 'Utility',
    aliases: ['assign_role', 'role_assign', 'ar'],
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (args.length % 2 !== 0 || args.length === 0) {
            return message.reply('Please provide pairs of role IDs or mentions and emojis. Usage: <prefix>assignrole <roleID1|@role1> <emoji1> <roleID2|@role2> <emoji2> ...');
        }

        const roleEmojiPairs = [];
        for (let i = 0; i < args.length; i += 2) {
            let roleId = args[i];
            const emoji = args[i + 1];

            // Check if the argument is a role mention
            const roleMentionMatch = roleId.match(/^<@&(\d+)>$/);
            if (roleMentionMatch) {
                roleId = roleMentionMatch[1];
            }

            try {
                const role = await message.guild.roles.fetch(roleId);
                if (!role) {
                    return message.reply(`Role with ID or mention "${args[i]}" not found.`);
                }
                roleEmojiPairs.push({ role, emoji });
            } catch (error) {
                return message.reply(`Failed to fetch role with ID or mention "${args[i]}".`);
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('Select a role from the menu below!')
            .setImage(banner)
            .setDescription(roleEmojiPairs.map(pair => `<a:Blue_Arrow:1280033714100768779> <@&${pair.role.id}> - ${pair.emoji} `).join('\n'))
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo });

        const options = roleEmojiPairs.map(pair => ({
            label: pair.role.name,
            value: pair.role.id,
            emoji: pair.emoji
        }));

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select-role')
                    .setPlaceholder('Select Your Favourite Role | Jamify ')
                    .addOptions(options)
            );

        const msg = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = interaction => interaction.customId === 'select-role' && !interaction.user.bot;
        const collector = msg.createMessageComponentCollector({ filter });

        collector.on('collect', async interaction => {
            const roleId = interaction.values[0];
            const role = await message.guild.roles.fetch(roleId);
            const member = message.guild.members.cache.get(interaction.user.id);

            if (!role || !member) return;

            try {
                await member.roles.add(role);
                await interaction.reply({ content: `You have been given the role <@&${role.id}>.`, ephemeral: true });
            } catch (error) {
                console.error('Error adding role:', error);
                await interaction.reply({ content: 'There was an error while assigning the role. Please try again later.', ephemeral: true });
            }
        });

        collector.on('end', () => {
            console.log('Role selection collector has ended.');
        });
    },
};
