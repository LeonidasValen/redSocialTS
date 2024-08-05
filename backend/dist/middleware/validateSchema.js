"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const zod_1 = require("zod");
const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: error.errors.map(error => error.message) });
        }
        else {
            return res.status(500).json({ error: 'error interno del servidor al validar' });
        }
    }
};
exports.validateSchema = validateSchema;
