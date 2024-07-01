// commandHandler.js
const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const commandFolders = fs.readdirSync(path.join(__dirname, '../commands/normal'));

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/normal/${folder}`)).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/normal/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }
};
