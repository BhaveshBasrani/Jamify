const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    logChannelId: { type: String },
    pingRoleId: { type: String },
    reviewChannelId: { type: String }, // New field for review channel
});

const GuildConfig = mongoose.model('GuildConfig', guildConfigSchema);

module.exports = GuildConfig;