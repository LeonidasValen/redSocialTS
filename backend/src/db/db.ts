import mysql, {Pool, PoolConnection} from 'mysql2/promise'
import { DATABASE, HOST, PASS, USER } from '../config'

const pool: Pool = mysql.createPool({
    host: HOST,
    user: USER,
    password: PASS,
    database: DATABASE,
    waitForConnections: true,
    connectionLimit: 1000
})

async function connectToDB(): Promise<PoolConnection> {
    try {
        const connection: PoolConnection = await pool.getConnection();
        console.log('conexion establecida exitosamente');
        return connection;
    } catch (error) {
        console.error('Error al conectarse al servidor',error);
        throw error;
    }
}

export default connectToDB