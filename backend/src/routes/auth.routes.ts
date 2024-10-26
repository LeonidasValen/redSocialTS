import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema";
import { loginSchema, regisSchema } from "../schema/auth.schema";
import { login, logout, register, verifyEmail } from "../controllers/auth.controller";
import { loginLimit } from "../middleware/rateLimit";
import { sendVerificationEmail } from "../libs/validateEmail";
import { openConnection } from "../middleware/openConection";

const router: Router = Router()

//Register
router.post('/register', validateSchema(regisSchema), register, sendVerificationEmail)
//Valida el email de usuario
router.post('/verifyEmail', verifyEmail)
//Login
router.post('/login', loginLimit, validateSchema(loginSchema), openConnection, login)
//Logout
router.post('/logout', logout)

export default router