"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.logout = exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../db/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createJWT_1 = require("../libs/createJWT");
//Register
const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    let db;
    try {
        db = await (0, db_1.default)();
        //verifica si el usuario esta registrado
        const [existingUser] = await db.query("SELECT email, username FROM user WHERE email = ? OR username = ?", [email, username]);
        if (existingUser.length > 0) {
            const user = existingUser[0];
            if (user.email === email && user.username === username) {
                res.status(409).json({ message: "El Correo y el Nombre del usuario ya están registrados" });
                return;
            }
            else if (user.email === email) {
                res.status(409).json({ message: "El Correo ya están registrados" });
                return;
            }
            else if (user.email === email) {
                res.status(409).json({ message: "El Correo ya están registrados" });
                return;
            }
        }
        //encripta la contaseña
        const hash = await bcrypt_1.default.hash(password, 12);
        //insercion de los datos
        await db.query("INSERT INTO user (username, email, password) VALUES (?, ?, ?)", [email, username, hash]);
        //crea un token
        const verificationToken = Math.random().toString(36).substring(2, 15);
        //guarda el token de la persoan que se registro
        await db.query("UPDATE user SET verify_token = ? WHERE email = ?", [verificationToken, email]);
        //envia para verificar el token al validateEmail.js
        req.body.verificationToken = verificationToken;
        req.body.email = email;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor al registrarse" });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.register = register;
//Login
const login = async (req, res) => {
    const { email, password } = req.body;
    let db;
    try {
        db = await (0, db_1.default)();
        //verifica que el correo este registrado
        const [sql] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (sql.length === 0) {
            res.status(404).json({ message: 'Correo o contraseña icorrecto' });
            return;
        }
        //verifica si las contraseñas coinciden
        const user = sql[0]; //guarda los datos del usuario obtenidos
        const passCompare = await bcrypt_1.default.compare(password, user.password);
        if (!passCompare) {
            res.status(404).json({ message: 'Correo o contraseña icorrecto' });
            return;
        }
        //crea la cookie
        const token = await (0, createJWT_1.createJWT)({ userId: user.id });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' }); //envia la cookie con los metodos de seguridad
        res.status(201).json({
            id: user.id,
            photo: user.photo,
            username: user.username,
            email: user.email,
            rol: user.rol,
            message: 'Sesión iniciada correctamente'
        });
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.login = login;
//Logout
const logout = async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    }
    catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ message: 'Error al cerrar sesión', error });
    }
};
exports.logout = logout;
//Verifica el email del usuario
const verifyEmail = async (req, res) => {
    const { token, email } = req.body;
    let db;
    try {
        db = await (0, db_1.default)();
        //verifica que mail y el token existan
        const [user] = await db.query("SELECT verify_token, email FROM user WHERE verify_token = ? AND email = ?", [token, email]);
        if (user.length === 0) {
            res.status(400).json({ message: "Token inválido" });
            return;
        }
        //actualiza el token y valida el usuario
        await db.query("UPDATE user SET rol = 'Verify', verify_token = NULL WHERE verify_token = ? AND email = ?", [token, email]);
        res.status(200).json({ message: 'Email verificado correctamente' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor a la hora de verificar el correo electrónico" });
    }
    finally {
        if (db) {
            db.release();
        }
    }
};
exports.verifyEmail = verifyEmail;
