const mongoose = require('mongoose');
const { prefix } = require('../config.json');

const serverSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: Object, required: true, default: { text: prefix } },
  queue: { type: Array, default: [] }
});

module.exports = mongoose.model('ServerSettings', serverSettingsSchema);