"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("../config");
const pool = promise_1.default.createPool({
    host: config_1.HOST,
    user: config_1.USER,
    password: config_1.PASS,
    database: config_1.DATABASE,
    waitForConnections: true,
    connectionLimit: 1000
});
async function connectToDB() {
    try {
        const connection = await pool.getConnection();
        console.log('conexion establecida exitosamente');
        return connection;
    }
    catch (error) {
        console.error('Error al conectarse al servidor', error);
        throw error;
    }
}
exports.default = connectToDB;
