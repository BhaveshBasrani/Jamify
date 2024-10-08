const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { logo, banner, footer, color } = require('../../../config.json');
const canvafy = require('canvafy'); // Make sure to install this library if you haven't already

module.exports = {
    name: 'nowplaying',
    description: 'Displays the currently playing song.',
    category: 'Music',
    aliases: ['np', 'now'],
    async execute(message) {
        const queue = useQueue(message.guild.id);
        const nomusic = new EmbedBuilder()
            .setTitle('**No Music Playing**')
            .setImage(banner)
            .setDescription('No music is being played!')
            .setColor(color)
            .setFooter({ text: footer, iconURL: logo });

        if (!queue) {
            return message.reply({ embeds: [nomusic] });
        }

        const currentSong = queue.currentTrack;

        const spotify = await new canvafy.Spotify()
            .setAuthor(currentSong.author)
            .setAlbum(currentSong.album || 'Unknown Album')
            .setTimestamp(currentSong.durationMS / 4, currentSong.durationMS)
            .setImage(currentSong.thumbnail)
            .setTitle(currentSong.title)
            .setBlur(5)
            .setOverlayOpacity(0.7)
            .build();

        const buffer = Buffer.from(spotify);

        const nowPlayingEmbed = new EmbedBuilder()
            .setTitle('<a:Music_Cmds:1280034171431026749> Now Playing')
            .setDescription(`**${currentSong.title}** By **${currentSong.author}** \n
                <a:BlueBulllet:1290900684618596382> __**Duration:**__ ${currentSong.duration || 'Unknown Duration'} \n
                <a:BlueBulllet:1290900684618596382> __**Requested By:**__ <@${currentSong.requestedBy.id}> \n
                <a:BlueBulllet:1290900684618596382> __**Views:**__ ${currentSong.views}`)
            .setColor(color)
            .setImage('attachment://spotify.png')
            .setFooter({ text: footer, iconURL: logo })
            .setTimestamp();

        message.channel.send({ embeds: [nowPlayingEmbed], files: [{ attachment: buffer, name: 'spotify.png' }] });
    },
};