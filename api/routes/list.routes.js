import express from 'express';
import { getAll, getById, create, update, deleteById } from '../controllers/list.controller.js';
import { validateListCreation, validateListUpdate } from '../middlewares/list.middleware.js';
import { validateId } from '../middlewares/common.middleware.js';
import { checkRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', checkRole('user'), getAll);
router.get('/:id', checkRole('user'), validateId, getById);
router.post('/', checkRole('admin'), validateListCreation, create);
router.patch('/:id', checkRole('user'), validateId, validateListUpdate, update);
router.delete('/:id', checkRole('admin'), validateId, deleteById);

export default router;