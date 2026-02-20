import express from 'express';
import { getAll, getById, create, update, deleteById, copy } from './list.controller.js';
import { validateListCreation, validateListUpdate } from './list.middleware.js';
import { validateId } from '../../middlewares/common.middleware.js';
import { checkRole } from '../auth/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: Gestion des listes de tâches
 */

/**
 * @swagger
 * /lists:
 *   get:
 *     summary: Récupérer toutes les listes de l'utilisateur
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des listes retournée
 */
router.get('/', checkRole('user'), getAll);

/**
 * @swagger
 * /lists/{id}:
 *   get:
 *     summary: Récupérer une liste par son ID
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la liste
 *       404:
 *         description: Liste non trouvée
 */
router.get('/:id', checkRole('user'), validateId, getById);

/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Créer une nouvelle liste
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               position: { type: integer }
 *     responses:
 *       201:
 *         description: Liste créée
 */
router.post('/', checkRole('user'), validateListCreation, create);

/**
 * @swagger
 * /lists/{id}:
 *   patch:
 *     summary: Mettre à jour une liste
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               position: { type: integer }
 *     responses:
 *       200:
 *         description: Liste mise à jour
 */
router.patch('/:id', checkRole('user'), validateId, validateListUpdate, update);

/**
 * @swagger
 * /lists/{id}/copy:
 *   post:
 *     summary: Copier une liste et ses cartes
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Liste copiée avec succès
 */
router.post('/:id/copy', checkRole('user'), validateId, copy);

/**
 * @swagger
 * /lists/{id}:
 *   delete:
 *     summary: Supprimer une liste
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Liste supprimée
 */
router.delete('/:id', checkRole('user'), validateId, deleteById);

export default router;