const mongoose = require('mongoose');
const config = require('./config');

async function connectDatabase() {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('✅ Connected to MongoDB successfully.');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDatabase;
