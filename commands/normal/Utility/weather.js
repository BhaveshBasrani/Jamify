const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const {color, banner, logo} = require('../../../config.json')

module.exports = {
    name: 'weather',
    description: 'Provides the weather for a specified location.',
    category: 'Utility',
    aliases: ['forecast', 'temp'],
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
                return message.reply('Unable to fetch coordinates for the specified location. Try using only your city name.');
            }

            const { lat, lon } = geoData[0];

            // Get weather data using Open-Meteo API
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const weatherData = await weatherResponse.json();
            const weather = weatherData.current_weather;

            if (!weather) {
                return message.reply('Unable to fetch weather for the specified location.');
            }

            const weatherEmbed = new EmbedBuilder()
                .setTitle(`Current Weather in ${location}`)
                .setAuthor({ name: 'Jamify', iconURL: logo })
                .addFields(
                    { name: 'Temperature', value: `${weather.temperature}°C`, inline: true },
                    { name: 'Windspeed', value: `${weather.windspeed} km/h`, inline: true }
                )
                .setColor(color)
                .setImage(banner)
                .setFooter({ text: footer })
                .setTimestamp();

            message.channel.send({ embeds: [weatherEmbed] });
        } catch (error) {
            console.error('Error fetching weather:', error);
            message.reply('There was an error trying to fetch the weather.');
        }
    },
};
