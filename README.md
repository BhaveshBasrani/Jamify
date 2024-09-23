
# Jamify

Jamify is a Discord bot designed to enhance your server's music experience. With Jamify, you can easily play, pause, skip, and manage your music queue with simple commands.

<img src="https://s1.gifyu.com/images/SAq2p.gif" alt="Banner" style="width:100%;"/>

## Features

- **Play Music**: Stream music from various sources.
- **Queue Management**: Add, remove, and view songs in the queue.
- **Control Playback**: Play, pause, skip, and stop songs.
- **User-Friendly Commands**: Easy-to-use commands for seamless interaction.

## Commands

- `..play <song>`: Play a song or add it to the queue.
- `..pause`: Pause the current song.
- `..resume`: Resume the paused song.
- `..skip`: Skip to the next song in the queue.
- `..queue`: Display the current music queue.
- `..stop`: Stop the music and clear the queue.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/BhaveshBasrani/Jamify.git
    ```
2. Install dependencies:
    ```sh
    cd Jamify
    npm install
    ```
3. Configure your bot token in the `config.json` file:
    ```json
    {
        "token": "YOUR_DISCORD_BOT_TOKEN",
        "prefix": "..",
        "clientId": "YOUR_CLIENT_ID",
        "guildId": "YOUR_GUILD_ID",
        "giphyk": "YOUR_GIPHY_API_KEY",
        "mongodb": "YOUR_MONGODB_CONNECTION_STRING",
        "clientSecret": "YOUR_CLIENT_SECRET",
        "spotifyClientId": "YOUR_SPOTIFY_CLIENT_ID",
        "spotifyClientSecret": "YOUR_SPOTIFY_CLIENT_SECRET",
        "banner": "YOUR_BANNER_URL",
        "logo": "YOUR_LOGO_URL",
        "footer": "© 2024 Jamify All rights reserved.",
        "auth": "YOUR_AUTH_TOKEN",
        "geniusApiToken": "YOUR_GENIUS_API_TOKEN",
        "groqkey": "YOUR_GROQ_KEY",
        "website": "https://yourjamify.tech"
    }
    ```

4. Start the bot:
    ```sh
    npm start
    ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, feel free to open an issue or contact the maintainer.

Visit our website: [Jamify](https://yourjamify.tech)

<img src="https://i.ibb.co/107ptbV/standard-1.gif" alt="Logo" style="width:100%;"/>

