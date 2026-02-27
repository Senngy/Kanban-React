import "dotenv/config";
import { Sequelize } from "sequelize";
import { logger } from "../utils/logger.js";

export const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  logging: false
});

// Tester : TOP-LEVEL AWAIT autorisé en ESM !
// Pas besoin necessairement d'être dans une fonction 'async'
// Toutefois, si le code EST dans une fonction, il devra être async.
try {
  await sequelize.authenticate();
  const dbUri = new URL(process.env.PG_URL);
  logger.info({
    host: dbUri.hostname,
    port: dbUri.port,
    database: dbUri.pathname.split('/')[1]
  }, "[OK] Database connection has been established successfully.");
} catch (error) {
  logger.error(error, "[ERROR] Unable to connect to the database:");
  process.exit(1);
}
