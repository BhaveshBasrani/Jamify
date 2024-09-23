const { translate } = require('@vitalets/google-translate-api');
const { EmbedBuilder } = require('discord.js');
const { footer, logo } = require('../../../config.json');

module.exports = {
  name: 'translate',
  description: 'Translates text to a specified language.',
  category: 'Utility',
  aliases: ['tr', 'translateText'],
  async execute(message, args) {
    console.log('Executing command: translate');
    const lang = args[0];
    const text = args.slice(1).join(' ');

    if (!lang || !text) {
      return message.reply('Please provide a language and text to translate.');
    }

    try {
      const res = await translate(text, { to: lang });
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setAuthor({ name: 'Jamify', iconURL: logo })
        .setTitle(`Translation to ${lang}`)
        .setDescription(res.text)
        .setFooter({ text: footer });

      message.channel.send({ embeds: [embed] });
      console.log(`Translated text to ${lang}`);
    } catch (error) {
      console.error('Error translating text:', error);
      message.reply('There was an error trying to translate the text.');
    }
  },
};