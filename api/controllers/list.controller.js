import { List, Card, Tag } from '../models/index.js';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';

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

  const order = [['position', 'ASC']];
  if (includes.includes('cards')) {
    order.push([{ model: Card, as: 'cards' }, 'position', 'ASC']);
  }

  const lists = await List.findAll({
    where: { user_id: req.userId },
    include: includeOptions,
    order: order
  });
  res.status(StatusCodes.OK).json(lists);
}

export async function create(req, res) {
  const list = await List.create({ ...req.body, user_id: req.userId });
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

export async function copy(req, res) {
  const list = await List.findByPk(req.params.id, {
    include: [
      {
        model: Card,
        as: 'cards',
        include: [{ model: Tag, as: 'tags' }]
      }
    ]
  });

  if (!list) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'List not found' });
  }

  // 1. Shift positions of subsequent lists to make room
  await List.increment('position', {
    by: 1,
    where: {
      user_id: req.userId,
      position: { [Op.gt]: list.position }
    }
  });

  // 2. Create new List at position + 1
  const newList = await List.create({
    title: `${list.title} (Copie)`,
    position: list.position + 1,
    user_id: req.userId
  });

  // 3. Duplicate Cards
  if (list.cards && list.cards.length > 0) {
    for (const card of list.cards) {
      const newCard = await Card.create({
        content: card.content,
        description: card.description,
        position: card.position,
        color: card.color,
        is_done: card.is_done,
        list_id: newList.id
      });

      // 3. Associate Tags
      if (card.tags && card.tags.length > 0) {
        await newCard.setTags(card.tags.map(t => t.id));
      }
    }
  }

  // Return full list with associations for frontend
  const fullNewList = await List.findByPk(newList.id, {
    include: [
      {
        model: Card,
        as: 'cards',
        include: [{ model: Tag, as: 'tags' }]
      }
    ]
  });

  res.status(StatusCodes.CREATED).json(fullNewList);
}