
const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    logChannelId: { type: String },
    pingRoleId: { type: String },
});

const GuildConfig = mongoose.model('GuildConfig', guildConfigSchema);

module.exports = GuildConfig;
