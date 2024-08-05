import express, {Express} from 'express'
import morgan from 'morgan'
import cors, { CorsOptions } from 'cors'
import cookieParser from 'cookie-parser'
//configura express
const app: Express = express()
//configura las cors
const corsOptions: CorsOptions={
    origin: ['http://localhost:5173', 'http://localhost:4173'],// URL de las paginas que pueda hacer operaciones 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Limita los métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Limita los encabezados permitidos
    credentials: true, // Habilita el uso de credenciales (cookies, encabezados de autorización, etc.)
}
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

export default app