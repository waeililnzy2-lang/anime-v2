const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    homeButtons() {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_search').setLabel('بحث').setEmoji('🔎').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('btn_latest').setLabel('حلقات جديدة').setEmoji('🔥').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_my_anime').setLabel('أنمياتي المحفوظة').setEmoji('🔖').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_suggest').setLabel('إقتراح أنمي').setEmoji('✨').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('btn_help').setLabel('الشرح').setEmoji('❔').setStyle(ButtonStyle.Secondary)
        );
    },

    animeControlRows(animeId, episodes, currentPage, totalPages, isSaved, isNotified) {
        const rows = [];

        if (episodes && episodes.length > 0) {
            const selectOptions = episodes.map(ep => ({
                label: `الحلقة ${ep.number}${ep.title ? ` - ${ep.title}` : ''}`.slice(0, 100),
                value: ep.number.toString(),
                emoji: '▶️'
            }));

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`select_ep_${animeId}`)
                .setPlaceholder('اختر الحلقة للمشاهدة')
                .addOptions(selectOptions);

            rows.push(new ActionRowBuilder().addComponents(selectMenu));
        }

        const navRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`btn_page_prev_${animeId}_${currentPage}`)
                .setLabel('السابق')
                .setEmoji('◀')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentPage <= 1),
            new ButtonBuilder()
                .setCustomId(`btn_page_next_${animeId}_${currentPage}`)
                .setLabel('التالي')
                .setEmoji('▶')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentPage >= totalPages),
            new ButtonBuilder()
                .setCustomId(`btn_jump_ep_${animeId}`)
                .setLabel('رقم الحلقة')
                .setEmoji('#️⃣')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`btn_save_${animeId}`)
                .setLabel(isSaved ? 'محفوظ' : 'حفظ')
                .setEmoji('🔖')
                .setStyle(isSaved ? ButtonStyle.Success : ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`btn_notify_${animeId}`)
                .setLabel(isNotified ? 'إشعار مفعل' : 'إشعار')
                .setEmoji('🔔')
                .setStyle(isNotified ? ButtonStyle.Success : ButtonStyle.Secondary)
        );
        rows.push(navRow);

        return rows;
    },

    episodeWatchRows(animeId, currentEpNum, totalEpisodes, watchUrl) {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`btn_anime_detail_${animeId}`)
                .setLabel('رجوع للأنمي')
                .setEmoji('↩️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`btn_ep_prev_${animeId}_${currentEpNum}`)
                .setLabel('الحلقة السابقة')
                .setEmoji('◀')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentEpNum <= 1),
            new ButtonBuilder()
                .setCustomId(`btn_ep_next_${animeId}_${currentEpNum}`)
                .setLabel('الحلقة التالية')
                .setEmoji('▶')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentEpNum >= totalEpisodes),
            new ButtonBuilder()
                .setURL(watchUrl)
                .setLabel('مشاهدة عبر المتصفح')
                .setEmoji('🌐')
                .setStyle(ButtonStyle.Link)
        );
    }
};
