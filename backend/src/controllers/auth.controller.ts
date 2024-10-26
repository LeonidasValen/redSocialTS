import connectToDB from "../db/db";
import bcrypt from 'bcrypt'
import { createJWT } from "../libs/createJWT";
import { NextFunction, Request, Response } from "express";
import { RowDataPacket } from "mysql2/promise";
import { UserResultInterface } from "../interface/user";

interface ExistingUser extends RowDataPacket {
    email: string;
    username: string;
}
interface TokenResult extends RowDataPacket {
    email: string;
    token: string;
}

//Register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password } = req.body
    try {
        const db = await connectToDB()

        //verifica si el usuario esta registrado
        const [existingUser] = await db.query<ExistingUser[]>(
            "SELECT email, username FROM user WHERE email = ? OR username = ?", [email, username]
        )
        if (existingUser.length > 0) {
            const { email: existingEmail, username: existingUsername } = existingUser[0];
            const message = existingEmail === email && existingUsername === username
                ? "El Correo y el Nombre del usuario ya están registrados"
                : existingEmail === email
                    ? "El Correo ya está registrado"
                    : "El Nombre de usuario ya está registrado";
            res.status(409).json({ message });
            return;
        }

        //encripta la contaseña
        const hash = await bcrypt.hash(password, 12)

        //insercion de los datos
        await db.query("INSERT INTO user (username, email, password) VALUES (?, ?, ?)", [username, email, hash]);

        // Crea un token de verificación
        const verificationToken = Math.random().toString(36).substring(2, 15);
        await db.query("UPDATE user SET verify_token = ? WHERE email = ?", [verificationToken, email]);

        // Envía el token para la verificación
        req.body.verificationToken = verificationToken;
        req.body.email = email;
        next();

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error en el servidor al registrarse" })
    }
}

//Login
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        //verifica que el correo este registrado
        const [sql] = await req.db!.query<UserResultInterface[]>("SELECT * FROM user WHERE email = ?", [email])
        //verifica si las contraseñas coinciden
        const user = sql[0];//guarda los datos del usuario obtenidos
        if (!sql.length || !(await bcrypt.compare(password, user.password))) {
            res.status(404).json({ message: 'Correo o contraseña incorrecto' });
            return;
        }
        //crea la cookie
        const token = await createJWT({ userId: user.id })
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 })//envia la cookie con los metodos de seguridad

        res.status(201).json({
            id: user.id,
            photo: user.photo,
            username: user.username,
            email: user.email,
            rol: user.rol,
            message: 'Sesión iniciada correctamente'
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
    }
}

//Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ message: 'Error al cerrar sesión', error });
    }
}

//Verifica el email del usuario
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    let db;
    try {
        db = await connectToDB();
        //verifica que mail y el token existan
        const [user] = await db.query<TokenResult[]>("SELECT verify_token, email FROM user WHERE verify_token = ? ", [token]);
        if (user.length === 0) {
            res.status(400).json({ message: "Token inválido" });
            return
        }
        //actualiza el token y valida el usuario
        await db.query("UPDATE user SET rol = 'Verify', verify_token = NULL WHERE verify_token = ?", [token]);

        res.status(200).json({ message: 'Email verificado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor a la hora de verificar el correo electrónico" });
    } finally {
        if (db) { db.release(); }
    }
}