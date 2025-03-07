"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || '';
    if (!token) {
        res.status(401).json({ error: 'Token not provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.headers.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};
exports.default = verifyToken;
//# sourceMappingURL=verify-token.js.map