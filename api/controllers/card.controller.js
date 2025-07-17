import { Card } from "../models/card.model.js";
import { StatusCodes } from "http-status-codes";

export async function getAll(req, res) {
  const listId = parseInt(req.query.list_id);
  const whereClause = listId ? { list_id: listId } : {};

  const cards = await Card.findAll({
    where: whereClause,
    include: req.query.include ?? "",
  });
  return res.json(cards);
}

export async function create(req, res) {
  const card = await Card.create(req.body);
  return res.status(StatusCodes.CREATED).json(card);
}

export async function getById(req, res) {
  const card = await Card.findByPk(req.params.id, {
    include: req.query.include ?? "",
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
  const [updatedCount, updatedCard] = await Card.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  });
  if (updatedCount === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Card not found" });
  }
  const updatedItem = updatedCard[0];
  return res.json(updatedItem);
}
