const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const { Player , useMainPlayer} = require('discord-player');
const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei");
const { SpotifyExtractor } = require('@discord-player/extractor');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ServerSettings = require('./models/ServerSettings.js');
const { token, mongodb, banner, logo, footer, auth } = require('./config.json');
const commandHandler = require('./handlers/commandHandler.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

const player = useMainPlayer();

player.extractors.register(YoutubeiExtractor, {
    authentication: auth,
    streamOptions: {
      useClient: "ANDROID"}
});
player.extractors.register(SpotifyExtractor, {
    createStream: createYoutubeiStream
});

player.events.on('audioTracksAdd', (queue) => {
    // Emitted when the player adds multiple songs to its queue
    queue.metadata.send(`Multiple Track's queued`);
});

player.events.on('playerSkip', (queue, track) => {
    // Emitted when the audio player fails to load the stream for a song
    queue.metadata.send(`Skipping **${track.title}** due to an issue!`);
});

player.events.on('emptyChannel', (queue) => {
    // Bot will automatically leave the voice channel with this event
    queue.metadata.send(`Leaving because no vc activity for the past 5 minutes`);
});
player.events.on('emptyQueue', (queue) => {
    // Emitted when the player queue has finished
    queue.metadata.send('Queue finished!');
});
player.events.on('error', (queue, error) => {
    // Emitted when the player queue encounters error
    console.log(`General player error event: ${error.message}`);
    console.log(error);
});
player.events.on('playerError', (queue, error) => {
    // Emitted when the audio player errors while streaming audio track
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});

// Connect to MongoDB
mongoose.connect(mongodb, {
    authSource: 'admin', // Specify the authentication database if needed
})
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Failed to connect to MongoDB', err));

// Load normal commands
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands/normal'));
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, `commands/normal/${folder}`)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/normal/${folder}/${file}`);
        client.commands.set(command.name, command);
        if (command.aliases) {
            for (const alias of command.aliases) {
                client.commands.set(alias, command);
            }
        }
    }
}

// Load slash commands
const slashCommandFolders = fs.readdirSync(path.join(__dirname, 'commands/slashCommands'));
for (const folder of slashCommandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, `commands/slashCommands/${folder}`)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/slashCommands/${folder}/${file}`);
        client.slashCommands.set(command.data.name, command);
    }
}

// Load event handlers
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

commandHandler(client);

client.on('messageCreate', async (message) => {
    if (message.type !== 0 || message.author.bot) return;

const serverSettings = await ServerSettings.findOne({ guildId: message.guild.id });
// Use the default prefix if no custom prefix is set
const prefix = serverSettings && serverSettings.prefix ? serverSettings.prefix : require('./config.json').prefix;


if (message.content.toLowerCase() === `<@${client.user.id}>` || message.content.toLowerCase() === `<@!${client.user.id}>`) {
    const embed = new EmbedBuilder()
        .setTitle('Heyy!!! Am Jamify')
        .setDescription(`My prefix in this server is \`${prefix}\`. Use ${prefix}help for more info.`)
        .setColor('Blue')
        .setImage(banner)
        .setFooter({ text: footer, iconURL: logo });

    message.channel.send({ embeds: [embed] });
}
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);