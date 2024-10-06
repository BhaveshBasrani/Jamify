const { Client, GatewayIntentBits, Collection, EmbedBuilder, Events } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require("discord-player-youtubei");
const { SpotifyExtractor, AppleMusicExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ServerSettings = require('./models/ServerSettings.js');
const { token, mongodb, banner, logo, footer, auth, color } = require('./config.json');
const afkCommand = require('./commands/normal/Fun/afk.js'); 
const slashafk = require('./commands/slashCommands/Fun/afk.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers 
    ]
});

client.commands = new Collection();
client.slashCommands = new Collection();
const player = new Player(client, {
    skipFFmpeg: false,
    streamOptions: {
        highWaterMark: 1 << 26,
    }
});

player.extractors.register(YoutubeiExtractor, {
    authentication: auth,
});

player.extractors.register(SpotifyExtractor, {});

const playerhandler = require('./handlers/playerhandler.js');
player.events.on('playerStart', async (queue, track) => {
        await playerhandler.execute(queue, track, client)
});

player.events.on('audioTracksAdd', (queue) => {
    console.log(`Multiple tracks queued`);
});

player.events.on('playerSkip', (queue, track) => {
    console.log(`Skipping **${track.title}** due to an issue!`);
});

player.events.on('emptyChannel', async (queue) => {
    const serverSettings = await ServerSettings.findOne({ guildId: queue.guild.id });
    if (serverSettings && serverSettings.twentyFourSeven) {
        console.log('24/7 mode is enabled, not leaving the channel.');
        return;
    } else {
    queue.metadata.channel.send(`Leaving due to no VC activity for 5 minutes`);
    } 
});

player.events.on('emptyQueue', (queue) => {
    console.log('Queue finished!');
});

player.events.on('error', (queue, error) => {
    console.log(`General player error event from the queue ${queue.guild.id}: ${error.message}`);
    console.log(error);
});

player.events.on('playerError', (error) => {
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});
const playerFinishHandler = require('./events/playerFinish');
player.events.on('playerFinish', async (queue, track) => {
    await playerFinishHandler.execute(queue, track, client);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    afkCommand.handleMentions(message);
    slashafk.handleMentions(message);
});

async function joinVoiceChannelsFor247() {
    const serverSettings = await ServerSettings.find({ twentyFourSeven: true });
    for (const settings of serverSettings) {
        try {
            const guild = await client.guilds.fetch(settings.guildId);
            const voiceChannel = await guild.channels.fetch(settings.voiceChannelId);
            if (voiceChannel) {
                try {
                    const queue = player.nodes.create(guild, {
                        metadata: {
                            channel: voiceChannel
                        }
                    });
                    await queue.connect(voiceChannel);
                    console.log(`Joined voice channel ${voiceChannel.name} in guild ${guild.name} for 24/7 mode.`);
                } catch (error) {
                    console.error(`Failed to join voice channel ${voiceChannel.name} in guild ${guild.name}:`, error);
                }
            } else {
                console.log(`Voice channel with ID ${settings.voiceChannelId || 'undefined'} not found in guild ${guild.name}.`);
            }
        } catch (error) {
            console.error(`Failed to fetch guild or voice channel for guild ID ${settings.guildId}:`, error);
        }
    }
}

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
            .setDescription(`My prefix in this server is \`${prefix}\`. Use \`${prefix}help\` for more info.`)
            .setColor(color)
            .setImage(banner)
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    }
});

console.log(player.scanDeps());player.on('debug',console.log).events.on('debug',(_,m)=>console.log(m));

client.once('ready', async () => {
    await joinVoiceChannelsFor247();
});

client.login(token);