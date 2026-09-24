const User = require('../models/User');

class UserService {
    async getUser(discordId) {
        let user = await User.findOne({ discordId }).populate('savedAnime');
        if (!user) {
            user = await User.create({ discordId, savedAnime: [], notifications: [] });
        }
        return user;
    }

    async toggleSave(discordId, animeId) {
        const user = await this.getUser(discordId);
        const index = user.savedAnime.findIndex(a => a._id.toString() === animeId.toString());
        
        if (index > -1) {
            user.savedAnime.splice(index, 1);
        } else {
            user.savedAnime.push(animeId);
        }
        await user.save();
        return index === -1;
    }

    async toggleNotification(discordId, animeId) {
        const user = await this.getUser(discordId);
        const index = user.notifications.findIndex(id => id.toString() === animeId.toString());
        
        if (index > -1) {
            user.notifications.splice(index, 1);
        } else {
            user.notifications.push(animeId);
        }
        await user.save();
        return index === -1;
    }
}

module.exports = new UserService();
