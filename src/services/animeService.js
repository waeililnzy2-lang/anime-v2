const Anime = require('../models/Anime');
const Episode = require('../models/Episode');

class AnimeService {
    async searchAnime(query, limit = 10) {
        return await Anime.find({
            title: { $regex: query, $options: 'i' }
        }).limit(limit).lean();
    }

    async getAnimeById(animeId) {
        return await Anime.findById(animeId).lean();
    }

    async getEpisodes(animeId, page = 1, limit = 25) {
        const skip = (page - 1) * limit;
        const [episodes, total] = await Promise.all([
            Episode.find({ animeId }).sort({ number: 1 }).skip(skip).limit(limit).lean(),
            Episode.countDocuments({ animeId })
        ]);
        return { episodes, total, totalPages: Math.ceil(total / limit) };
    }

    async getEpisodeByNumber(animeId, episodeNumber) {
        return await Episode.findOne({ animeId, number: episodeNumber }).lean();
    }

    async getLatestEpisodes(limit = 5) {
        return await Episode.find().sort({ publishedAt: -1 }).limit(limit).populate('animeId').lean();
    }

    async incrementViews(animeId) {
        await Anime.findByIdAndUpdate(animeId, { $inc: { views: 1 } });
    }
}

module.exports = new AnimeService();
