import { Card } from "../models/card.model.js";
import { StatusCodes } from "http-status-codes";

export async function getAll(req, res) {
  const listId = parseInt(req.query.list_id);
  const whereClause = listId ? { list_id: listId } : {};

  const cards = await Card.findAll({
    where: whereClause,
    include: req.query.include ?? "tags",
  });
  return res.json(cards);
}

export async function create(req, res) {
  const card = await Card.create(req.body);
  return res.status(StatusCodes.CREATED).json(card);
}

export async function getById(req, res) {
  const card = await Card.findByPk(req.params.id, {
    include: req.query.include ?? "tags",
  });
  if (!card) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Card not found" });
  }
  return res.json(card);
}

export async function deleteById(req, res) {
  const deletedCount = await Card.destroy({ where: { id: req.params.id } });
  if (deletedCount === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Card not found" });
  }
  res.status(StatusCodes.NO_CONTENT).end();
}

export async function update(req, res) {
  const cardId = req.params.id;
  const { tags, ...updateData } = req.body;
  
  console.log(`[Card Update] Updating card ${cardId}`, { tags, updateData });

  try {
    // 1. Update basic fields if there are any
    if (Object.keys(updateData).length > 0) {
      await Card.update(updateData, {
        where: { id: cardId },
      });
    }

    const card = await Card.findByPk(cardId);
    if (!card) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Card not found" });
    }

    // 2. Update associations if provided
    if (tags && Array.isArray(tags)) {
      console.log(`[Card Update] Setting tags for card ${cardId}:`, tags);
      await card.setTags(tags); 
    }

    // 3. Return updated card with tags
    const result = await Card.findByPk(cardId, { include: "tags" });
    return res.json(result);
  } catch (error) {
    console.error("[Card Update] Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
