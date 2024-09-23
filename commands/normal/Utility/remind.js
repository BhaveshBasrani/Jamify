const ms = require('ms');
const ReminderHandler = require('../../../utils/remainderHandler');
const reminderHandler = new ReminderHandler();

module.exports = {
    name: 'remind',
    description: 'Sets a reminder.',
    category: 'Utility',
    aliases: ['remindme', 'remind_me', 'set_reminder'],
    execute(message, args) {
        if (args.length < 2) {
            return message.reply('Please provide a time and a reminder message.');
        }

        const time = args[0];
        const reminder = args.slice(1).join(' ');

        const timeMs = ms(time);
        if (!timeMs) {
            return message.reply('Please provide a valid time format (e.g., 10s, 5m, 1h).');
        }

        reminderHandler.setReminder(message.author.id, timeMs, message);
        message.reply(`⏰ Reminder set for ${time}.`);
    },
};
