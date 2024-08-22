import { z } from 'zod'

export const postSchema = z.object({
    descrip:
        z.undefined().or(
            z.string()
                .regex(/^[a-zA-Z0-9_]+$/, { message: "La descripción no puede contener caracteres especiales." }), // Solo permite letras, números y guiones bajos
        )
            .optional()
});
