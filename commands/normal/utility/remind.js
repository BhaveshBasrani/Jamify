const ms = require('ms');

module.exports = {
    name: 'remind',
    description: 'Sets a reminder.',
    category: 'utility',
    execute(message, args) {
        console.log('Executing command: remind');
        const time = args[0];
        const reminder = args.slice(1).join(' ');

        if (!time || !reminder) {
            return message.reply('Please provide a time and a reminder message.');
        }

        message.reply(`Reminder set for ${time}.`);

        setTimeout(() => {
            message.reply(`Reminder: ${reminder}`);
            console.log(`Reminder: ${reminder}`);
        }, ms(time));
    },
};
