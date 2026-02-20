import express from "express";
import { getAll, getById, create, update, deleteById, getCardsByTagId } from './tag.controller.js';
import { validateTagCreation, validateTagUpdate } from './tag.middleware.js';
import { validateId } from '../../middlewares/common.middleware.js';
import { checkRole } from '../auth/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Gestion des étiquettes (Tags)
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Récupérer tous les tags de l'utilisateur
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tags retournée
 */
router.get('/', checkRole('user'), getAll);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Récupérer un tag par son ID
 *     tags: [Tags]
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
 *         description: Détails du tag
 *       404:
 *         description: Tag non trouvé
 */
router.get('/:id', checkRole('user'), validateId, getById);

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Créer un nouveau tag
 *     tags: [Tags]
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
 *               color: { type: string }
 *     responses:
 *       201:
 *         description: Tag créé
 */
router.post('/', checkRole('user'), validateTagCreation, create);

/**
 * @swagger
 * /tags/{id}:
 *   patch:
 *     summary: Mettre à jour un tag
 *     tags: [Tags]
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
 *               color: { type: string }
 *     responses:
 *       200:
 *         description: Tag mis à jour
 */
router.patch('/:id', checkRole('user'), validateId, validateTagUpdate, update);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Supprimer un tag
 *     tags: [Tags]
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
 *         description: Tag supprimé
 */
router.delete('/:id', checkRole('user'), validateId, deleteById);

/**
 * @swagger
 * /tags/{id}/cards:
 *   get:
 *     summary: Récupérer toutes les cartes liées à un tag
 *     tags: [Tags]
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
 *         description: Liste des cartes retournée
 */
router.get('/:id/cards', checkRole('user'), validateId, getCardsByTagId);

export default router;