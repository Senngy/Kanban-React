import express from "express";
import { getAll, getById, create, update, deleteById } from './card.controller.js';
import { validateCardCreation, validateCardUpdate } from './card.middleware.js';
import { validateId } from '../../middlewares/common.middleware.js';
import { checkRole } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Gestion des cartes de tâches
 */

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Récupérer toutes les cartes de l'utilisateur
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des cartes retournée
 */
router.get('/', checkRole('user'), getAll);

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Récupérer une carte par son ID
 *     tags: [Cards]
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
 *         description: Détails de la carte
 *       404:
 *         description: Carte non trouvée
 */
router.get('/:id', checkRole('user'), validateId, getById);

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Créer une nouvelle carte
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, list_id]
 *             properties:
 *               content: { type: string }
 *               list_id: { type: integer }
 *               position: { type: integer }
 *               color: { type: string }
 *     responses:
 *       201:
 *         description: Carte créée
 */
router.post('/', checkRole('user'), validateCardCreation, create);

/**
 * @swagger
 * /cards/{id}:
 *   patch:
 *     summary: Mettre à jour une carte
 *     tags: [Cards]
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
 *               content: { type: string }
 *               list_id: { type: integer }
 *               position: { type: integer }
 *               color: { type: string }
 *     responses:
 *       200:
 *         description: Carte mise à jour
 */
router.patch('/:id', checkRole('user'), validateId, validateCardUpdate, update);

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Supprimer une carte
 *     tags: [Cards]
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
 *         description: Carte supprimée
 */
router.delete('/:id', checkRole('user'), validateId, deleteById);

export default router;
