import {z} from 'zod'

export const regisSchema = z.object({
    username: z
        .string({required_error: "Nombre es requerido"})
        .min(2, {message: 'El nombre debe tener 2 caracteres'})
        .regex(/^[a-zA-Z0-9_]+$/, { message: "El nombre de usuario no puede contener caracteres especiales." }), // Solo permite letras, números y guiones bajos
    email: z
        .string({required_error: 'Email es requerido'})
        .email({message: 'Email inválido'}),
    password: z
        .string({required_error: 'La contraseña es requerida'})
        .min(6, {message: 'La contraseña de contener al menos 6 caracteres'})
});

export const loginSchema = z.object({
    email: z
        .string({required_error: 'Email es requerido'})
        .email({message: 'Email inválido'}),
    password: z
        .string({required_error: 'La contraseña es requerida'})
        .min(6, {message: 'La contraseña de contener al menos 6 caracteres'})
});

export const updateSchema = z.object({
    username: z
        .string({ required_error: 'Nombre es requerido' })
        .min(1, { message: 'El nombre es obligatorio' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "El nombre de usuario no puede contener caracteres especiales." }),
});

export const searchSchema = z.object({
    searchUser: z
        .string({ required_error: 'Error al buscar' })
        .min(1, { message: 'El campo de búsqueda no puede estar vacío' })
})