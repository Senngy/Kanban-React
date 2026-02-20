import { List, Card, Tag } from "../../models/index.js";
import { Op } from "sequelize";

export const listRepository = {
    async findById(id) {
        return await List.findByPk(id);
    },

    async findByIdAndUser(id, userId) {
        return await List.findOne({
            where: { id, user_id: userId }
        });
    },

    async findByIdWithDetails(id, userId) {
        return await List.findOne({
            where: { id, user_id: userId },
            include: [
                {
                    model: Card,
                    as: 'cards',
                    include: [{ model: Tag, as: 'tags' }]
                }
            ],
            order: [[{ model: Card, as: 'cards' }, 'position', 'ASC']]
        });
    },

    async findAllByUser(userId, includeOptions = [], order = [['position', 'ASC']]) {
        return await List.findAll({
            where: { user_id: userId },
            include: includeOptions,
            order: order
        });
    },

    async create(data) {
        return await List.create(data);
    },

    async update(id, data) {
        return await List.update(data, {
            where: { id }
        });
    },

    async delete(id) {
        return await List.destroy({
            where: { id }
        });
    },

    async incrementPosition(userId, threshold) {
        return await List.increment('position', {
            by: 1,
            where: {
                user_id: userId,
                position: { [Op.gt]: threshold }
            }
        });
    }
};
