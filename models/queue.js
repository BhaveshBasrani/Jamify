const { Schema, model } = require('mongoose');

const songSchema = new Schema({
  title: String,
  duration: String,
  author: String,
  url: String,
  thumbnail: String,
  requestedBy: String,
  channelId: String,
  voiceChannelId: String
});

const queueSchema = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  currentTrack: songSchema,
  songs: [songSchema],
  twentyFourSeven: {
    type: Boolean,
    default: false
  },
  djRole: {
    type: String,
    default: null
  }
});

module.exports = model('Queue', queueSchema);