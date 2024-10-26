import { Request, Response } from "express";
import { PORT } from "./config";
import app from "./app";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import postRouter from "./routes/post.routes";
import { limit } from "./middleware/rateLimit";

app.use('/auth', limit, authRouter)
app.use('/user', limit, userRouter)
app.use('/admins', limit, adminRouter)
app.use('/post', limit, postRouter)

app.listen(PORT,():void =>{
    console.log(`el server esta corriendo en: http://localhost:${PORT}`)
})

app.get('/', (req: Request, res: Response): void =>{
    res.send("bienvenido al backend!")
})