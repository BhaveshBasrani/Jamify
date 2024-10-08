const mongoose = require('mongoose');
const { prefix } = require('../config.json');

const serverSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, required: true, default: prefix },
  queue: { type: Array, default: [] },
  roleChannelId: { type: String, required: false },
  roleMessageId: { type: String, required: false },
  roleEmojiPairs: { type: Array, default: [] },
});

module.exports = mongoose.model('ServerSettings', serverSettingsSchema);