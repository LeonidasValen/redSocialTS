import mysql, {Pool, PoolConnection} from 'mysql2/promise'
import { DATABASE, HOST, PASS, USER } from '../config'

declare global {
    namespace Express {
        interface Request {
            db?: PoolConnection;
        }
    }
}

const pool: Pool = mysql.createPool({
    host: HOST,
    user: USER,
    password: PASS,
    database: DATABASE,
    waitForConnections: true,
    connectionLimit: 100,
    connectTimeout: 10000
})

async function connectToDB(): Promise<PoolConnection> {

    let connection: PoolConnection | null = null;
    try {
    connection= await pool.getConnection();
        console.log('conexion establecida exitosamente');
        return connection;
    } catch (error) {
        console.error('Error al conectarse al servidor',error);
        throw new Error('No se pudo establecer la conexión a la base de datos.');
    } finally {
        if (connection) {
            connection.release(); // Liberar la conexión al pool
        }
    }
}

export default connectToDB