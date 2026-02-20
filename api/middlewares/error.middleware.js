import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger.js';

/**
 * Middleware global pour capturer et formater toutes les erreurs de l'application.
 */
export function errorHandler(err, _req, res, next) {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";

    // Log structuré de l'erreur
    if (statusCode >= 500) {
        logger.error({ err }, `[Unhandled Error] ${message}`);
    } else {
        logger.warn({ statusCode, message, url: _req.originalUrl }, `[Operational Error] ${message}`);
    }

    const errorResponse = {
        error: message,
        status: statusCode
    };

    if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
}
