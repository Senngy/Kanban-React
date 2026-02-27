import express from "express";
import { sequelize } from "../models/sequelize.client.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API and its dependencies.
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get("/", async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        services: {
            database: 'unknown'
        },
        system: {
            memory: process.memoryUsage(),
            platform: process.platform
        }
    };

    try {
        await sequelize.authenticate();
        healthcheck.services.database = 'healthy';
        res.status(200).json(healthcheck);
    } catch (error) {
        healthcheck.message = 'Degraded';
        healthcheck.services.database = 'unhealthy';
        logger.error(error, "Healthcheck failed for database");
        res.status(503).json(healthcheck);
    }
});

export default router;
