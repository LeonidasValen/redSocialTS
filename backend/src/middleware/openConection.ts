import { NextFunction, Request, Response } from 'express';
import connectDB from '../db/db';

export const openConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Abre la conexión y la guarda en `req.db`
        req.db = await connectDB();

        // Escucha cuando la respuesta haya terminado
        res.on('finish', () => {
            if (req.db) {
                req.db.release();  // Libera la conexión cuando la respuesta se envía completamente
                console.log('Conexión liberada');
                req.db = undefined; // Asegúrate de que no se intente liberar de nuevo
            }
        });

        // Maneja el cierre inesperado de la conexión o errores en la respuesta
        res.on('close', () => {
            if (req.db) {
                req.db.release();  // Libera la conexión si la respuesta se cierra antes
                console.log('Conexión liberada en "close"');
                req.db = undefined;
            }
        });

        next();  // Continúa con el siguiente middleware o controlador
    } catch (error) {
        console.error('Error al obtener la conexión:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
}