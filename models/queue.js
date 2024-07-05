const { Schema, model } = require('mongoose');

const songSchema = new Schema({
    title: String,
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
    songs: [songSchema]
});

module.exports = model('Queue', queueSchema);
