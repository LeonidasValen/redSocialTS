import { Response } from "express";
import connectToDB from "../db/db";
import { UserIdInterface, UserIsExisting } from "../interface/user";
import { RowDataPacket } from "mysql2/promise";
import path from "path";
import fs from 'fs/promises';

interface UserCount extends RowDataPacket {
    total: number;
}

type UpdateUser = Omit<UserIsExisting, 'email' | 'f_creation'>;

type DeleteUser = Pick<UserIsExisting, 'id' | 'photo'>;


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
        const [users] = await db.query<UserIsExisting[]>("SELECT id, photo, username, email, rol, f_creation FROM user WHERE id != ? AND username LIKE ?  LIMIT ? OFFSET ?", [userId, `%${searchUser}%`, parsedLimit, offset]);
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
    const userId = req.params.id;
    const { username, rol } = req.body;
    let db;

    try {
        let cover = req.file ? req.file.filename : null;

        console.log(cover);

        // Conectar a la base de datos
        db = await connectToDB();

        //busca si existe el usuario
        const [userUpdate] = await db.query<(UpdateUser & RowDataPacket)[]>("SELECT id, photo FROM user WHERE id = ?", [userId]);
        if (userUpdate.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        const oldPhoto = userUpdate[0].photo;//trae la foto si tiene

        // Verifica si se debe eliminar la foto antigua
        if (oldPhoto && (cover || req.body.photo === "null")) {
            const filePath = path.join(__dirname, `./../../../frontend/public/img/${oldPhoto}`);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error('Error al eliminar la foto antigua:', err);
                res.status(400).json({ message: 'Error al eliminar la foto' });
                return;
            }
        }

        // Actualizar el usuario en la base de datos
        const updateFields: (string | null)[] = [username, rol];
        let query = "UPDATE user SET username = ?, rol = ?";

        if (req.body.photo === "null") {
            query += ", photo = null";
        } else if (cover) {
            query += ", photo = ?";
            updateFields.push(cover);
        }

        query += " WHERE id = ?";
        updateFields.push(userId);

        await db.query(query, updateFields);

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.log('Error al actualizar la información:', error);
        res.status(500).json({ message: "Error al actualizar la información" });
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
        const [userDelete] = await db.query<(DeleteUser & RowDataPacket)[]>("SELECT id, photo FROM user WHERE id = ?", [userId]);
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