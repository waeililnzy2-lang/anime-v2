require('dotenv').config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    mongoUri: process.env.MONGO_URI,
    colors: {
        primary: 0x2b2d31,
        success: 0x57f287,
        error: 0xed4245,
        warning: 0xfee75c
    },
    images: {
        defaultBanner: 'https://i.imgur.com/8Q9Z3ZX.png',
        defaultThumbnail: 'https://i.imgur.com/AfFp7pu.png'
    }
};
