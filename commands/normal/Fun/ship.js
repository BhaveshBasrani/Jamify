const { EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const { footer, logo } = require('../../../config.json');

module.exports = {
  name: 'ship',
  description: 'Ship two users together.',
  category: 'Fun',
  aliases: ['sh', 's', 'shi'],
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply('Please mention two users to ship.');
    }

    const user1 = message.mentions.users.first();
    const user2 = message.mentions.users.last();

    if (!user1 || !user2) {
      return message.reply('Please mention two valid users to ship.');
    }

    const shipName = user1.username.slice(0, Math.floor(user1.username.length / 2)) + user2.username.slice(Math.floor(user2.username.length / 2));
    const shipPercentage = Math.floor(Math.random() * 100) + 1;
    let description;

    if (shipPercentage > 75) {
      description = 'A match made in heaven! 💖';
    } else if (shipPercentage > 50) {
      description = 'A pretty good match! 😊';
    } else if (shipPercentage > 25) {
      description = 'Could work out with some effort. 🤔';
    } else {
      description = 'Not looking too good... 😕';
    }

    const ship = await new canvafy.Ship()
      .setAvatars(user1.displayAvatarURL({ forceStatic: true, extension: 'png' }), user2.displayAvatarURL({ forceStatic: true, extension: 'png' }))
      .setBackground('image', 'https://wallpaperaccess.com/full/6304464.jpg')
      .setBorder('#C658E5')
      .setCustomNumber(shipPercentage)
      .setOverlayOpacity(0.5)
      .build();

      const buffer = Buffer.from(ship);

    const embed = new EmbedBuilder()
      .setTitle('MATCHMAKING <a:Ship_Cmd:1286008211765198928>')
      .setDescription(`<@${user1.id}> <a:Ship_Cmd:1286008211765198928> <@${user2.id}>`)
      .addFields(
        { name: 'Ship Name', value: shipName, inline: true },
        { name: 'Match Percentage', value: `${shipPercentage}%`, inline: true },
        { name: 'Description', value: description }
      )
      .setImage('attachment://ship.png')
      .setColor('#C658E5')
      .setFooter({ text: footer, iconURL: logo });

    message.channel.send({ embeds: [embed], files: [{ attachment: buffer, name: 'ship.png' }] });
  }
};