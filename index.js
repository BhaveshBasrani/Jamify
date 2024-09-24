const { Client, GatewayIntentBits, Collection, EmbedBuilder, Events } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei");
const { SpotifyExtractor } = require('@discord-player/extractor');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ServerSettings = require('./models/ServerSettings.js');
const { token, mongodb, banner, logo, footer, auth } = require('./config.json');
const commandHandler = require('./handlers/commandHandler.js');
const afkCommand = require('./commands/normal/Fun/afk.js'); // Path to the AFK command

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers // Add this to handle member-related events like mentions.
    ]
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.player = new Player(client, {
   skipFFmpeg: false
});

client.player.extractors.register(YoutubeiExtractor, {
    authentication: auth,
    streamOptions: {
        useClient: "ANDROID"
    }
});
client.player.extractors.register(SpotifyExtractor, {
    createStream: createYoutubeiStream
});

client.player.events.on('audioTracksAdd', (queue) => {
    queue.metadata.channel.send(`Multiple tracks queued`);
});

client.player.events.on('playerSkip', (queue, track) => {
    queue.metadata.channel.send(`Skipping **${track.title}** due to an issue!`);
});

client.player.events.on('emptyChannel', (queue) => {
    queue.metadata.channel.send(`Leaving due to no VC activity for 5 minutes`);
});

client.player.events.on('emptyQueue', (queue) => {
    queue.metadata.channel.send('Queue finished!');
});

client.player.events.on('error', (error) => {
    console.log(`General player error event: ${error.message}`);
    console.log(error);
});

client.player.events.on('playerError', (error) => {
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});

client.player.events.on('playerFinish', async (queue, track) => {
    const playerFinishHandler = require('./events/playerFinish');
    await playerFinishHandler.execute(queue, track, client);
});

// AFK Mention Handler - This will check all mentions across all servers
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;  // Ignore bot messages
    afkCommand.handleMentions(message); // Call the AFK mention handler
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

// Prefix mention for help and prefix information
client.on('messageCreate', async (message) => {
    if (message.type !== 0 || message.author.bot) return;
    const serverSettings = await ServerSettings.findOne({ guildId: message.guild.id });
    const prefix = serverSettings && serverSettings.prefix ? serverSettings.prefix : require('./config.json').prefix;

    if (message.content.toLowerCase() === `<@${client.user.id}>` || message.content.toLowerCase() === `<@!${client.user.id}>`) {
        const embed = new EmbedBuilder()
            .setTitle('Heyy!!! Am Jamify')
            .setDescription(`My prefix in this server is \`${prefix}\`. Use ${prefix}help for more info.`)
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);
