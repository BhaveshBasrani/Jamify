module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        let activities = [
            { name: 'Jamify | NCS on Twitch', type: 1, url: 'https://www.twitch.tv/ncsvibes', details: 'Streaming NCS music', state: 'Enjoying the vibes' },
            { name: 'Jamify | Music on Spotify', type: 1, url: 'https://open.spotify.com/track/7MXVkk9YMctZqd1Srtv4MB', details: 'Listening to music', state: 'Chilling with tunes' },
            { name: 'Jamify | Coding on GitHub', type: 1, url: 'https://github.com/BhaveshBasrani/Jamify', details: 'Coding a project', state: 'Building something cool' },
            { name: 'Jamify | Gaming on Discord', type: 1, url: 'https://discord.gg/r8pVRq9SqA', details: 'Playing games', state: 'Having fun with friends' },
            { name: 'Jamify | MrBeast on YouTube', type: 1, url: 'https://www.youtube.com/user/mrbeast6000', details: 'Watching MrBeast', state: 'Enjoying the content' },
            { name: 'Jamify | to ..help', type: 2, details: 'Type ..help for commands', state: 'Ready to assist' },
        ];

        let currentIndex = 0;

        setInterval(() => {
            client.user.setPresence({
                activities: [activities[currentIndex]],
            });

            currentIndex = (currentIndex + 1) % activities.length;
        }, 3000); // 1000ms = 1 second
    }
}