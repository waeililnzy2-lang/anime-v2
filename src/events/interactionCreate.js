const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const animeService = require('../services/animeService');
const userService = require('../services/userService');
const embeds = require('../utils/embeds');
const components = require('../utils/components');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                if (interaction.commandName === 'anime') {
                    const command = interaction.client.commands.get('anime');
                    if (command) await command.execute(interaction);
                }
                return;
            }

            if (interaction.isButton()) {
                const { customId } = interaction;

                if (customId === 'btn_search') {
                    const modal = new ModalBuilder()
                        .setCustomId('modal_search')
                        .setTitle('بحث عن أنمي');

                    const input = new TextInputBuilder()
                        .setCustomId('search_query')
                        .setLabel('اكتب اسم الأنمي بالإنجليزية أو العربية')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('مثال: One Piece')
                        .setRequired(true);

                    modal.addComponents(new ActionRowBuilder().addComponents(input));
                    return await interaction.showModal(modal);
                }

                if (customId === 'btn_my_anime') {
                    const user = await userService.getUser(interaction.user.id);
                    return await interaction.reply({
                        embeds: [embeds.savedAnimeEmbed(user.savedAnime)],
                        ephemeral: true
                    });
                }

                if (customId === 'btn_latest') {
                    const latest = await animeService.getLatestEpisodes(10);
                    return await interaction.reply({
                        embeds: [embeds.latestEpisodesEmbed(latest)],
                        ephemeral: true
                    });
                }

                if (customId === 'btn_suggest') {
                    const modal = new ModalBuilder()
                        .setCustomId('modal_suggest')
                        .setTitle('اقتراح أنمي جديد');

                    const inputName = new TextInputBuilder()
                        .setCustomId('suggest_title')
                        .setLabel('اسم الأنمي')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const inputReason = new TextInputBuilder()
                        .setCustomId('suggest_reason')
                        .setLabel('لماذا تقترحه؟')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(inputName),
                        new ActionRowBuilder().addComponents(inputReason)
                    );
                    return await interaction.showModal(modal);
                }

                if (customId.startsWith('btn_anime_detail_')) {
                    const animeId = customId.split('_')[3];
                    return renderAnimePage(interaction, animeId, 1);
                }

                if (customId.startsWith('btn_page_')) {
                    const [, , direction, animeId, pageStr] = customId.split('_');
                    let page = parseInt(pageStr, 10);
                    page = direction === 'next' ? page + 1 : page - 1;
                    return renderAnimePage(interaction, animeId, page);
                }

                if (customId.startsWith('btn_save_')) {
                    const animeId = customId.split('_')[2];
                    const isSaved = await userService.toggleSave(interaction.user.id, animeId);
                    return renderAnimePage(interaction, animeId, 1, isSaved ? 'تمت إضافة الأنمي للمحفوظات ✅' : 'تم إزالة الأنمي من المحفوظات ❌');
                }

                if (customId.startsWith('btn_notify_')) {
                    const animeId = customId.split('_')[2];
                    const isNotified = await userService.toggleNotification(interaction.user.id, animeId);
                    return renderAnimePage(interaction, animeId, 1, isNotified ? 'تم تفعيل التنبيهات 🔔' : 'تم إلغاء التنبيهات 🔕');
                }

                if (customId.startsWith('btn_jump_ep_')) {
                    const animeId = customId.split('_')[3];
                    const modal = new ModalBuilder()
                        .setCustomId(`modal_jump_${animeId}`)
                        .setTitle('الانتقال لمباشرة لرقم الحلقة');

                    const input = new TextInputBuilder()
                        .setCustomId('ep_number')
                        .setLabel('اكتب رقم الحلقة')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('مثال: 125')
                        .setRequired(true);

                    modal.addComponents(new ActionRowBuilder().addComponents(input));
                    return await interaction.showModal(modal);
                }

                if (customId.startsWith('btn_ep_prev_') || customId.startsWith('btn_ep_next_')) {
                    const [, , direction, animeId, currentEpStr] = customId.split('_');
                    const currentEp = parseInt(currentEpStr, 10);
                    const targetEp = direction === 'next' ? currentEp + 1 : currentEp - 1;
                    return renderEpisodePage(interaction, animeId, targetEp);
                }
            }

            if (interaction.isStringSelectMenu()) {
                if (interaction.customId.startsWith('select_ep_')) {
                    const animeId = interaction.customId.split('_')[2];
                    const selectedEpNumber = parseInt(interaction.values[0], 10);
                    return renderEpisodePage(interaction, animeId, selectedEpNumber);
                }
            }

            if (interaction.isModalSubmit()) {
                if (interaction.customId === 'modal_search') {
                    const query = interaction.fields.getTextInputValue('search_query');
                    const results = await animeService.searchAnime(query, 10);

                    if (!results || results.length === 0) {
                        return await interaction.reply({
                            content: `❌ لم يتم العثور على نتائج للبحث: **${query}**`,
                            ephemeral: true
                        });
                    }

                    const anime = results[0];
                    return renderAnimePage(interaction, anime._id.toString(), 1);
                }

                if (interaction.customId.startsWith('modal_jump_')) {
                    const animeId = interaction.customId.split('_')[2];
                    const epNum = parseInt(interaction.fields.getTextInputValue('ep_number'), 10);

                    if (isNaN(epNum)) {
                        return await interaction.reply({ content: '❌ يرجى إدخال رقم حلقة صحيح.', ephemeral: true });
                    }

                    return renderEpisodePage(interaction, animeId, epNum);
                }

                if (interaction.customId === 'modal_suggest') {
                    return await interaction.reply({
                        content: '✨ شكراً لك! تم استلام اقتراحك وسوف يتم مراجعته.',
                        ephemeral: true
                    });
                }
            }

        } catch (error) {
            console.error('Interaction Error:', error);
            const msg = '❌ حدث خطأ أثناء تنفيذ الطلب.';
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: msg, ephemeral: true });
            } else {
                await interaction.reply({ content: msg, ephemeral: true });
            }
        }
    }
};

