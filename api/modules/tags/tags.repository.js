import { Tag, Card } from "../../models/index.js";

export const tagRepository = {
    async findAll(userId) {
        return await Tag.findAll({
            where: { user_id: userId }
        });
    },

    async findById(id, userId) {
        return await Tag.findOne({
            where: { id, user_id: userId }
        });
    },

    async findByIdWithCards(id, userId) {
        return await Tag.findOne({
            where: { id, user_id: userId },
            include: [{
                model: Card,
                as: 'cards'
            }]
        });
    },

    async create(data) {
        return await Tag.create(data);
    },

    async update(id, userId, data) {
        const [updatedCount, updatedTags] = await Tag.update(data, {
            where: { id, user_id: userId },
            returning: true
        });
        return [updatedCount, updatedTags];
    },

    async delete(id, userId) {
        return await Tag.destroy({
            where: { id, user_id: userId }
        });
    }
};
