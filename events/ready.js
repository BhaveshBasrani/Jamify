module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        let activities = [
            { name: 'Jamify | NCS on Twitch', type: 1, url: 'https://www.twitch.tv/ncsvibes' },
            { name: 'Jamify | Music on Spotify', type: 2, url: 'https://open.spotify.com/track/7MXVkk9YMctZqd1Srtv4MB' },
            { name: 'Jamify | Coding on GitHub', type: 0, url: 'https://github.com/BhaveshBasrani/Jamify' },
            { name: 'Jamify | Gaming on Discord', type: 3, url: 'https://discord.gg/r8pVRq9SqA' },
            { name: 'Jamify | MrBeast on YouTube', type: 5, url: 'https://www.youtube.com/user/mrbeast6000'},
            { name: 'Jamify | to ..help', type: 2 },
        ];

        let currentIndex = 0;

        setInterval(() => {
            client.user.setPresence({
                activities: [activities[currentIndex]],
            });

            currentIndex = (currentIndex + 1) % activities.length;
        }, 3000); // 1000ms = 1 seconds
    }
}