import api from "./api.js";

export const getTags = async () => {
    return await api(`/tags`);
};

export const createTag = async (tag) => {
  return await api("/tags", "POST", tag);
};

export const updateTag = async (tag) => {
  console.log("updateTag service tag:", tag);
    return await api(`/tags/${tag.id}`, 'PATCH', {
        name: tag.name,
        color: tag.color
     })
};

export const deleteTag = async (tagId) => {
  return await api(`/tags/${tagId}`, "DELETE");
};
