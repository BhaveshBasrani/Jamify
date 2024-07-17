const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei");
const { SpotifyExtractor } = require('@discord-player/extractor');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { token, mongodb, banner, logo, footer, prefix, auth } = require('./config.json');
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
client.player.extractors.register(YoutubeiExtractor, {
    authentication: auth
})
client.player.extractors.register(SpotifyExtractor, {
    createStream: createYoutubeiStream
})

client.player.on('error', (error) => {
    console.error(`Error emitted from the queue: ${error.message}`);
});

client.player.on('playerError', (error) => {
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

// Invoke the command handler to log command information
commandHandler(client);

async function restoreState(guildId) {
    let queueData;
    try {
        queueData = await Queue.findOne({ guildId: guildId });
    } catch (error) {
        console.error(`Failed to retrieve queue data for guild ${guildId}:`, error);
        return;
    }

    if (!queueData || !queueData.songs.length) {
        console.log(`No saved queue for guild ${guildId}`);
        return;
    }

    let node = client.player.nodes.get(guildId);
    if (!node) {
        try {
            node = await client.player.nodes.create(guildId, {
                metadata: {
                    channel: queueData.songs[0].channelId ? client.channels.cache.get(queueData.songs[0].channelId) : null
                }
            });
            if (queueData.songs[0].voiceChannelId) {
                await node.connect(client.channels.cache.get(queueData.songs[0].voiceChannelId));
            }
        } catch (error) {
            console.error(`Failed to create or connect node for guild ${guildId}:`, error);
            return;
        }
    }

    if (!node.queue) {
        node.queue = [];
    }

    queueData.songs.forEach(song => {
        if (song.url) {
            if (typeof node.queue.add === 'function') {
                node.queue.add(song.url);
            } else {
                node.queue.push(song.url);
            }
        }
    })

    const firstSong = queueData.songs[0];
    node.play(firstSong.url, {
        metadata: {
            requestedBy: firstSong.requestedBy,
            channelId: firstSong.channelId,
            voiceChannelId: firstSong.voiceChannelId
        }
    });

    // Send the "now playing" embed
    if (firstSong && firstSong.channelId && client.channels.cache.get(firstSong.channelId)) {
        const nowPlayingEmbed = new EmbedBuilder()
           .setTitle('Bot Has Been Restarted... \n*Queue Restored* \n**Now Playing**')
           .setThumbnail(firstSong.thumbnail)
           .setDescription(`**${firstSong.title}**`)
           .setImage(banner)
           .setURL(firstSong.url)
           .setColor('Blue')
           .setFooter({ text: footer, iconURL: logo });

        client.channels.cache.get(firstSong.channelId).send({ embeds: [nowPlayingEmbed] });
    }

    console.log(`Restored queue for guild ${guildId}`);
}

client.on('messageCreate', async (message) => {
    if (message.type !== 0 || message.author.bot) return;

    if (message.content.toLowerCase() === `<@${client.user.id}>` || message.content.toLowerCase() === `<@!${client.user.id}>`) {
        const guildId = message.guild.id; // Add this line to define the guildId variable

        const embed = new EmbedBuilder()
            .setTitle('Heyy!!! Am Jamify')
            .setDescription(`My prefix in this server is ${prefix} Use ${prefix}help for more info.`)
            .setColor('Blue')
            .setFooter({ text: footer, iconURL: logo });

        message.channel.send({ embeds: [embed] });
    }
});

// Call restoreState for each guild the bot is in
client.on('ready', async () => {
    client.guilds.cache.forEach(guild => {
        restoreState(guild.id);
    });
});

client.login(token);