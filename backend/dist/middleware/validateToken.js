"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePost = exports.verifyUser = exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const validateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ message: "No estás autenticado" });
    jsonwebtoken_1.default.verify(token, config_1.JWT_TOKEN, (err, user) => {
        if (err)
            return res.status(403).json({ message: "Token inválido" });
        req.user = user;
        next();
    });
};
exports.validateToken = validateToken;
const verifyUser = (req, res, next) => {
    (0, exports.validateToken)(req, res, () => {
        const userIdFromParams = parseInt(req.params.id);
        if (req.user?.userId === userIdFromParams) {
            next();
        }
        else {
            return res.status(403).json({ message: "No estás autorizado" });
        }
    });
};
exports.verifyUser = verifyUser;
const validatePost = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return next();
    }
    jsonwebtoken_1.default.verify(token, config_1.JWT_TOKEN, (err, user) => {
        if (err)
            return res.status(403).json({ message: "Token inválido" });
        req.user = user;
        next();
    });
};
exports.validatePost = validatePost;
