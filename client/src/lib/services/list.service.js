import api from "./api.js";

export const getLists = async () => {
    return await api('/lists?include=cards,tags');
};

export const createList = async (list) => {
  console.log("createList", list);
  return await api("/lists", "POST", list);
};

export const updateList = async (list) => {
  return await api(`/lists/${list.id}`, "PATCH", {
    title: list.title,
    position: list.position,
  });
};

export const deleteList = async (listId) => {
  return await api(`/lists/${listId}`, "DELETE");
};

export const copyList = async (listId) => {
  return await api(`/lists/${listId}/copy`, "POST");
};
