import { Router } from "express";
import { validatePost, validateToken } from "../middleware/validateToken";
import { uploadPost } from "../libs/multerImg";
import { dislike, getPosts, getPostsUsers, like, post } from "../controllers/posts.controller";
import { validateSchema } from "../middleware/validateSchema";
import { postSchema } from "../schema/post.chema";
import { openConnection } from "../middleware/openConection";

const router:Router = Router()

//Guarda post
router.post('/post', validateToken, validateSchema(postSchema), uploadPost, openConnection, post)
//Trae todos los posts
router.get('/posts', validatePost, openConnection, getPosts)
//trae el post de un usuario
router.get('/postsUser/:id', validatePost, openConnection, getPostsUsers)

//Da like al post
router.post('/like/:postId', validateToken, like)
//borra el like
router.delete('/dislike/:postId', validateToken, dislike)

export default router