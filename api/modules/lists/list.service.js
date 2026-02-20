import { listRepository } from "./list.repository.js";
import { cardRepository } from "../cards/card.repository.js";
import { AppError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";

const ALLOWED_INCLUDES = ["cards", "tags"];

function parseIncludes(queryString) {
    if (!queryString) return [];
    const requested = queryString.split(',');
    return requested.filter(inc => ALLOWED_INCLUDES.includes(inc));
}

export const listService = {
    async getLists(params, userId) {
        const includes = parseIncludes(params.include);
        const includeOptions = [];
        const order = [['position', 'ASC']];

        if (includes.includes('cards')) {
            const cardInclude = {
                model: (await import("../../models/card.model.js")).Card,
                as: "cards"
            };
            if (includes.includes('tags')) {
                cardInclude.include = [{
                    model: (await import("../../models/tag.model.js")).Tag,
                    as: "tags"
                }];
            }
            includeOptions.push(cardInclude);
            order.push([{ model: (await import("../../models/card.model.js")).Card, as: 'cards' }, 'position', 'ASC']);
        }

        return await listRepository.findAllByUser(userId, includeOptions, order);
    },

    async getListDetails(id, userId) {
        const list = await listRepository.findByIdAndUser(id, userId);
        if (!list) throw new AppError("List not found", 404);
        return list;
    },

    async createList(data, userId) {
        const list = await listRepository.create({ ...data, user_id: userId });
        logger.info({ listId: list.id, userId }, "List created");
        return list;
    },

    async updateList(id, data, userId) {
        const list = await listRepository.findByIdAndUser(id, userId);
        if (!list) throw new AppError("List not found", 404);

        await listRepository.update(id, data);
        logger.info({ listId: id, userId, data }, "List updated");
        return await listRepository.findByIdAndUser(id, userId);
    },

    async removeList(id, userId) {
        const list = await listRepository.findByIdAndUser(id, userId);
        if (!list) throw new AppError("List not found", 404);

        await listRepository.delete(id);
        logger.info({ listId: id, userId }, "List deleted");
    },

    async copyList(id, userId) {
        const list = await listRepository.findByIdWithDetails(id, userId);
        if (!list) throw new AppError("List not found", 404);

        // 1. Décaler les positions suivantes
        await listRepository.incrementPosition(userId, list.position);

        // 2. Créer la nouvelle liste
        const newList = await listRepository.create({
            title: `${list.title} (Copie)`,
            position: list.position + 1,
            user_id: userId
        });

        // 3. Dupliquer les cartes
        if (list.cards && list.cards.length > 0) {
            for (const card of list.cards) {
                const newCard = await cardRepository.create({
                    content: card.content,
                    description: card.description,
                    position: card.position,
                    color: card.color,
                    is_done: card.is_done,
                    list_id: newList.id
                });

                if (card.tags && card.tags.length > 0) {
                    await newCard.setTags(card.tags.map(t => t.id));
                }
            }
        }

        const fullNewList = await listRepository.findByIdWithDetails(newList.id, userId);
        logger.info({ originalId: id, copyId: newList.id, userId }, "List copied");
        return fullNewList;
    }
};
