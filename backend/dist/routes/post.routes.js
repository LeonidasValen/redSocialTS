"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateToken_1 = require("../middleware/validateToken");
const multerImg_1 = require("../libs/multerImg");
const posts_controller_1 = require("../controllers/posts.controller");
const router = (0, express_1.Router)();
//Guarda post
router.post('/post', validateToken_1.validateToken, multerImg_1.uploadPost, posts_controller_1.post);
//Trae todos los posts
router.get('/posts', validateToken_1.validateToken, posts_controller_1.getPosts);
//Da like al post
router.post('/like/:postId', validateToken_1.validateToken, posts_controller_1.like);
//borra el like
router.delete('/dislike/:postId', validateToken_1.validateToken, posts_controller_1.dislike);
exports.default = router;
