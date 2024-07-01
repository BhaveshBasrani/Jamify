const translate = require('@vitalets/google-translate-api');

module.exports = {
    name: 'translate',
    description: 'Translates text to a specified language.',
    category: 'utility',
    async execute(message, args) {
        console.log('Executing command: translate');
        const lang = args[0];
        const text = args.slice(1).join(' ');

        if (!lang || !text) {
            return message.reply('Please provide a language and text to translate.');
        }

        try {
            const res = await translate(text, { to: lang });
            message.channel.send(`Translation (${lang}): ${res.text}`);
            console.log(`Translated text to ${lang}`);
        } catch (error) {
            console.error('Error translating text:', error);
            message.reply('There was an error trying to translate the text.');
        }
    },
};
