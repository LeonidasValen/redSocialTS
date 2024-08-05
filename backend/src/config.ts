import  dotenv from 'dotenv'
//configura las variables globales
dotenv.config()

// Exportar las variables de entorno
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const DATABASE = process.env.DATABASE;
export const USER = process.env.USER;
export const PASS = process.env.PASS;
export const JWT_TOKEN = process.env.JWT_TOKEN;

export const CORREO_NM = process.env.CORREO_NM;
export const PASS_NM = process.env.PASS_NM
