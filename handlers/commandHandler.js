const fs = require('fs');
const path = require('path');
const { prefix } = require('../config.json');

module.exports = async (client) => {
  try {
    const commandFolders = fs.readdirSync(path.join(__dirname, '../commands/normal'));
    for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/normal/${folder}`)).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        try {
          const command = require(`../commands/normal/${folder}/${file}`);
          if (!command.name) {
            console.error(`Command ${file} is missing a 'name' property`);
            continue;
          }
          console.log(`${prefix}${command.name} Ready in ${client.guilds.cache.size} servers`);
        } catch (error) {
          console.error(`Error loading command ${file}: ${error}`);
        }
      }
    }

    const slashCommandFolders = fs.readdirSync(path.join(__dirname, '../commands/slashCommands'));
    for (const folder of slashCommandFolders) {
      const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/slashCommands/${folder}`)).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        try {
          const command = require(`../commands/slashCommands/${folder}/${file}`);
          if (!command.data || !command.data.name) {
            console.error(`Slash command ${file} is missing a 'data' or 'data.name' property`);
            continue;
          }
          console.log(`(/)${command.data.name} Ready in ${client.guilds.cache.size} servers`);
        } catch (error) {
          console.error(`Error loading slash command ${file}: ${error}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error loading commands: ${error}`);
  }
};