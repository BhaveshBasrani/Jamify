const { PermissionsBitField, EmbedBuilder, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Deletes a specified number of messages.',
  category: 'Utility',
  aliases: ['purge', 'clean'],
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const noPermsEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('You do not have permissions to manage messages.');
      return message.reply({ embeds: [noPermsEmbed] });
    }

    if (!args[0]) {
      const noArgsEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('Please specify a number of messages to delete.');
      return message.reply({ embeds: [noArgsEmbed] });
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount)) {
      const invalidAmountEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('Please specify a valid number of messages to delete.');
      return message.reply({ embeds: [invalidAmountEmbed] });
    }

    if (amount < 1 || amount > 100) {
      const outOfRangeEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('Please specify a number between 1 and 100.');
      return message.reply({ embeds: [outOfRangeEmbed] });
    }

    const confirmEmbed = new EmbedBuilder()
      .setColor('Yellow')
      .setDescription(`Are you sure you want to delete ${amount} messages?`);

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('confirm')
          .setLabel('Confirm')
          .setStyle('DANGER'),
        new MessageButton()
          .setCustomId('cancel')
          .setLabel('Cancel')
          .setStyle('SECONDARY')
      );

    message.reply({ embeds: [confirmEmbed], components: [row] }).then(sentMessage => {
      const filter = i => i.user.id === message.author.id;
      const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

      collector.on('collect', async i => {
        if (i.customId === 'confirm') {
          await i.deferUpdate();
          message.channel.bulkDelete(amount, true)
            .then(deleted => {
              const successEmbed = new EmbedBuilder()
                .setColor('Green')
                .setDescription(`Successfully deleted ${deleted.size} messages.`);
              message.channel.send({ embeds: [successEmbed] })
                .then(msg => setTimeout(() => msg.delete(), 5000))
                .catch(error => {
                  console.error('Error sending confirmation message:', error);
                  const errorEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('There was an error sending the confirmation message.');
                  message.reply({ embeds: [errorEmbed] });
                });
            })
            .catch(error => {
              if (error.code === 50013) {
                const noBotPermsEmbed = new EmbedBuilder()
                  .setColor('Red')
                  .setDescription('I do not have permission to delete messages in this channel.');
                message.reply({ embeds: [noBotPermsEmbed] });
              } else {
                console.error('Error deleting messages:', error);
                const errorEmbed = new EmbedBuilder()
                  .setColor('Red')
                  .setDescription('There was an error trying to delete messages in this channel.');
                message.reply({ embeds: [errorEmbed] });
              }
            });
        } else if (i.customId === 'cancel') {
          await i.deferUpdate();
          const cancelEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription('Message deletion canceled.');
          message.reply({ embeds: [cancelEmbed] });
        }
        collector.stop();
      });

      collector.on('end', collected => {
        if (collected.size === 0) {
          const timeoutEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('Confirmation timed out.');
          message.reply({ embeds: [timeoutEmbed] });
        }
      });
    });
  },
};