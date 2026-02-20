import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cardService } from './card.service.js';
import { cardRepository } from './card.repository.js';
import { listRepository } from '../lists/list.repository.js';
import { AppError } from '../../utils/errors.js';

vi.mock('./card.repository.js');
vi.mock('../lists/list.repository.js');

describe('CardService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCardDetails', () => {
        it('should return card details if it belongs to the user', async () => {
            const mockCard = { id: 1, list_id: 10 };
            const mockList = { id: 10, user_id: 100 };

            cardRepository.findById.mockResolvedValue(mockCard);
            listRepository.findByIdAndUser.mockResolvedValue(mockList);

            const result = await cardService.getCardDetails(1, {}, 100);
            expect(result).toEqual(mockCard);
        });

        it('should throw AppError if card does not exist', async () => {
            cardRepository.findById.mockResolvedValue(null);

            await expect(cardService.getCardDetails(1, {}, 100))
                .rejects.toThrow(AppError);
        });

        it('should throw AppError if user does not own the card', async () => {
            const mockCard = { id: 1, list_id: 10 };

            cardRepository.findById.mockResolvedValue(mockCard);
            listRepository.findByIdAndUser.mockResolvedValue(null);

            await expect(cardService.getCardDetails(1, {}, 100))
                .rejects.toThrow(AppError);
        });
    });
});
