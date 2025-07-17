import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class List extends Model {}

List.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  sequelize, // instance de connexion
  tableName: "list"
});
