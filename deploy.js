const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('/home/pradeep/Jamify/src/config.json');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands/slashCommands'));

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, `commands/slashCommands/${folder}`)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/slashCommands/${folder}/${file}`);
        if (command.data && typeof command.data.toJSON === 'function') {
            commands.push(command.data.toJSON());
        } else {
            console.error(`Command at ${folder}/${file} is missing data or toJSON method.`);
        }
    }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
	{ body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
