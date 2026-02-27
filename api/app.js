import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import express from "express";
// import session from "express-session";
import cookies from "cookie-parser";
import { rateLimit } from 'express-rate-limit';
import { logger } from "./utils/logger.js";
import { authenticate } from "./modules/auth/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import listRoutes from "./modules/lists/list.routes.js";
import cardRoutes from "./modules/cards/card.routes.js";
import tagRoutes from "./modules/tags/tag.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import demoRoutes from "./routes/demo.routes.js";
import healthRoutes from "./routes/health.routes.js";
import { setupSwagger } from "./utils/swagger.js";

const PORT = process.env.PORT || 3000;

const app = express();

// Rate limiter global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500, // Limite chaque IP à 500 requêtes par fenêtre de 15 min
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  handler: (req, res, next, options) => {
    logger.warn({ ip: req.ip, url: req.url }, "Rate limit exceeded");
    res.status(options.statusCode).send(options.message);
  }
});

// Rate limiter plus strict pour l'auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20, // 20 tentatives max par 15 min
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later." }
});

app.use(express.json());

// 1. Routes publiques ultra-prioritaires (Healthcheck)
app.get("/", (req, res) => res.redirect("/api-docs"));
app.use("/health", healthRoutes);

// 2. Sécurité (CORS, Helmet, Cookies)
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:8080'];

const corsOption = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const sanitizedOrigin = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, "") === sanitizedOrigin);
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.error({ origin, allowedOrigins }, '[ERROR] CORS Blocked');
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use(cors(corsOption));
app.use(cookies());

// 3. Middlewares utilitaires (Logging)
app.use((req, res, next) => {
  const logData = {
    method: req.method,
    url: req.url,
    ip: req.ip
  };
  logger.info(logData, `[API] Received : ${req.method} ${req.url}`);
  next();
});

// 4. Documentation
setupSwagger(app);

// 5. Routes API
// On applique le authLimiter uniquement sur les routes d'auth
app.use("/auth", authLimiter, authRoutes);
app.use("/demo", demoRoutes);

// Middleware d'authentification global pour la suite
app.use(authenticate);

// On applique le limiteur global (500/15min) sélectivement sur les routes métier
app.use("/lists", limiter, listRoutes);
app.use("/cards", limiter, cardRoutes);
app.use("/tags", limiter, tagRoutes);

// 6. Gestion des erreurs
app.use(errorHandler);

app.listen(PORT, () => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  logger.info(`[RUNNING] Server running at ${baseUrl}`);
});
