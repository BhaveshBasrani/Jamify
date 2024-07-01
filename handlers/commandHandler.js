const fs = require('fs');
const path = require('path');
const { prefix } = require('../config.json');

module.exports = (client) => {
    const commandFolders = fs.readdirSync(path.join(__dirname, '../commands/normal'));
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/normal/${folder}`)).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/normal/${folder}/${file}`);
            console.log(`${prefix}${command.name} Ready in ${client.guilds.cache.size} servers`);        
        }
    }

    const slashCommandFolders = fs.readdirSync(path.join(__dirname, '../commands/slashCommands'));
    for (const folder of slashCommandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/slashCommands/${folder}`)).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/slashCommands/${folder}/${file}`);
            console.log(`(/)${command.data.name} Ready in ${client.guilds.cache.size} servers`);
        }
    }
};
