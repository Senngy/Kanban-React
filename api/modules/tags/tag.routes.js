import express from "express";
import { getAll, getById, create, update, deleteById, getCardsByTagId } from './tag.controller.js';
import { validateTagCreation, validateTagUpdate } from './tag.middleware.js';
import { validateId } from '../../middlewares/common.middleware.js';
import { checkRole } from '../auth/auth.middleware.js';

const router = express.Router();

router.get('/', checkRole('user'), getAll);
router.get('/:id', checkRole('user'), validateId, getById);
router.post('/', checkRole('user'), validateTagCreation, create);
router.patch('/:id', checkRole('user'), validateId, validateTagUpdate, update);
router.delete('/:id', checkRole('user'), validateId, deleteById);
router.get('/:id/cards', checkRole('user'), validateId, getCardsByTagId);

export default router;