const jwt = require("jsonwebtoken");

class TokenService {
    static async generateAccessToken(v) {
        return await jwt.sign({ data: v }, process.env.JWT_SECRET, { expiresIn: '7d' });
    };

    static async generateRefreshToken(v) {
        return await jwt.sign({ data: v }, process.env.JWT_SECRET, { expiresIn: '28d' });
    };

}

module.exports = TokenService;