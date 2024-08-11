import { NextFunction, Response } from "express";
import connectToDB from "../db/db";
import { RowDataPacket } from "mysql2/promise";
import { UserIdInterface } from "../interface/user";

interface UserRole extends RowDataPacket {
    id: number;
    rol: string;
}

export const verifyUserRol = async (req: UserIdInterface, res: Response, next: NextFunction): Promise<void> => {
    let db;
    try {
        const userId = req.user?.userId;

        if (!userId){res.status(401).json({ message: 'No estas autorizado' }); return;}

        db = await connectToDB()
        //consulta el id del usuario
        const [isAdmin] = await db.query<UserRole[]>("SELECT id, rol FROM user WHERE id = ?", [userId])
        //verifica si exite el usario
        if (isAdmin.length === 0) {res.status(400).json({ message: 'Usuario no encontrado' }); return;}
        //obtine los datos del usuario
        const userRol = isAdmin[0];
        //verifica que sea admin
        if (userRol.rol !== 'Admin'){ res.status(401).json({ message: 'No estas autorizado' }); return;}

        next()
    } catch (error) {
        console.error('Error al verificar permisos:', error);
        res.status(500).json({ message: 'Error al verificar permisos' });
    } finally {
        if (db){ db.release();}
    }
}