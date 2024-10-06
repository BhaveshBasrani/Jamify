const mongoose = require('mongoose');
const { prefix } = require('../config.json');

const serverSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: Object, required: true, default: { text: prefix } },
  queue: { type: Array, default: [] },
  twentyFourSeven: { type: Boolean, default: false },
  voiceChannelId: { type: String, required: false }
});

module.exports = mongoose.model('ServerSettings', serverSettingsSchema);