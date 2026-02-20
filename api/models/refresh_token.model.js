import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class RefreshToken extends Model { }

RefreshToken.init({
    jti: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    token: { // Ce sera le hash du JWT
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: "refresh_token"
});
