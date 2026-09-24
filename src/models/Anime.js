const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, default: 'لا يوجد وصف متاح حالياً.' },
    image: { type: String, required: true },
    banner: { type: String },
    genres: [{ type: String }],
    rating: { type: Number, default: 0.0 },
    year: { type: Number, default: new Date().getFullYear() },
    status: { type: String, enum: ['مستمر', 'مكتمل', 'قريباً'], default: 'مستمر' },
    views: { type: Number, default: 0 }
}, { timestamps: true });

animeSchema.index({ title: 'text' });

module.exports = mongoose.model('Anime', animeSchema);
