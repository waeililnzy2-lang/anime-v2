const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    title: { type: String, default: '' },
    url: { type: String, required: true },
    addedBy: {
        userId: { type: String, required: true },
        username: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

const animeSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    addedBy: {
        userId: { type: String, required: true },
        username: { type: String, required: true }
    },
    episodes: [episodeSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Anime', animeSchema);
