import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { scrypt } from '../utils/scrypt.js'
import { StatusCodes } from 'http-status-codes';
import { Role } from '../models/role.model.js';

export async function register(req, res) {
    // récupération du username et du mdp 
    // et du nom du role
    const { username, password, role, email, first_name, last_name } = req.body;
    try {
        const hashedPassword = scrypt.hash(password);
        // par défaut on associe le role User
        // si pas de role fournit on applique le role user
        if (!role)
        {
            role = "user";
        }

        const userRole = await Role.findOne({where: {name:role}});
        // si le role n'existe pas en BDD => erreur
        if (!userRole)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({"error" : `role [${role}] inconnu`});
        }
        const role_id = userRole.id

        //création du user en BDD
        // on ajoute le nom du role
        //création du user en BDD
        // on ajoute le nom du role
        const user = await User.create({
            username, 
            password: hashedPassword,
            role_id,
            email,
            first_name,
            last_name
        });

        // Generate token (Auto-login)
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 15 });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        // on renvoit les infos au client (token + user)
        return res.status(StatusCodes.CREATED).json({ token, user });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {

            let errorMsg = 'Duplicate entry';
            if (error.errors.length > 0) {
                errorMsg = error.errors[0].message;
            }
            return res.status(StatusCodes.CONFLICT).json({ 
                error: errorMsg
            });
        }
        console.log(error);
        throw new Error("Internal Server Error !");
    }
}

export async function login(req, res) {
    // récupération du username et du mdp 
    const usernameFromRequest = req.body.username;
    const passwordFromRequest = req.body.password;
    // const { usernameFromRequest: username, passwordFromRequest: password } = req.body;

    try {
        // si plus de 3 essais en 5 minutes => authent KO

        // récupérer l'utilisateur avec le bon username
        // let toto = 'une valeur'
        // { toto: toto } => { toto }
        const user = await User.findOne({ where : {username: usernameFromRequest}});

        // SELECT * FROM "user" WHERE username = 'admin' LIMIT 1;
        // Si trouvé
        // cf falsy : https://developer.mozilla.org/en-US/docs/Glossary/Falsy
        if (user)
        {
            //    Si mdp correspond au hash 
            if (scrypt.compare(passwordFromRequest, user.password)) {
                //    => authent ok
                // créer un token jwt
                const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 15 });
                // renvoyer le token à l'utilisateur

                // creation du cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // true en prod avec https
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 1000 // 1 heure
                });

                return res.status(StatusCodes.OK).json({token: token});

            } else {
                //    Sinon => authent KO
                return res.status(StatusCodes.BAD_REQUEST).json({error: "couple login / mdp incorrect"});
            }
        } else 
        {
            // Sinon => authent KO
            return res.status(StatusCodes.BAD_REQUEST).json({error: "couple login / mdp incorrect"});
        }

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "merci de réessayer ultérieurement"});
    }
}

export async function me (req, res) {
    // ici on dispose de : 
    // req.userId qui a été créé dans auth.middleware
    try {
        const user = await User.findByPk(req.userId, { 
            attributes : ["id", "username"],
            include: { model: Role, as: "role", attributes: ['name']}
         })
        // obtenir les infos du user connecté
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({error: "Utilisateur non trouvé"})
        }
        
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Erreur interne"})
    }
}


