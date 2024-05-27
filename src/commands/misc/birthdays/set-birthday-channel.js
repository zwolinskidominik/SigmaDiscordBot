const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const BirthdayConfiguration = require("../../../models/BirthdayConfiguration");

module.exports = {
  data: {
    name: "set-birthday-channel",
    description: "Ustawia kanał, na którym będą wysyłane wiadomości urodzinowe.",
    options: [
      {
        name: "channel",
        description: "Kanał do wysyłania wiadomości urodzinowych.",
        required: true,
        type: ApplicationCommandOptionType.Channel,
      },
    ],
  },

  run: async ({ interaction }) => {
    const birthdayChannelId = interaction.options.get("channel").value;
    const guildId = interaction.guild.id;

    try {
      await interaction.deferReply();

      const birthdayConfig = await BirthdayConfiguration.findOne({ guildId });
      if (birthdayConfig) {
        birthdayConfig.birthdayChannelId = birthdayChannelId;
      } else {
        birthdayConfig = new BirthdayConfiguration({
          guildId,
          birthdayChannelId,
        });
      }

      await birthdayConfig.save();

      const successEmbed = new EmbedBuilder()
        .setColor('#00BFFF')
        .setDescription('Kanał do wysyłania wiadomości urodzinowych został ustawiony.');
      await interaction.reply({ embeds: [successEmbed] });
    } catch (error) {
      console.error(`Błąd podczas zapisywania konfiguracji kanału: ${error}`);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('Wystąpił błąd podczas zapisywania konfiguracji kanału.');
      await interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
