import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    role: Joi.string().valid("user", "admin").optional()
});

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

export const refreshSchema = Joi.object({
    // Le token est dans les cookies, mais on pourrait valider 
    // d'autres entrées si nécessaire
});
