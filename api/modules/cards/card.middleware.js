import Joi from "joi";
import { checkBody } from "../../utils/common.util.js";

export function validateCardCreation(req, res, next) {
    const createCardSchema = Joi.object({
        content: Joi.string().required(),
        position: Joi.number().required(),
        list_id: Joi.number().required(),
        color: Joi.string(),
        description: Joi.string().allow("", null),
        tags: Joi.array().items(Joi.number()),
        is_done: Joi.boolean()
    });
    checkBody(createCardSchema, req.body, res, next);
}

export function validateCardUpdate(req, res, next) {
    const updateCardSchema = Joi.object({
        content: Joi.string(),
        position: Joi.number(),
        color: Joi.string(),
        description: Joi.string().allow("", null),
        list_id: Joi.number(),
        tags: Joi.array().items(Joi.number()),
        is_done: Joi.boolean()
    });
    checkBody(updateCardSchema, req.body, res, next);
}