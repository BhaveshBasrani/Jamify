const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { YouTubeExtractor, SpotifyExtractor } = require('@discord-player/extractor');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { token, prefix, mongodb } = require('./config.json');
const commandHandler = require('./handlers/commandHandler.js');
const Queue = require('./models/queue.js')

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

// Register extractors
client.player.extractors.register(YouTubeExtractor);
client.player.extractors.register(SpotifyExtractor);

client.player.on('error', (queue, error) => {
    console.error(`Error emitted from the queue: ${error.message}`);
});

client.player.on('playerError', (queue, error) => {
    console.error(`Error emitted from the player: ${error.message}`);
});

client.player.on('skip', (queue) => {
    console.log(`Skipped the current song in guild ${queue.guild.id}`);
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

// Invoke the command handler to log command information
commandHandler(client);

const restoreState = async (client, guildId) => {
    const queueData = await Queue.findOne({ guildId });
    if (queueData && queueData.currentTrack) {
        let node = client.player.nodes.get(guildId);
        if (!node) {
            node = await client.player.nodes.create(guildId, {
                metadata: {
                    channel: client.channels.cache.get(queueData.currentTrack.channelId)
                }
            });
            await node.connect(client.channels.cache.get(queueData.currentTrack.voiceChannelId));
        }
        await node.play(queueData.currentTrack.url);
        queueData.songs.forEach(song => node.queue.add(song.url));
    }
};

// Call restoreState for each guild the bot is in
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(guild => {
        restoreState(client, guild.id);
    });
});

client.login(token);
