const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
    animeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true, index: true },
    number: { type: Number, required: true },
    title: { type: String, default: '' },
    watchUrl: { type: String, required: true },
    image: { type: String },
    publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

episodeSchema.index({ animeId: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Episode', episodeSchema);
