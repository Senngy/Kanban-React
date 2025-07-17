import { Tag } from '../models/tag.model.js';
import { StatusCodes } from 'http-status-codes';

export async function getAll(_req, res) {
    const tags = await Tag.findAll();
    return res.json(tags);
}

export async function create(req, res) {
    try {
        const tag = await Tag.create(req.body)
        return res.status(StatusCodes.CREATED).json(tag);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(StatusCodes.CONFLICT).json({ 
                error: error.errors[0].message || "Duplicate entry"
            });
        }
        throw new Error("Internal Server Error !");
    }
}

export async function getById(req, res) {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Tag not found" });
    }
    return res.json(tag);
}

export async function deleteById(req, res) {
    const deletedCount = await Tag.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Tag not found' });
    }
    res.status(StatusCodes.NO_CONTENT).end();
}

export async function update(req, res) {
    const [updatedCount, updatedTag] = await Tag.update(req.body, {
        where: { id: req.params.id },
        returning: true
    });
    if (updatedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Tag not found" });
    }
    const updatedItem = updatedTag[0];
    return res.json(updatedItem);
}

export async function getCardsByTagId(req, res) {
    const tagId = req.params.id;
    const result = await Tag.findByPk(tagId, {
        include: "cards"
    });
    if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Tag not found" });
    }
    return res.json(result.cards);
}