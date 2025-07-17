import { StatusCodes } from 'http-status-codes';

export class BaseController {
  constructor(model) {
    this.model = model;
  }

  async getAll(_req, res) {
    const items = await this.model.findAll();
    return res.json(items);
  }

  async getById(req, res) {
    const item = await this.model.findByPk(req.params.id);
    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: `${this.resourceName} not found` });
    }
    return res.json(item);
  }

  async create(req, res) {
    try {
      const item = await this.model.create(req.body);
      return res.status(StatusCodes.CREATED).json(item);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(StatusCodes.CONFLICT).json({
          error: error.errors[0].message || "Duplicate entry"
        });
      }
      throw new Error("Internal Server Error!");
    }
  }

  async update(req, res) {
    const [updatedCount, updatedItems] = await this.model.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });
    if (updatedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: `${this.resourceName} not found` });
    }
    const updatedItem = updatedItems[0];
    return res.json(updatedItem);
  }

  async deleteById(req, res) {
    const deletedCount = await this.model.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: `${this.resourceName} not found` });
    }
    res.status(StatusCodes.NO_CONTENT).end();
  }
}
