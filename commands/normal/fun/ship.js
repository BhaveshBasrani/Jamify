const { EmbedBuilder } = require('discord.js');
const { Canvas, Image } = require('canvas');
let got;
(async () => {
  const { default: _got } = await import('got');
  got = _got;
})();

const { footer, logo } = require('../../../config.json');

module.exports = {
  name: 'ship',
  description: 'Ship two users together.',
  category: 'fun',
  aliases: ['sh','s','shi'],
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

    const canvas = new Canvas(200, 100);
    const ctx = canvas.getContext('2d');

    // Load user avatars
const avatar1Response = await got(user1.displayAvatarURL({ format: 'png' }));
const avatar1Buffer = avatar1Response.body;
const avatar1 = new Image();
avatar1.onload = () => {
  // Draw avatars side by side
  ctx.drawImage(avatar1, 0, 0, 50, 100);

  // Draw heart in the middle
  ctx.fillStyle = 'ed';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'iddle';
  ctx.fillText('❤️', 100, 50);

  // Get the image buffer
  const imageBuffer = canvas.toBuffer();

  // Convert the image buffer to a base64 string
  const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;

  // Create the embed
  const embed = new EmbedBuilder()
   .setTitle('MATCHMAKING 💕')
   .setDescription(`${user1.username} ❤️ ${user2.username}`)
   .addFields(
      { name: 'Ship Name', value: shipName, inline: true },
      { name: 'Match Percentage', value: `${shipPercentage}%`, inline: true },
      { name: 'Description', value: description }
    )
   .setImage(imageBase64)
   .setColor('Pink')
   .setFooter({ text: footer, iconURL: logo });

  // Send the message with the embed
  message.channel.send({ embeds: [embed] });
};
avatar1.src = avatar1Buffer;

const avatar2Response = await got(user2.displayAvatarURL({ format: 'png' }));
const avatar2Buffer = avatar2Response.body;
const avatar2 = new Image();
avatar2.onload = () => {
  ctx.drawImage(avatar2, 150, 0, 50, 100);
};
avatar2.src = avatar2Buffer;
  }
};