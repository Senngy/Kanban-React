import { tagService } from './tags.service.js';
import { StatusCodes } from 'http-status-codes';

export async function getAll(req, res) {
    try {
        const tags = await tagService.getTags(req.userId);
        return res.json(tags);
    } catch (error) {
        throw error;
    }
}

export async function create(req, res) {
    try {
        const tag = await tagService.createTag(req.body, req.userId);
        return res.status(StatusCodes.CREATED).json(tag);
    } catch (error) {
        throw error;
    }
}

export async function getById(req, res) {
    try {
        const tag = await tagService.getTagById(req.params.id, req.userId);
        return res.json(tag);
    } catch (error) {
        throw error;
    }
}

export async function deleteById(req, res) {
    try {
        await tagService.removeTag(req.params.id, req.userId);
        res.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
        throw error;
    }
}

export async function update(req, res) {
    try {
        const updatedItem = await tagService.updateTag(req.params.id, req.userId, req.body);
        return res.json(updatedItem);
    } catch (error) {
        throw error;
    }
}

export async function getCardsByTagId(req, res) {
    try {
        const cards = await tagService.getCardsByTag(req.params.id, req.userId);
        return res.json(cards);
    } catch (error) {
        throw error;
    }
}
