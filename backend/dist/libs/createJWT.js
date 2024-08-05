"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJWT = createJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function createJWT(payload) {
    return new Promise((resolve, reject) => {
        const options = {
            expiresIn: '7d'
        };
        jsonwebtoken_1.default.sign(payload, config_1.JWT_TOKEN, options, (err, token) => {
            if (err) {
                reject(err);
            }
            else if (token) {
                resolve(token);
            }
            else {
                reject(new Error('Token no generado'));
            }
        });
    });
}
