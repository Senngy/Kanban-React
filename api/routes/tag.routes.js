import express from "express";
import { getAll, getById, create, update, deleteById, getCardsByTagId } from '../controllers/tag.controller.js';
import { validateTagCreation, validateTagUpdate } from '../middlewares/tag.middleware.js';
import { validateId } from '../middlewares/common.middleware.js';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', validateId, getById);
router.post('/', validateTagCreation, create);
router.patch('/:id', validateId, validateTagUpdate, update);
router.delete('/:id', validateId, deleteById);
router.get('/:id/cards', validateId, getCardsByTagId);

export default router;