import { Response } from "express";
import connectToDB from "../db/db";
import { UserIdInterface } from "../interface/user";
import { RowDataPacket } from "mysql2/promise";
import path from "path";
import fs from 'fs/promises';

interface User extends RowDataPacket {
    id: number;
    photo: string | null;
    username: string;
    email: string;
    rol: string;
    f_creation: Date;
}

interface UserCount extends RowDataPacket {
    total: number;
}

//trae todos los usuarios
export const getUsers = async (req: UserIdInterface, res: Response): Promise<void> => {
    const { searchUser = '' } = req.query as { searchUser: string };
    const userId = req.user?.userId;

    let { page = '1', limit = '10' } = req.query as { page: string; limit: string };
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    let db;
    try {
        // Conectar a la base de datos
        db = await connectToDB();

        // devulven todos los usuarios registrados
        const [users] = await db.query<User[]>("SELECT id, photo, username, email, rol, f_creation FROM user WHERE id != ? AND username LIKE ?  LIMIT ? OFFSET ?", [userId, `%${searchUser}%`, parsedLimit, offset]);
        // Consulta para obtener el total de usuarios
        const [[{ total }]] = await db.query<UserCount[]>(
            "SELECT COUNT(*) AS total FROM user WHERE id != ? AND username LIKE ?",
            [userId, `%${searchUser}%`]
        );

        res.status(200).json({ users, total });

    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios', });
    } finally {
        if (db) { db.release(); }
    }
}

//Update user
export const updateUser = async (req: UserIdInterface, res: Response): Promise<void> => {
    const userId = req.params.id
    const { username, rol } = req.body;
    let db
    try {

        let cover = null;
        if (req.file) {
            cover = req.file.filename;
        }
        // Conectar a la base de datos
        db = await connectToDB();

        const [userUpdate] = await db.query<User[]>("SELECT id FROM user WHERE id = ?", [userId]);
        if (userUpdate.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return
        }

        const oldPhoto = userUpdate[0].photo;
        // Verificar si se debe eliminar la foto antigua
        if (oldPhoto && (req.body.photo === "null" || req.body.photo === null || cover)) {
            const filePath = path.join(__dirname, `./../../../frontend/public/img/${oldPhoto}`);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('Error al eliminar la foto antigua:', err);
                res.status(400).json({ message: 'Error al eliminar la foto' });
                return
            }
        }
        // Actualizar el usuario en la base de datos
        if (req.body.photo === "null" || req.body.photo === null) {
            await db.query("UPDATE user SET photo = null, username = ?, rol = ? WHERE id = ?", [username, rol, userId]);
        } else if (cover) {
            await db.query("UPDATE user SET photo = ?, username = ?, rol = ? WHERE id = ?", [cover, username, rol, userId]);
        } else {
            await db.query("UPDATE user SET username = ?, rol = ? WHERE id = ?", [username, rol, userId]);
        }

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.log('Error al actualizar la informacion:', error)
        res.status(500).json({ message: "Error al actualizar la informacion" })
    } finally {
        if (db) { db.release(); }
    }
}

export const deleteUser = async (req: UserIdInterface, res: Response): Promise<void> => {
    const userId = req.params.id
    let db
    try {

        db = await connectToDB();

        // Verificar si el usuario existe
        const [userDelete] = await db.query<User[]>("SELECT id, photo FROM user WHERE id = ?", [userId]);
        if (userDelete.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return
        }

        await db.query("DELETE FROM user WHERE id = ?", [userId]);

        //borra la foto
        const oldPhoto = userDelete[0].photo;
        if (oldPhoto) {
            const filePath = path.join(__dirname, `./../../../frontend/public/img/${oldPhoto}`);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('Error al eliminar la foto antigua:', err);
            }
        }

        res.status(200).json({ message: 'Usuario borrado correctamente' });
    } catch (error) {
        console.log('Error al borrrar al usuario la informacion:', error)
        res.status(500).json({ message: "Error al borrrar al usuario la informacion" })
    } finally {
        if (db) { db.release(); }
    }
}