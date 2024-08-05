import { Request, Response } from "express";
import { PORT } from "./config";
import app from "./app";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import postRouter from "./routes/post.routes";

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/admins', adminRouter)
app.use('/post', postRouter)

app.listen(PORT,():void =>{
    console.log(`el server esta corriendo en: http://localhost:${PORT}`)
})

app.get('/', (req: Request, res: Response): void =>{
    res.send("bienvenido al backend!")
})