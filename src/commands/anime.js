const { SlashCommandBuilder } = require('discord.js');
const embeds = require('../utils/embeds');
const components = require('../utils/components');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('فتح المنصة الرئيسية لمشاهدة واستكشاف الأنمي'),

    async execute(interaction) {
        await interaction.reply({
            embeds: [embeds.homeEmbed()],
            components: [components.homeButtons()]
        });
    }
};
