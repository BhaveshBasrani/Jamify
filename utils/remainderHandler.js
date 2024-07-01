// reminderHandler.js
const { Collection } = require('discord.js');

module.exports = class ReminderHandler {
    constructor() {
        this.reminders = new Collection();
    }

    setReminder(userId, time, message) {
        const reminder = setTimeout(() => {
            this.reminders.delete(userId);
            message.channel.send(`<@${userId}>, here's your reminder: ${message.content}`);
        }, time);

        this.reminders.set(userId, reminder);
    }

    cancelReminder(userId) {
        const reminder = this.reminders.get(userId);
        if (reminder) {
            clearTimeout(reminder);
            this.reminders.delete(userId);
        }
    }
};
