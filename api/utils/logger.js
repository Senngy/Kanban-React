import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const transport = isDev
    ? pino.transport({
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        }
    })
    : undefined;

export const logger = pino({
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
    base: isDev ? { env: 'development' } : undefined,
}, transport);
