import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import express from "express";
// import session from "express-session";
import cookies from "cookie-parser";
import { logger } from "./utils/logger.js";
import { authenticate } from "./modules/auth/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import listRoutes from "./modules/lists/list.routes.js";
import cardRoutes from "./modules/cards/card.routes.js";
import tagRoutes from "./modules/tags/tag.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import demoRoutes from "./routes/demo.routes.js";
import { setupSwagger } from "./utils/swagger.js";

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware de log ultra-précoce pour tout voir (y compris OPTIONS)
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    host: req.headers.host
  }, `Reçu : ${req.method} ${req.url}`);
  next();
});

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
      logger.error({ origin, allowedOrigins }, '❌ CORS Blocked');
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use(cors(corsOption));
app.use(helmet({ contentSecurityPolicy: false }));

/*
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // mettre true si en https
}))
  */

app.use(express.json());

app.use(cookies());

setupSwagger(app);

app.use("/auth", authRoutes);
app.use("/demo", demoRoutes);

app.use(authenticate);

app.use("/lists", listRoutes);
app.use("/cards", cardRoutes);
app.use("/tags", tagRoutes);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
