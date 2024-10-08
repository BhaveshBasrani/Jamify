const { Client, GatewayIntentBits, Collection, EmbedBuilder, Events, ChannelType } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require("discord-player-youtubei");
const { SpotifyExtractor } = require('@discord-player/extractor');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ServerSettings = require('./models/ServerSettings.js');
const { token, mongodb, banner, logo, footer, auth, color } = require('./config.json');
const afkCommand = require('./commands/normal/Fun/afk.js');
const slashafk = require('./commands/slashCommands/Fun/afk.js');

// Client Setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers 
    ]
});

// Initialize Player and Commands
client.commands = new Collection();
client.slashCommands = new Collection();
const player = new Player(client, {
    skipFFmpeg: false,
    streamOptions: {
        highWaterMark: 1 << 26,
    }
});

// Register Extractors
player.extractors.register(YoutubeiExtractor, { authentication: auth });
player.extractors.register(SpotifyExtractor, {});

// Player Event Handlers
const playerhandler = require('./handlers/playerhandler.js');
player.events.on('playerStart', async (queue, track) => {
    await playerhandler.execute(queue, track, client);
    console.log("working.")
});

player.events.on('audioTracksAdd', () => {
    console.log(`Multiple tracks queued`);
});

player.events.on('playerSkip', (_, track) => {
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

player.events.on('emptyQueue', () => {
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

// AFK Command Handlers
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    afkCommand.handleMentions(message);
    slashafk.handleMentions(message);
});


async function startRoleCollector(msg, roleEmojiPairs) {
    const filter = interaction => interaction.customId === 'select-role' && !interaction.user.bot;
    const collector = msg.createMessageComponentCollector({ filter });

    collector.on('collect', async interaction => {
        const roleId = interaction.values[0];
        const role = await msg.guild.roles.fetch(roleId);
        const member = msg.guild.members.cache.get(interaction.user.id);

        if (!role || !member) return;

        try {
            await member.roles.add(role);
            await interaction.reply({ content: `You have been given the role <@&${role.id}>.`, ephemeral: true });
        } catch (error) {
            console.error('Error adding role:', error);
            await interaction.reply({ content: 'There was an error while assigning the role. Please try again later.', ephemeral: true });
        }
    });

    collector.on('end', collected => {
        console.log('Role selection collector has ended. Restarting collector...');
        startRoleCollector(msg, roleEmojiPairs);
    });
}

// Role Collectors Reattachment
async function reattachRoleCollectors() {
    const serverSettings = await ServerSettings.find();
    for (const settings of serverSettings) {
        if (settings.roleMessageId && settings.roleEmojiPairs.length > 0) {
            try {
                const guild = await client.guilds.fetch(settings.guildId);
                const channel = await guild.channels.fetch(settings.roleChannelId);
                if (!channel) {
                    console.log(`Channel with ID ${settings.roleChannelId} not found in guild ${guild.name}.`);
                    continue;
                }
                // Check if the channel is a text-based channel
                if (channel.type === ChannelType.GuildText) {
                    const msg = await channel.messages.fetch(settings.roleMessageId).catch(() => null);
                    if (msg) {
                        console.log(`Reattaching role collector for message ${msg.id} in guild ${guild.name}.`);
                        startRoleCollector(msg, settings.roleEmojiPairs);  // Reattach the collector
                    } else {
                        console.log(`Message with ID ${settings.roleMessageId} not found in guild ${guild.name}.`);
                    }
                } else {
                    console.log(`Channel with ID ${settings.roleChannelId} is not a text channel in guild ${guild.name}.`);
                }
            } catch (error) {
                console.error(`Error reattaching role collectors for guild ID ${settings.guildId}:`, error);
            }
        }
    }
}

// Connect to MongoDB
mongoose.connect(mongodb, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Load Commands
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

// Load Slash Commands
const slashCommandFolders = fs.readdirSync(path.join(__dirname, 'commands/slashCommands'));
for (const folder of slashCommandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, `commands/slashCommands/${folder}`)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/slashCommands/${folder}/${file}`);
        client.slashCommands.set(command.data.name, command);
    }
}

// Load Event Handlers
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Prefix Mention Handler
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

// Client Ready Event
client.once('ready', async () => {
    client.setMaxListeners(50);
    await reattachRoleCollectors();
});

// Bot Login
client.login(token);
