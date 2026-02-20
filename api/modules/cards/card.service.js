import { cardRepository } from "./card.repository.js";
import { listRepository } from "../lists/list.repository.js";
import { AppError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";

const ALLOWED_INCLUDES = ["tags", "list"];

function validateInclude(include) {
    if (!include) return "tags";
    if (Array.isArray(include)) {
        return include.filter(inc => ALLOWED_INCLUDES.includes(inc));
    }
    return ALLOWED_INCLUDES.includes(include) ? include : "tags";
}

export const cardService = {
    async getCards(params, userId) {
        const listId = params.list_id ? parseInt(params.list_id) : null;
        const include = validateInclude(params.include);

        // Optimisation : une seule requête jointe
        return await cardRepository.findAllWithListUser(userId, listId, include);
    },

    async getCardDetails(id, params, userId) {
        const include = validateInclude(params.include);
        const card = await cardRepository.findById(id, include);

        if (!card) {
            throw new AppError("Card not found", 404);
        }

        // Vérification de sécurité via le repository List
        const list = await listRepository.findByIdAndUser(card.list_id, userId);
        if (!list) {
            throw new AppError("Access denied", 403);
        }

        return card;
    },

    async createNewCard(data, userId) {
        // 1. Vérifier si la liste existe et appartient à l'utilisateur via Repository
        const list = await listRepository.findByIdAndUser(data.list_id, userId);

        if (!list) {
            throw new AppError("List not found or access denied", 403);
        }

        const card = await cardRepository.create(data);
        logger.info({ cardId: card.id, userId, listId: data.list_id }, "Card created");
        return card;
    },

    async updateCard(id, data, userId) {
        // 1. Récupérer la carte
        const card = await cardRepository.findById(id);
        if (!card) {
            throw new AppError("Card not found", 404);
        }

        // 2. Vérification de sécurité (appartenance)
        const list = await listRepository.findByIdAndUser(card.list_id, userId);
        if (!list) {
            throw new AppError("Access denied", 403);
        }

        // 3. Si changement de liste, vérifier la nouvelle liste destination
        if (data.list_id && data.list_id !== card.list_id) {
            const newList = await listRepository.findByIdAndUser(data.list_id, userId);
            if (!newList) {
                throw new AppError("Target list not found or access denied", 403);
            }
        }

        const { tags, ...updateData } = data;

        if (Object.keys(updateData).length > 0) {
            await cardRepository.update(id, updateData);
        }

        if (tags && Array.isArray(tags)) {
            // Note: on utilise l'instance card pour setTags (Sequelize mixin)
            await card.setTags(tags);
        }

        const updatedCard = await cardRepository.findById(id, "tags");
        logger.info({ cardId: id, userId, data: updateData }, "Card updated");
        return updatedCard;
    },

    async removeCard(id, userId) {
        const card = await cardRepository.findById(id);
        if (!card) {
            throw new AppError("Card not found", 404);
        }

        const list = await listRepository.findByIdAndUser(card.list_id, userId);
        if (!list) {
            throw new AppError("Access denied", 403);
        }

        const deletedCount = await cardRepository.delete(id);
        logger.info({ cardId: id, userId }, "Card deleted");
        return deletedCount > 0;
    }
};
