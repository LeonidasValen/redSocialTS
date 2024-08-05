"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.loginSchema = exports.regisSchema = void 0;
const zod_1 = require("zod");
exports.regisSchema = zod_1.z.object({
    username: zod_1.z
        .string({ required_error: "Nombre es requerido" })
        .min(2, { message: 'El nombre debe tener 2 caracteres' }),
    email: zod_1.z
        .string({ required_error: 'Email es requerido' })
        .email({ message: 'Email inválido' }),
    password: zod_1.z
        .string({ required_error: 'La contraseña es requerida' })
        .min(6, { message: 'La contraseña de contener al menos 6 caracteres' })
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email es requerido' })
        .email({ message: 'Email inválido' }),
    password: zod_1.z
        .string({ required_error: 'La contraseña es requerida' })
        .min(6, { message: 'La contraseña de contener al menos 6 caracteres' })
});
exports.updateSchema = zod_1.z.object({
    username: zod_1.z
        .string({ required_error: 'Nombre es requerido' })
        .min(1, { message: 'El nombre es obligatorio' }),
});
