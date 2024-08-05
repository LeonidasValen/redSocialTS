"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateToken_1 = require("../middleware/validateToken");
const verifyUserRol_1 = require("../middleware/verifyUserRol");
const multerImg_1 = require("../libs/multerImg");
const validateSchema_1 = require("../middleware/validateSchema");
const admin_schema_1 = require("../schema/admin.schema");
const adminUsers_controller_1 = require("../controllers/adminUsers.controller");
const router = (0, express_1.Router)();
//Trae todos los usarios
router.get('/allUsers', validateToken_1.validateToken, verifyUserRol_1.verifyUserRol, adminUsers_controller_1.getUsers);
//Actualiza el perfil del usario
router.put('/updateUser/:id', validateToken_1.validateToken, verifyUserRol_1.verifyUserRol, multerImg_1.upload, (0, validateSchema_1.validateSchema)(admin_schema_1.updateCrudSchema), adminUsers_controller_1.updateUser);
//Borra el perfil del usario
router.delete('/deleteUser/:id', validateToken_1.validateToken, verifyUserRol_1.verifyUserRol, adminUsers_controller_1.deleteUser);
exports.default = router;
