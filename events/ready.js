module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        // Change the bot's status
        client.user.setPresence({
            activities: [{
                name: 'NCS on Twitch',
                type: 4, // Listening
                url: 'https://www.twitch.tv/ncs' // URL of the Twitch channel
            }],
            status: 'dnd'
        });
    }
}