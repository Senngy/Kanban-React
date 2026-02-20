import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tagService } from './tags.service.js';
import { tagRepository } from './tags.repository.js';
import { AppError } from '../../utils/errors.js';

vi.mock('./tags.repository.js');
vi.mock('../../utils/logger.js', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

describe('TagService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getTagById', () => {
        it('should return tag if authorized', async () => {
            const mockTag = { id: 1, name: 'Urgent', user_id: 10 };
            tagRepository.findById.mockResolvedValue(mockTag);

            const result = await tagService.getTagById(1, 10);
            expect(result).toEqual(mockTag);
        });

        it('should throw 404 if tag not found', async () => {
            tagRepository.findById.mockResolvedValue(null);
            await expect(tagService.getTagById(99, 10)).rejects.toThrow("Tag not found");
        });
    });

    describe('createTag', () => {
        it('should create a tag for the user', async () => {
            const tagData = { name: 'New Tag', color: '#ff0000' };
            const mockTag = { id: 5, ...tagData, user_id: 10 };
            tagRepository.create.mockResolvedValue(mockTag);

            const result = await tagService.createTag(tagData, 10);
            expect(result).toEqual(mockTag);
            expect(tagRepository.create).toHaveBeenCalledWith(expect.objectContaining({ user_id: 10 }));
        });
    });

    describe('getCardsByTag', () => {
        it('should return cards associated with the tag', async () => {
            const mockTagWithCards = {
                id: 1,
                cards: [{ id: 101, content: 'Some Card' }]
            };
            tagRepository.findByIdWithCards.mockResolvedValue(mockTagWithCards);

            const result = await tagService.getCardsByTag(1, 10);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(101);
        });

        it('should throw 404 if tag not found or access denied', async () => {
            tagRepository.findByIdWithCards.mockResolvedValue(null);
            await expect(tagService.getCardsByTag(1, 10)).rejects.toThrow("Tag not found");
        });
    });
});
