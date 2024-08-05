"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limit = exports.loginLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 12, // número máximo de intentos de inicio de sesión permitidos dentro del período de tiempo
    message: 'Demasiados intentos de inicio de sesión. Por favor, inténtalo de nuevo más tarde.'
});
exports.limit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // número máximo de intentos de inicio de sesión permitidos dentro del período de tiempo
    message: 'Demasiadas peticiones. Vuelva más tarde.'
});
