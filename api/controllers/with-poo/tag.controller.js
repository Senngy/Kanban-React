import { Tag } from '../../models/tag.model.js';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from './base.controller.js';

class TagController extends BaseController {
  constructor() {
    super(Tag);
    this.resourceName = 'Tag';
  }

  async getCardsByTagId(req, res) {
    const tagId = req.params.id;
    const result = await this.model.findByPk(tagId, {
      include: "cards"
    });
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Tag not found" });
    }
    return res.json(result.cards);
  }
}

// Instancie le controller
const tagController = new TagController();

// Exporte les méthodes pour être utilisées par les routes
export const getAll = tagController.getAll.bind(tagController);
export const getById = tagController.getById.bind(tagController);
export const create = tagController.create.bind(tagController);
export const update = tagController.update.bind(tagController);
export const deleteById = tagController.deleteById.bind(tagController);
export const getCardsByTagId = tagController.getCardsByTagId.bind(tagController);