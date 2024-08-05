import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateSchema = <T>(schema: ZodSchema<T>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next()
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors.map(error => error.message) })
        } else {
            return res.status(500).json({ error: 'error interno del servidor al validar' })
        }
    }
}