import express from "express";
import { getAll, getById, create, update, deleteById } from '../controllers/card.controller.js';
import { validateCardCreation, validateCardUpdate } from '../middlewares/card.middleware.js';
import { validateId } from '../middlewares/common.middleware.js';
import { checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', checkRole('user'), getAll);
router.get('/:id', checkRole('user'), validateId, getById);
router.post('/', checkRole('user'), validateCardCreation, create);
router.patch('/:id', checkRole('user'), validateId, validateCardUpdate, update);
router.delete('/:id', checkRole('user'), validateId, deleteById);

export default router;
