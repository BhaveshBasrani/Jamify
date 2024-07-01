const fetch = require('node-fetch'); 

module.exports = {
  name: 'joke',
  description: 'Tells a random, appropriate joke.',
  category: 'fun',
  async execute(message) {
    console.log('Executing command: joke');
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political');
      const data = await response.json();
      console.log('Joke fetched successfully');

      // Check if it's a single joke or a two-part setup/delivery
      if (data.type === 'single') {
        message.channel.send(data.joke);
      } else {
        message.channel.send(`${data.setup}\n||${data.delivery}||`); // Use markdown spoiler tags for punchline
      }
    } catch (error) {
      console.error('Error fetching joke:', error);
      message.channel.send('Failed to fetch a joke. Please try again later.');
    }
  },
};
