import { Router } from "express";
import { validateToken, verifyUser } from "../middleware/validateToken";
import { deleteUser, getUser, updateUser } from "../controllers/user.controller";
import { upload } from "../libs/multerImg";
import { validateSchema } from "../middleware/validateSchema";
import { updateSchema } from "../schema/auth.schema";

const router: Router = Router()

//trae el perfil del usuario
router.get('/profile', validateToken, getUser)
//actualiza el perfil del usuario
router.put('/update/:id', verifyUser, upload, validateSchema(updateSchema), updateUser)
//borra el perfil del usario
router.delete('/delete/:id', verifyUser, deleteUser)

export default router