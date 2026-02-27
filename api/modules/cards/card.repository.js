import { Card, List } from "../../models/index.js";
import { Op } from "sequelize";

export const cardRepository = {
    async findAll(filters = {}, include = "tags") {
        return await Card.findAll({
            where: filters,
            include: include
        });
    },

    async findAllWithListUser(userId, listId = null, include = "tags", pagination = {}) {
        const { limit, offset } = pagination;
        const whereList = { user_id: userId };
        if (listId) whereList.id = listId;

        return await Card.findAll({
            include: [
                {
                    model: List,
                    as: 'list',
                    where: whereList,
                    attributes: []
                },
                include
            ],
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
            order: [['position', 'ASC']]
        });
    },

    async findById(id, include = "tags") {
        return await Card.findByPk(id, {
            include: include
        });
    },

    async create(data) {
        return await Card.create(data);
    },

    async update(id, data) {
        return await Card.update(data, {
            where: { id }
        });
    },

    async delete(id) {
        return await Card.destroy({
            where: { id }
        });
    },

    async incrementPosition(listId, threshold) {
        return await Card.increment('position', {
            by: 1,
            where: {
                list_id: listId,
                position: { [Op.gt]: threshold }
            }
        });
    }
};
