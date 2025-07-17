import { Card } from "../../models/card.model.js";
import { StatusCodes } from 'http-status-codes';
import { BaseController } from './base.controller.js';

class CardController extends BaseController {
  constructor() {
    super(Card);
    this.resourceName = 'Card';
  }

  async getAll(req, res) {
    const listId = parseInt(req.query.list_id);
    const whereClause = listId ? { list_id: listId } : {};

    const cards = await this.model.findAll({
        where: whereClause,
        include: req.query.include ?? ""
    });
    return res.json(cards);
  }

  async getById(req, res) {
    const card = await this.model.findByPk(req.params.id, { 
        include: req.query.include ?? ""
    });
    if (!card) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Card not found" });
    }
    return res.json(card);
  }
}

// Instantiate the controller
const cardController = new CardController();

// Export the methods to be used by routes
export const getAll = cardController.getAll.bind(cardController);
export const getById = cardController.getById.bind(cardController);
export const create = cardController.create.bind(cardController);
export const update = cardController.update.bind(cardController);
export const deleteById = cardController.deleteById.bind(cardController);
