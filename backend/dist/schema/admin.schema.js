"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSchema = exports.updateCrudSchema = void 0;
const zod_1 = require("zod");
const roles = ['Admin', 'noVerify', 'Verify']; //as const evita que sea modificados los valores
exports.updateCrudSchema = zod_1.z.object({
    username: zod_1.z
        .string({ required_error: 'Nombre es requerido' })
        .min(1, { message: 'El nombre es obligatorio' }),
    rol: zod_1.z
        //.string({ required_error: 'El rol es requerido' }),
        .enum(roles, { required_error: 'El rol es requerido' })
});
exports.searchSchema = zod_1.z.object({
    searchUser: zod_1.z
        .string({ required_error: 'Error al buscar' })
        .min(1, { message: 'El campo de búsqueda no puede estar vacío' })
});
