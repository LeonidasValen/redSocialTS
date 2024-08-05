"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASS_NM = exports.CORREO_NM = exports.JWT_TOKEN = exports.PASS = exports.USER = exports.DATABASE = exports.HOST = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
//configura las variables globales
dotenv_1.default.config();
// Exportar las variables de entorno
exports.PORT = process.env.PORT;
exports.HOST = process.env.HOST;
exports.DATABASE = process.env.DATABASE;
exports.USER = process.env.USER;
exports.PASS = process.env.PASS;
exports.JWT_TOKEN = process.env.JWT_TOKEN;
exports.CORREO_NM = process.env.CORREO_NM;
exports.PASS_NM = process.env.PASS_NM;
