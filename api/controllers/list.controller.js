import { List, Card, Tag } from '../models/index.js';
import { StatusCodes } from 'http-status-codes';

export async function getAll(req, res) {
  const includeOptions = [];
  const includes = req.query.include ? req.query.include.split(',') : [];

  if (includes.includes('cards')) {
    const includeCards = { model: Card, as: "cards" };
    if (includes.includes('tags')) {
      includeCards.include = [
        { model: Tag, as: "tags" }
      ];
    }
    includeOptions.push(includeCards);
  }

  const lists = await List.findAll({
    include: includeOptions
  });
  res.status(StatusCodes.OK).json(lists);
}

export async function create(req, res) {
  const list = await List.create(req.body);
  res.status(StatusCodes.CREATED).json(list);
}

export async function getById(req, res) {
  const list = await List.findByPk(req.params.id, {
    include: req.query.include ?? ""
  });
  if (!list) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'List not found' });
  }
  res.status(StatusCodes.OK).json(list);
}

export async function deleteById(req, res) {
  const deletedCount = await List.destroy({ where: { id: req.params.id } });
  if (deletedCount === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'List not found' });
  }
  res.status(StatusCodes.NO_CONTENT).end();
}

export async function update(req, res) {
  const [updatedCount, updatedList] = await List.update(req.body, {
    where: { id: req.params.id },
    returning: true
  });
  if (updatedCount === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'List not found' });
  }
  const updatedItem = updatedList[0];
  res.status(StatusCodes.OK).json(updatedItem);
}