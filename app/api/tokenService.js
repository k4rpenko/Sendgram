import jwt from "jsonwebtoken";

export default class TokenService {
    static async generateAccessToken(v) {
        return await jwt.sign({ data: v }, process.env.JWT_SECRET, { expiresIn: 1800 });
    };

    static async generateRefreshToken(v) {
        return await jwt.sign({ data: v }, process.env.JWT_SECRET, { expiresIn: 2592000 });
    };
}
