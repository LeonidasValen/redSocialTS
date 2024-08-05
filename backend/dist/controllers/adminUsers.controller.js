"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUsers = void 0;
const db_1 = __importDefault(require("../db/db"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
//trae todos los usuarios
const getUsers = async (req, res) => {
    const { searchUser = '' } = req.query;
    const userId = req.user?.userId;
    let { page = '1', limit = '10' } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;
    let db;
    try {
        // Conectar a la base de datos
        db = await (0, db_1.default)();
        // devulven todos los usuarios registrados
        const [users] = await db.query("SELECT id, photo, username, email, rol, f_creation FROM user WHERE id != ? AND username LIKE ?  LIMIT ? OFFSET ?", [userId, `%${searchUser}%`, parsedLimit, offset]);
        // Consulta para obtener el total de usuarios
        const [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM user WHERE id != ? AND username LIKE ?", [userId, `%${searchUser}%`]);
        res.status(200).json({ users, total });
    }
    catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios', });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.getUsers = getUsers;
//Update user
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, rol } = req.body;
    let db;
    try {
        let cover = null;
        if (req.file) {
            cover = req.file.filename;
        }
        // Conectar a la base de datos
        db = await (0, db_1.default)();
        const [userUpdate] = await db.query("SELECT id FROM user WHERE id = ?", [userId]);
        if (userUpdate.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        const oldPhoto = userUpdate[0].photo;
        // Verificar si se debe eliminar la foto antigua
        if (oldPhoto && (req.body.photo === "null" || req.body.photo === null || cover)) {
            const filePath = path_1.default.join(__dirname, `./../../../frontend/public/img/${oldPhoto}`);
            try {
                await promises_1.default.unlink(filePath);
            }
            catch (err) {
                console.error('Error al eliminar la foto antigua:', err);
                res.status(400).json({ message: 'Error al eliminar la foto' });
                return;
            }
        }
        // Actualizar el usuario en la base de datos
        if (req.body.photo === "null" || req.body.photo === null) {
            await db.query("UPDATE user SET photo = null, username = ?, rol = ? WHERE id = ?", [username, rol, userId]);
        }
        else if (cover) {
            await db.query("UPDATE user SET photo = ?, username = ?, rol = ? WHERE id = ?", [cover, username, rol, userId]);
        }
        else {
            await db.query("UPDATE user SET username = ?, rol = ? WHERE id = ?", [username, rol, userId]);
        }
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    }
    catch (error) {
        console.log('Error al actualizar la informacion:', error);
        res.status(500).json({ message: "Error al actualizar la informacion" });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    let db;
    try {
        db = await (0, db_1.default)();
        // Verificar si el usuario existe
        const [userDelete] = await db.query("SELECT id, photo FROM user WHERE id = ?", [userId]);
        if (userDelete.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
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
        console.log('Error al borrrar al usuario la informacion:', error);
        res.status(500).json({ message: "Error al borrrar al usuario la informacion" });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.deleteUser = deleteUser;
