import { Router } from "express";
import { validateToken } from "../middleware/validateToken";
import { uploadPost } from "../libs/multerImg";
import { dislike, getPosts, like, post } from "../controllers/posts.controller";

const router:Router = Router()

//Guarda post
router.post('/post', validateToken, uploadPost, post)
//Trae todos los posts
router.get('/posts', validateToken, getPosts)

//Da like al post
router.post('/like/:postId', validateToken, like)
//borra el like
router.delete('/dislike/:postId', validateToken, dislike)

export default router