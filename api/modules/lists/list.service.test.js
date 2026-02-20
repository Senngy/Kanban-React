import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listService } from './list.service.js';
import { listRepository } from './list.repository.js';
import { cardRepository } from '../cards/card.repository.js';
import { AppError } from '../../utils/errors.js';

vi.mock('./list.repository.js');
vi.mock('../cards/card.repository.js');
vi.mock('../../utils/logger.js', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

describe('ListService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getListDetails', () => {
        it('should return list details for authorized user', async () => {
            const mockList = { id: 1, title: 'Test List', user_id: 10 };
            listRepository.findByIdAndUser.mockResolvedValue(mockList);

            const result = await listService.getListDetails(1, 10);
            expect(result).toEqual(mockList);
            expect(listRepository.findByIdAndUser).toHaveBeenCalledWith(1, 10);
        });

        it('should throw 404 if list not found or not owned', async () => {
            listRepository.findByIdAndUser.mockResolvedValue(null);
            await expect(listService.getListDetails(99, 10)).rejects.toThrow("List not found");
        });
    });

    describe('copyList', () => {
        it('should duplicate list and its cards', async () => {
            const userId = 10;
            const originalList = {
                id: 1,
                title: 'Original',
                position: 1,
                user_id: userId,
                cards: [
                    { content: 'Card 1', position: 1, tags: [] }
                ]
            };
            const newList = { id: 2, title: 'Original (Copie)', position: 2, user_id: userId };

            listRepository.findByIdWithDetails.mockResolvedValue(originalList);
            listRepository.create.mockResolvedValue(newList);
            cardRepository.create.mockResolvedValue({ id: 101 });
            listRepository.findByIdWithDetails.mockResolvedValueOnce(originalList) // for initial fetch
                .mockResolvedValueOnce(newList); // for final fetch

            const result = await listService.copyList(1, userId);

            expect(listRepository.incrementPosition).toHaveBeenCalledWith(userId, 1);
            expect(listRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Original (Copie)',
                position: 2
            }));
            expect(cardRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                content: 'Card 1',
                list_id: 2
            }));
        });
    });
});
