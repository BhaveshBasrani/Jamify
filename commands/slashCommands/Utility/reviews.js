const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { logo, footer, color } = require('../../../config.json');
const GuildConfig = require('../../../models/guildConfig'); // Adjust the path as necessary
const { PermissionsBitField } = require('discord.js');

const userCooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('review')
        .setDescription('Submit a review or setup the review channel.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('submit')
                .setDescription('Submit a review.')
                .addStringOption(option => option.setName('content').setDescription('The content of your review').setRequired(true))
                .addIntegerOption(option => option.setName('rating').setDescription('Your rating (1-5)').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup the review channel.')
                .addChannelOption(option => option.setName('channel').setDescription('The channel to send reviews to').setRequired(true))
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'setup') {
            if (!PermissionsBitField.Flags.Administrator) {
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }

            const channel = interaction.options.getChannel('channel');
            const guildId = interaction.guild.id;

            await GuildConfig.findOneAndUpdate(
                { guildId },
                { reviewChannelId: channel.id },
                { upsert: true, new: true }
            );

            return interaction.reply({ content: `Review channel has been set to ${channel}.`, ephemeral: true });
        }

        if (subcommand === 'submit') {
            const userId = interaction.user.id;
            const now = Date.now();
            const cooldownAmount = 60 * 1000; // 1 minute cooldown

            if (userCooldowns.has(userId)) {
                const expirationTime = userCooldowns.get(userId) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more seconds before submitting another review.`, ephemeral: true });
                }
            }

            userCooldowns.set(userId, now);

            const content = interaction.options.getString('content');
            const rating = interaction.options.getInteger('rating');

            if (rating < 1 || rating > 5) {
                return interaction.reply({ content: 'Please provide a rating between 1 and 5.', ephemeral: true });
            }

            const guildId = interaction.guild.id;
            const guildConfig = await GuildConfig.findOne({ guildId });

            if (!guildConfig || !guildConfig.reviewChannelId) {
                return interaction.reply({ content: 'The review channel is not set up. Please ask an admin to set it up using `/review setup`.', ephemeral: true });
            }

            const reviewChannel = interaction.guild.channels.cache.get(guildConfig.reviewChannelId);

            if (!reviewChannel) {
                return interaction.reply({ content: 'The review channel is not found. Please ask an admin to set it up again using `/review setup`.', ephemeral: true });
            }
const desc = `# <:icons_sentry:1296160435443077182> New Review! 
<a:arrowpurple:1296892754185424966> __**Client:**__ ${interaction.user} 
<a:arrowpurple:1296892754185424966> __**Rating:**__ ${rating}/5 
<a:arrowpurple:1296892754185424966> __**Feedback:**__ 
\`\`\`${content}\`\`\` 
-# <:founder:1293409625751818351> Thank you for your feedback! Please note that troll reviews will be addressed. `
            
const serverBanner = interaction.guild.bannerURL();
            const embed = new EmbedBuilder()
                .setDescription(desc)
                .setThumbnail(interaction.guild.iconURL())
                .setColor(color)
                .setImage(serverBanner || null)
                .setFooter({ text: footer, iconURL: logo })
                .setTimestamp();

            await reviewChannel.send({ embeds: [embed] });
            await interaction.reply({ content: 'Your review has been submitted!', ephemeral: true });
        }
    }
};