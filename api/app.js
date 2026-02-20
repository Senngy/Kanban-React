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

const PORT = process.env.PORT || 3000;

const app = express();
const corsOption = {
  origin: 'http://localhost:5173',
  credentials: true, // permet d'envoyer les cookies
}

app.use(cors(corsOption));
app.use(helmet());

// Middleware de log de requêtes
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, `HTTP Request: ${req.method} ${req.url}`);
  next();
});

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
