const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Anime = require('../models/Anime');

// استبدل الأيديهات برتبة الطاقم وروم اللوق
const STAFF_ROLE_ID = 1523722197510783116';
const LOG_CHANNEL_ID = '1552627523047923743';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-anime')
        .setDescription('إضافة أنمي جديد إلى القائمة (للطاقم فقط)')
        .addStringOption(option => 
            option.setName('title').setDescription('اسم الأنمي').setRequired(true))
        .addStringOption(option => 
            option.setName('description').setDescription('وصف الأنمي').setRequired(false))
        .addStringOption(option => 
            option.setName('image').setDescription('رابط صورة الأنمي').setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ هذا الأمر مخصص لطاقم الإدارة فقط!', ephemeral: true });
        }

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description') || 'لا يوجد وصف';
        const image = interaction.options.getString('image') || '';

        try {
            const anime = await Anime.create({
                title,
                description,
                image,
                addedBy: {
                    userId: interaction.user.id,
                    username: interaction.user.tag
                }
            });

            await interaction.reply({ content: `✅ تم إضافة أنمي **${title}** بنجاح!`, ephemeral: true });

            const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('📝 لوق إضافة أنمي جديد')
                    .setColor('Green')
                    .addFields(
                        { name: 'الأنمي', value: title, inline: true },
                        { name: 'بواسطة', value: `${interaction.user} (${interaction.user.tag})`, inline: true },
                        { name: 'ID العضو', value: interaction.user.id, inline: true }
                    )
                    .setTimestamp();
                logChannel.send({ embeds: [logEmbed] });
            }

        } catch (error) {
            if (error.code === 11000) {
                return interaction.reply({ content: '⚠️ هذا الأنمي مضاف مسبقاً!', ephemeral: true });
            }
            console.error(error);
            interaction.reply({ content: '❌ حدث خطأ أثناء إضافة الأنمي.', ephemeral: true });
        }
    }
};
