import Joi from "joi";
import { checkBody } from "../utils/common.util.js";

export function validateCardCreation(req, res, next) {
    const createCardSchema = Joi.object({
        content: Joi.string().required(),
        position: Joi.number().required(),
        list_id: Joi.number().required(),
        color: Joi.string(),
    });
    checkBody(createCardSchema, req.body, res, next);
}

export function validateCardUpdate(req, res, next) {
    const updateCardSchema = Joi.object({
        content: Joi.string(),
        position: Joi.number(),
        color: Joi.string(),
        list_id: Joi.number()
    });
    checkBody(updateCardSchema, req.body, res, next);
}