async function renderAnimePage(interaction, animeId, page = 1, feedbackText = null) {
    const anime = await animeService.getAnimeById(animeId);
    if (!anime) {
        return await interaction.reply({ content: '❌ لم يتم العثور على بيانات هذا الأنمي.', ephemeral: true });
    }

    const { episodes, totalPages } = await animeService.getEpisodes(animeId, page, 25);
    const user = await userService.getUser(interaction.user.id);

    const isSaved = user.savedAnime.some(a => a._id.toString() === animeId.toString());
    const isNotified = user.notifications.some(id => id.toString() === animeId.toString());

    const embed = embeds.animeDetailsEmbed(anime, isSaved, isNotified);
    const rows = components.animeControlRows(animeId, episodes, page, totalPages, isSaved, isNotified);

    if (interaction.isModalSubmit() || !interaction.message) {
        await interaction.reply({ embeds: [embed], components: rows, ephemeral: true });
    } else {
        await interaction.update({ embeds: [embed], components: rows });
    }

    if (feedbackText) {
        await interaction.followUp({ content: feedbackText, ephemeral: true });
    }
}

async function renderEpisodePage(interaction, animeId, episodeNumber) {
    const anime = await animeService.getAnimeById(animeId);
    const episode = await animeService.getEpisodeByNumber(animeId, episodeNumber);

    if (!episode) {
        return await interaction.reply({
            content: `❌ الحلقة رقم **${episodeNumber}** غير متوفرة حالياً.`,
            ephemeral: true
        });
    }

    const { total: totalEpisodes } = await animeService.getEpisodes(animeId, 1, 1);
    const embed = embeds.episodeEmbed(anime, episode);
    const row = components.episodeWatchRows(animeId, episodeNumber, totalEpisodes, episode.watchUrl);

    if (interaction.isModalSubmit() || !interaction.message) {
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    } else {
        await interaction.update({ embeds: [embed], components: [row] });
    }
}
