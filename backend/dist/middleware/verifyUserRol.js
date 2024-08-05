"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserRol = void 0;
const db_1 = __importDefault(require("../db/db"));
const verifyUserRol = async (req, res, next) => {
    let db;
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'No estas autorizado' });
            return;
        }
        db = await (0, db_1.default)();
        //consulta el id del usuario
        const [isAdmin] = await db.query("SELECT id, rol FROM user WHERE id = ?", [userId]);
        //verifica si exite el usario
        if (isAdmin.length === 0) {
            res.status(400).json({ message: 'Usuario no encontrado' });
            return;
        }
        //obtine los datos del usuario
        const userRol = isAdmin[0];
        //verifica que sea admin
        if (userRol.rol !== 'Admin') {
            res.status(401).json({ message: 'No estas autorizado' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Error al verificar permisos:', error);
        res.status(500).json({ message: 'Error al verificar permisos' });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.verifyUserRol = verifyUserRol;
