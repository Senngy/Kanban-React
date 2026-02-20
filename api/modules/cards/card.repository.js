import { Card, List } from "../../models/index.js";

export const cardRepository = {
    async findAll(filters = {}, include = "tags") {
        return await Card.findAll({
            where: filters,
            include: include
        });
    },

    async findAllWithListUser(userId, listId = null, include = "tags") {
        const whereList = { user_id: userId };
        if (listId) whereList.id = listId;

        return await Card.findAll({
            include: [
                {
                    model: List,
                    as: 'list',
                    where: whereList,
                    attributes: [] // On ne veut pas les données de la liste, juste le filtrage
                },
                include // "tags" par défaut
            ]
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
    }
};
