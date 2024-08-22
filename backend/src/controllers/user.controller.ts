import connectToDB from "../db/db";
import { Request, Response } from "express";
import { UserIdInterface, UserIsExisting } from "../interface/user";
import { RowDataPacket } from "mysql2";
import fs from 'fs/promises';
import path from "path";

type UserResult = Omit<UserIsExisting, 'f_creation' >

type GETExistingUser = Omit<UserIsExisting, 'f_creation'>

type SearchExistingUser = Pick<UserIsExisting, 'id' | 'username' |'photo'>

type UpdateUser = Omit<UserIsExisting, 'email' | 'f_creation' | 'rol'>;

type DeleteUser = Pick<UserIsExisting, 'id' | 'photo'>;

//trae los datos del usuario
export const getUser = async (req: UserIdInterface, res: Response): Promise<void> => {
    let db;
    try {
        //trae el id del usurio del validateToken
        const userId = req.user?.userId

        db = await connectToDB()
        // Verificar si se encontro al usuario
        const [userSql] = await db.query<(GETExistingUser & RowDataPacket)[]>("SELECT id, photo, username, email, rol FROM user WHERE id = ?", [userId]);
        if (userSql.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return
        }
        // Extraer los datos del usuario y enviar la respuesta
        const user = userSql[0];

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario', });
    } finally {
        if (db) { db.release(); }
    }
}

//traer usuario por buscador
export const searchUsers = async (req: UserIdInterface, res: Response): Promise<void> => {
    const { searchUser = '' } = req.query as { searchUser: string };

    let db;
    try {
        // Conectar a la base de datos
        db = await connectToDB();

        // devulven todos los usuarios registrados
        const [users] = await db.query<(SearchExistingUser & RowDataPacket)[]>("SELECT id, photo, username FROM user WHERE username LIKE ?  LIMIT ?", [ `%${searchUser}%`, 10]);
        //console.log(users)
        res.status(200).json({ users});
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios', });
    } finally {
        if (db) { db.release(); }
    }
}

// trae el perfil del usuario
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    //trae el id del usurio del validateToken
    const userId = req.params.id
    let db;
    try {

        db = await connectToDB()
        // Verificar si se encontro al usuario
        const [userSql] = await db.query<(UserResult & RowDataPacket)[]>("SELECT id, photo, username, email, rol FROM user WHERE id = ?", [userId]);
        if (userSql.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return
        }
        // Extraer los datos del usuario y enviar la respuesta
        const user = userSql[0];

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario', });
    } finally {
        if (db) { db.release(); }
    }
}

//Update
export const updateUser = async (req: UserIdInterface, res: Response) => {
    let db;
    try {
        const userId = req.user?.userId;
        const { username } = req.body;
        if (!userId) { res.status(401).json({ message: 'No estas autorizado' }); return; }

        let cover = null;
        if (req.file) {
            cover = req.file.filename
        }
        //conectar la base de datos
        db = await connectToDB()

        const [userUpdate] = await db.query<(UpdateUser & RowDataPacket)[]>("SELECT id, photo FROM user WHERE id = ?", [userId]);
        if (userUpdate.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        const oldPhoto = userUpdate[0].photo;
        // Verificar si se debe eliminar la foto antigua
        if (oldPhoto && (cover || req.body.photo === "null")) {
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
            await db.query("UPDATE user SET photo = null, username = ? WHERE id = ?", [username, userId]);
        } else if (cover) {
            await db.query("UPDATE user SET photo = ?, username = ? WHERE id = ?", [cover, username, userId]);
        } else {
            await db.query("UPDATE user SET username = ? WHERE id = ?", [username, userId]);
        }

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar la información:', error);
        res.status(500).json({ message: "Error al actualizar la información" });
    } finally {
        if (db) { db.release(); }
    }
}

export const deleteUser = async (req: UserIdInterface, res: Response): Promise<void> => {
    let db;
    try {
        const userId = req.user?.userId;

        // Conectar a la base de datos
        db = await connectToDB();

        // Verificar si el usuario existe
        const [userDelete] = await db.query<(DeleteUser & RowDataPacket)[]>("SELECT id, photo FROM user WHERE id = ?", [userId]);
        if (userDelete.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        // Eliminar usuario de la base de datos
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
        console.error('Error al borrar la información:', error);
        res.status(500).json({ message: "Error al borrar la información" });
    } finally {
        if (db) { db.release(); }
    }
}