import "dotenv/config";
import { Sequelize } from "sequelize";

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
await sequelize.authenticate();
