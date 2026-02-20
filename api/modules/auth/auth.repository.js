import { User, Role, RefreshToken } from "../../models/index.js";

export const authRepository = {
    async findUserByUsername(username) {
        return await User.findOne({
            where: { username },
            include: { model: Role, as: "role", attributes: ["name"] }
        });
    },

    async findUserById(id) {
        return await User.findByPk(id, {
            include: { model: Role, as: "role", attributes: ["name"] }
        });
    },

    async findUserByEmail(email) {
        return await User.findOne({ where: { email } });
    },

    async createUser(userData) {
        return await User.create(userData);
    },

    async storeRefreshToken(data) {
        return await RefreshToken.create(data);
    },

    async findRefreshTokenByJti(jti) {
        return await RefreshToken.findOne({
            where: { jti },
            include: { model: User, as: "user" }
        });
    },

    async deleteRefreshTokenByJti(jti) {
        return await RefreshToken.destroy({ where: { jti } });
    },

    async deleteAllUserRefreshTokens(userId) {
        return await RefreshToken.destroy({ where: { user_id: userId } });
    }
};
