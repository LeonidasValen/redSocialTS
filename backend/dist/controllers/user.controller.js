"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const db_1 = __importDefault(require("../db/db"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
//trae los datos del usuario
const getUser = async (req, res) => {
    let db;
    try {
        //trae el id del usurio del validateToken
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'No estas autorizado' });
            return;
        }
        db = await (0, db_1.default)();
        // Verificar si se encontro al usuario
        const [userSql] = await db.query("SELECT id, photo, username, email, rol FROM user WHERE id = ?", [userId]);
        if (userSql.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        // Extraer los datos del usuario y enviar la respuesta
        const user = userSql[0];
        res.status(200).json({ user });
    }
    catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario', });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.getUser = getUser;
//Update
const updateUser = async (req, res) => {
    let db;
    try {
        const userId = req.user?.userId;
        const { username } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'No estas autorizado' });
            return;
        }
        let cover = null;
        if (req.file) {
            cover = req.file.filename;
        }
        //conectar la base de datos
        db = await (0, db_1.default)();
        const [userUpdate] = await db.query("SELECT id, photo FROM user WHERE id = ?", [userId]);
        if (userUpdate.length === 0)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        const oldPhoto = userUpdate[0].photo;
        // Verificar si se debe eliminar la foto antigua
        if (oldPhoto && (req.body.photo === "null" || req.body.photo === null || cover)) {
            const filePath = path_1.default.join(__dirname, `./../../../frontend/public/img/${oldPhoto}`);
            try {
                await promises_1.default.unlink(filePath);
            }
            catch (err) {
                console.error('Error al eliminar la foto antigua:', err);
            }
        }
        // Actualizar el usuario en la base de datos
        if (req.body.photo === "null" || req.body.photo === null) {
            await db.query("UPDATE user SET photo = null, username = ? WHERE id = ?", [username, userId]);
        }
        else if (cover) {
            await db.query("UPDATE user SET photo = ?, username = ? WHERE id = ?", [cover, username, userId]);
        }
        else {
            await db.query("UPDATE user SET username = ? WHERE id = ?", [username, userId]);
        }
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    }
    catch (error) {
        console.error('Error al actualizar la información:', error);
        res.status(500).json({ message: "Error al actualizar la información" });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    let db;
    try {
        const userId = req.user?.userId;
        // Conectar a la base de datos
        db = await (0, db_1.default)();
        // Verificar si el usuario existe
        const [userDelete] = await db.query("SELECT id, photo FROM user WHERE id = ?", [userId]);
        if (userDelete.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        // Eliminar usuario de la base de datos
        await db.query("DELETE FROM user WHERE id = ?", [userId]);
        //borra la foto
        const oldPhoto = userDelete[0].photo;
        if (oldPhoto) {
            const filePath = path_1.default.join(__dirname, `./../../../frontend/public/img/${oldPhoto}`);
            try {
                await promises_1.default.unlink(filePath);
            }
            catch (err) {
                console.error('Error al eliminar la foto antigua:', err);
            }
        }
        res.status(200).json({ message: 'Usuario borrado correctamente' });
    }
    catch (error) {
        console.error('Error al borrar la información:', error);
        res.status(500).json({ message: "Error al borrar la información" });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.deleteUser = deleteUser;
