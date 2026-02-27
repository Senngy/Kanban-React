import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class BoardMembers extends Model { }

BoardMembers.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "board",
            key: "id"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "id"
        }
    },
    role: {
        type: DataTypes.ENUM('owner', 'editor', 'viewer'),
        allowNull: false
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    joined_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'board_members'
});