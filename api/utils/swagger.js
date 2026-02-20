import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kanban API',
            version: '1.0.0',
            description: 'API de gestion de projet Kanban modulaire et sécurisée.',
            contact: {
                name: 'Kanban Pro Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement Local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Liste explicite des fichiers pour éviter les bugs de globbing sur Windows
    apis: [
        './modules/auth/auth.routes.js',
        './modules/lists/list.routes.js',
        './modules/cards/card.routes.js',
        './modules/tags/tag.routes.js',
        './app.js'
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customSiteTitle: "Kanban API Docs",
    }));

    console.log('📚 Swagger documentation available at http://localhost:3000/api-docs');
};
