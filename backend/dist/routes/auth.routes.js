"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateSchema_1 = require("../middleware/validateSchema");
const auth_schema_1 = require("../schema/auth.schema");
const auth_controller_1 = require("../controllers/auth.controller");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
//Register
router.post('/register', (0, validateSchema_1.validateSchema)(auth_schema_1.regisSchema), auth_controller_1.register);
//Valida el email de usuario
router.post('/verifyEmail', auth_controller_1.verifyEmail);
//Login
router.post('/login', rateLimit_1.loginLimit, (0, validateSchema_1.validateSchema)(auth_schema_1.loginSchema), auth_controller_1.login);
//Logout
router.post('/logout', auth_controller_1.logout);
exports.default = router;
