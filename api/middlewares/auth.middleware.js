import Joi from "joi";
import { checkBody } from "../utils/common.util.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";

export function validateUserCreation(req, res, next) {
    const createUserSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(8).required(),
        email: Joi.string().email().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        role: Joi.string().required() // l'utilisateur ne connait pas les id, il doit fournir le nom du role
    });
    checkBody(createUserSchema, req.body, res, next);
}

export function authenticate(req, res, next){ 
    /*
    const authHeader = req.headers.authorization;
    
    // Si le header n'existe pas
    // OU Si la valeur ne commence pas par Bearer
    // Alors non connecté
    if (! authHeader || ! authHeader.startsWith('Bearer '))
    {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: "missing token"})
    }
        */

    //const token = authHeader.split(' ')[1];
    const token = req.cookies.token; 
    console.log(token);
    if (! token)
    {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: "missing token"})
    }

    try {
        const dataDecoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(dataDecoded);
        req.userId = dataDecoded.user_id;

        next();
    }
    catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({error: 'Token invalid or expired'});

    }
    // token n'existe pas et est valide et contient un id connu
    // Alors appeler le prochain middleware
    // Sinon refusé l'accès

}

export function checkRole(requiredRole){
    return async (req, res, next) => {
        // req => userId
        try {
            // récupérer l'utilisateur connecté
            const user = await User.findByPk(req.userId, {
                include: { model: Role, as : "role"}
            })

            if(! user) {
                res.status(StatusCodes.FORBIDDEN).json({error: "Accès refusé"});
            }

            
            // si le role est admin alors next() car les admin peuvent tout faire
            if(user.role.name === 'admin') {
                next();
            }
            // si le role de l'utilisateur est égal au requiredRole alors next()
            else if (user.role.name === requiredRole) {
                // si on est en "PATCH" sur /cards on modifie le contenu envoyé pour n'accepter que position et list_id
                if (req.method === "PATCH" && req.path.startsWith('/cards'))
                {
                    const position = req.body.position;
                    const list_id = req.body.list_id;
                    // on écrase le body avec uniquement position et list_id
                    req.body = { position, list_id }
                }
                else if (req.method === "PATCH" && req.path.startsWith('/lists'))
                {
                    const position = req.body.position;
                    // on écrase le body avec uniquement position et list_id
                    req.body = { position}
                }
                next();
            }
            else {
                // sinon erreur accès interdit
                res.status(StatusCodes.FORBIDDEN).json({error: "Accès refusé"});
            }

        } catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Erreur interne"});
        }
    }
}
