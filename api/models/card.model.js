import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Card extends Model { }

Card.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },

  color: {
    type: DataTypes.STRING(7),  // Hexadecimal code #FF00FF
    allowNull: false,
    defaultValue: "#FFFFFF" // Blanc
  },

  is_done: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: "card",
  indexes: [
    { fields: ['list_id'] },
    { fields: ['position'] }
  ]
});
