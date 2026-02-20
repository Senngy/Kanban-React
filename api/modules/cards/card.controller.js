import { cardService } from "./card.service.js";
import { StatusCodes } from "http-status-codes";

export async function getAll(req, res) {
  try {
    const cards = await cardService.getCards(req.query, req.userId);
    return res.json(cards);
  } catch (error) {
    throw error;
  }
}

export async function create(req, res) {
  try {
    const card = await cardService.createNewCard(req.body, req.userId);
    return res.status(StatusCodes.CREATED).json(card);
  } catch (error) {
    throw error;
  }
}

export async function getById(req, res) {
  try {
    const card = await cardService.getCardDetails(req.params.id, req.query, req.userId);
    return res.json(card);
  } catch (error) {
    throw error;
  }
}

export async function deleteById(req, res) {
  try {
    await cardService.removeCard(req.params.id, req.userId);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    throw error;
  }
}

export async function update(req, res) {
  try {
    const card = await cardService.updateCard(req.params.id, req.body, req.userId);
    return res.json(card);
  } catch (error) {
    throw error;
  }
}
