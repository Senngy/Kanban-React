import { tagRepository } from "./tags.repository.js";
import { AppError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";

export const tagService = {
    async getTags(userId) {
        return await tagRepository.findAll(userId);
    },

    async getTagById(id, userId) {
        const tag = await tagRepository.findById(id, userId);
        if (!tag) {
            throw new AppError("Tag not found", 404);
        }
        return tag;
    },

    async createTag(data, userId) {
        try {
            const tag = await tagRepository.create({ ...data, user_id: userId });
            logger.info({ tagId: tag.id, userId }, "Tag created");
            return tag;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new AppError(error.errors[0].message || "Duplicate entry", 409);
            }
            throw error;
        }
    },

    async updateTag(id, userId, data) {
        const [updatedCount, updatedTags] = await tagRepository.update(id, userId, data);
        if (updatedCount === 0) {
            throw new AppError("Tag not found", 404);
        }
        logger.info({ tagId: id, userId, data }, "Tag updated");
        return updatedTags[0];
    },

    async removeTag(id, userId) {
        const deletedCount = await tagRepository.delete(id, userId);
        if (deletedCount === 0) {
            throw new AppError("Tag not found", 404);
        }
        logger.info({ tagId: id, userId }, "Tag deleted");
        return true;
    },

    async getCardsByTag(id, userId) {
        const tag = await tagRepository.findByIdWithCards(id, userId);
        if (!tag) {
            throw new AppError("Tag not found or access denied", 404);
        }
        return tag.cards;
    }
};
