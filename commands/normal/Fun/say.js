module.exports = {
    name: 'say',
    description: 'Makes the bot say a specified message.',
    category: 'Fun',
    async execute(message, args) {
        console.log('Executing command: say');

        // Join the arguments to form the message text
        const text = args.join(' ');

        // Check if the text is empty
        if (!text) {
            return message.reply('Please provide a message to say.');
        }

        try {
            // Attempt to delete the user's message
            await message.delete();

            // Send the message to the channel
            await message.channel.send(text);
        } catch (error) {
            console.error('Error executing the say command:', error);
            message.reply('There was an error trying to execute that command.');
        }
    },
};
