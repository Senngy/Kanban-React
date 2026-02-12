import api from "./api.js";

export const getCards = async (listId) => {
    return await api(`/cards?list_id=${listId}`);
};

export const createCard = async (card) => {
  return await api("/cards", "POST", card);
};

export const updateCard = async (card) => {
    return await api(`/cards/${card.id}`, 'PATCH', {
        content: card.content,
        description: card.description,
        position: card.position,
        color: card.color,
        list_id: card.list_id,
        is_done: card.is_done,
        tags: card.tags, // Array of tag IDs if provided
     })
};

export const deleteCard = async (cardId) => {
  return await api(`/cards/${cardId}`, "DELETE");
};
