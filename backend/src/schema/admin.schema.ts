import { z } from 'zod'

const roles = ['Admin', 'noVerify', 'Verify'] as const;//as const evita que sea modificados los valores
export const updateCrudSchema = z.object({
    username: z
        .string({ required_error: 'Nombre es requerido' })
        .min(1, { message: 'El nombre es obligatorio' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "El nombre de usuario no puede contener caracteres especiales." }),
    rol: z
        //.string({ required_error: 'El rol es requerido' }),
        .enum(roles, { required_error: 'El rol es requerido' })
});

export const searchSchema = z.object({
    searchUser: z
        .string({ required_error: 'Error al buscar' })
        .min(1, { message: 'El campo de búsqueda no puede estar vacío' })
})