const Queue = require('../models/queue.js'); // Adjust the path as needed

module.exports = (client) => {
    client.player.on('end', async (queue) => {
        const guildQueue = await Queue.findOne({ guildId: queue.guild.id });
        if (guildQueue && guildQueue.songs.length > 0) {
            const nextSong = guildQueue.songs.shift();
            await guildQueue.save();
            queue.node.play(nextSong.url);
        }
    });
};
