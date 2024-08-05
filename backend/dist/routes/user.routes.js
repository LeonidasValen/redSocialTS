"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateToken_1 = require("../middleware/validateToken");
const user_controller_1 = require("../controllers/user.controller");
const multerImg_1 = require("../libs/multerImg");
const validateSchema_1 = require("../middleware/validateSchema");
const auth_schema_1 = require("../schema/auth.schema");
const router = (0, express_1.Router)();
//trae el perfil del usuario
router.get('/profile', validateToken_1.validateToken, user_controller_1.getUser);
//actualiza el perfil del usuario
router.put('/update/:id', validateToken_1.verifyUser, multerImg_1.upload, (0, validateSchema_1.validateSchema)(auth_schema_1.updateSchema), user_controller_1.updateUser);
//borra el perfil del usario
router.delete('/delete/:id', validateToken_1.verifyUser, user_controller_1.deleteUser);
exports.default = router;
