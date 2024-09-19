const ms = require('ms');
const ReminderHandler = require('../../../utils/remainderHandler');
const reminderHandler = new ReminderHandler();

module.exports = {
    name: 'remind',
    description: 'Sets a reminder.',
    aliases: ['reminder', 'setremind'],
    execute(message, args) {
        const time = args[0];
        const reminder = args.slice(1).join(' ');

        if (!time || !reminder) {
            return message.reply('Please provide a time and a reminder message.');
        }

        const timeMs = ms(time);
        if (!timeMs) {
            return message.reply('Please provide a valid time format i.e in seconds!!');
        }

        reminderHandler.setReminder(message.author.id, timeMs, message);
        message.reply(`⏰ Reminder set for ${time}.`);
    },
};
