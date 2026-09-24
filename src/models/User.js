const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true, index: true },
    savedAnime: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anime' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
