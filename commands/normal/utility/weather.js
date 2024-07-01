const fetch = require('node-fetch');

module.exports = {
    name: 'weather',
    description: 'Provides the weather for a specified location.',
    category: 'utility',
    async execute(message, args) {
        console.log('Executing command: weather');
        const location = args.join(' ');
        if (!location) {
            return message.reply('Please provide a location.');
        }

        try {
            // Get coordinates using Nominatim Geocoding API
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`);
            const geoData = await geoResponse.json();

            if (!geoData.length) {
                return message.reply('Unable to fetch coordinates for the specified location.');
            }

            const { lat, lon } = geoData[0];

            // Get weather data using Open-Meteo API
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const weatherData = await weatherResponse.json();
            const weather = weatherData.current_weather;

            if (!weather) {
                return message.reply('Unable to fetch weather for the specified location.');
            }

            message.channel.send(`Current weather in ${location}:\nTemperature: ${weather.temperature}°C\nWeather: ${weather.weathercode}`);
            console.log(`Fetched weather for ${location}`);
        } catch (error) {
            console.error('Error fetching weather:', error);
            message.reply('There was an error trying to fetch the weather.');
        }
    },
};
