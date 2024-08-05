import { Router } from "express";
import { validateToken } from "../middleware/validateToken";
import { verifyUserRol } from "../middleware/verifyUserRol";
import { upload } from "../libs/multerImg";
import { validateSchema } from "../middleware/validateSchema";
import { updateCrudSchema } from "../schema/admin.schema";
import { deleteUser, getUsers, updateUser } from "../controllers/adminUsers.controller";

const router: Router = Router()

//Trae todos los usarios
router.get('/allUsers', validateToken, verifyUserRol, getUsers)
//Actualiza el perfil del usario
router.put('/updateUser/:id', validateToken, verifyUserRol, upload, validateSchema(updateCrudSchema), updateUser)
//Borra el perfil del usario
router.delete('/deleteUser/:id', validateToken, verifyUserRol, deleteUser)

export default router