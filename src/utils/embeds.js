const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    homeEmbed() {
        return new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🎬 مشاهدة الأنمي')
            .setDescription(
                'مرحباً بك في منصة مشاهدة واستكشاف الأنمي داخل Discord!\n\n' +
                '• أكثر من **2000** عنوان أنمي.\n' +
                '• خدمة سريعة واستجابة فورية.\n' +
                '• ميزة المشاهدة الجماعية داخل الأنابيب الصوتية.\n\n' +
                'استخدم الأزرار أدناه للبدء واستكشاف المكتبة.'
            )
            .setImage(config.images.defaultBanner);
    },

    animeDetailsEmbed(anime, isSaved = false, isNotified = false) {
        const genres = anime.genres?.length ? anime.genres.join(' • ') : 'غير محدد';
        
        return new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(anime.title)
            .setDescription(anime.description)
            .setThumbnail(anime.image)
            .addFields(
                { name: '🏷️ التصنيفات', value: genres, inline: false },
                { name: '⭐ التقييم', value: `${anime.rating || 'N/A'}`, inline: true },
                { name: '📅 السنة', value: `${anime.year || 'N/A'}`, inline: true },
                { name: '🟢 الحالة', value: `${anime.status}`, inline: true }
            );
    },

    episodeEmbed(anime, episode) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`${anime.title} — الحلقة ${episode.number}`)
            .setDescription(episode.title ? `**عنوان الحلقة:** ${episode.title}` : 'مشاهدة ممتعة!');

        if (episode.image) {
            embed.setImage(episode.image);
        } else if (anime.banner || anime.image) {
            embed.setImage(anime.banner || anime.image);
        }

        return embed;
    },

    savedAnimeEmbed(savedList) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🔖 أنمياتي المحفوظة');

        if (!savedList || savedList.length === 0) {
            embed.setDescription('لا توجد أنميات محفوظة في قائمتك حالياً.');
            return embed;
        }

        const listText = savedList.map((a, i) => `${i + 1}. **${a.title}** (⭐ ${a.rating || 'N/A'})`).join('\n');
        embed.setDescription(listText);
        return embed;
    },

    latestEpisodesEmbed(episodes) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🔥 آخر الحلقات المضافة');

        if (!episodes || episodes.length === 0) {
            embed.setDescription('لا توجد حلقات مضافة حديثاً.');
            return embed;
        }

        const listText = episodes.map(ep => 
            `• **${ep.animeId?.title || 'أنمي'}** — الحلقة **${ep.number}**`
        ).join('\n');

        embed.setDescription(listText);
        return embed;
    }
};
