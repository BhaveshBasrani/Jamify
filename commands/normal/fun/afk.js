const { Collection, Events } = require('discord.js');
const afkCollection = new Collection();

module.exports = {
    name: 'afk',
    category: 'fun',
    description: 'Toggle AFK status with a custom message and notify others when mentioned.',
    aliases: ['away', 'brb', 'gone'],
    async execute(message, args) {
        const userId = message.author.id;

        // Toggle AFK off if the user is already AFK
        if (afkCollection.has(userId)) {
            afkCollection.delete(userId);
            return message.reply(`👋 **Your AFK status has been removed.** Welcome back, ${message.author.username}!`);
        }

        // Set AFK status with an optional reason
        const reason = args.join(' ') || 'no reason';
        afkCollection.set(userId, reason);
        return message.reply(`💤 You're now AFK: ${reason}`);
    },
};

// AFK Mention Check
module.exports.handleMentions = async (message) => {
    if (message.author.bot) return;  // Ignore bot messages

    // Check if any mentioned users are AFK
    const mentionedUsers = message.mentions.users;

    mentionedUsers.forEach(user => {
        if (afkCollection.has(user.id)) {
            const reason = afkCollection.get(user.id);
            message.reply(`💤 ${message.mentions.user} **is currently AFK:** ${reason}`);
        }
    });
};
