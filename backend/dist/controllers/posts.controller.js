"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dislike = exports.like = exports.getPosts = exports.post = void 0;
const db_1 = __importDefault(require("../db/db"));
const post = async (req, res) => {
    const userId = req.user?.userId;
    const descrip = req.body.descrip;
    let cover = [];
    let db;
    try {
        if (req.files && Array.isArray(req.files)) {
            cover = req.files.map(file => file.filename);
        }
        db = await (0, db_1.default)();
        // Verificar si el usuario existe
        const [userUpdate] = await db.query("SELECT id FROM user WHERE id = ?", [userId]);
        if (userUpdate.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        // Insertar el post
        const [postInsertResult] = await db.query("INSERT INTO posts (`desc`, userId) VALUES (?, ?)", [descrip, userId]);
        const postId = postInsertResult.insertId;
        // Insertar las imágenes asociadas al post
        if (cover.length > 0) {
            const imgPostsValues = cover.map(filename => [filename, postId]);
            await db.query("INSERT INTO imgposts (img, postId) VALUES ?", [imgPostsValues]);
        }
        res.status(200).json({ message: 'Post guardado' });
    }
    catch (error) {
        console.error('Error al guardar el post:', error);
        res.status(500).json({ message: 'Error en el servidor al guardar el post' });
    }
    finally {
        if (db)
            db.release();
    }
};
exports.post = post;
const getPosts = async (req, res) => {
    const userId = req.user?.userId || null; // Si el usuario está autenticado, obtiene su ID
    let db;
    try {
        db = await (0, db_1.default)();
        const [results] = await db.query(`
            SELECT 
                posts.id AS postId, 
                posts.desc, 
                posts.userId,
                posts.creationAt,
            GROUP_CONCAT(DISTINCT imgposts.img) AS images, 
                user.username, 
                user.photo,
            COUNT(DISTINCT likes.id) AS likeCount,
            MAX(likes.userId = ?) AS hasLiked
            FROM 
                posts
            LEFT JOIN 
                imgposts ON posts.id = imgposts.postId
            INNER JOIN 
                user ON posts.userId = user.id
            LEFT JOIN 
                likes ON posts.id = likes.postId
            GROUP BY 
                posts.id, posts.desc, posts.userId, posts.creationAt, user.username, user.photo
            ORDER BY 
                posts.creationAt DESC;
        `, [userId]);
        const posts = results.map(row => ({
            postId: row.postId,
            desc: row.desc,
            creationAt: row.creationAt,
            userId: row.userId,
            username: row.username,
            userPhoto: row.photo,
            images: row.images ? row.images.split(',') : [],
            likeCount: row.likeCount,
            hasLiked: Boolean(row.hasLiked) // Convertir 0 o 1 a booleano
        }));
        res.status(200).json(posts);
    }
    catch (error) {
        console.error('Error al traer los posts con likes:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener los posts con likes' });
    }
    finally {
        if (db)
            db.release();
    }
};
exports.getPosts = getPosts;
const like = async (req, res) => {
    let db;
    const userId = req.user?.userId;
    const { postId } = req.params;
    try {
        db = await (0, db_1.default)();
        const [post] = await db.query("SELECT id FROM posts WHERE id = ?", [postId]);
        if (post.length === 0) {
            res.status(400).json({ message: "El post no existe" });
            return;
        }
        const [liked] = await db.query("SELECT userId, postId FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);
        if (liked.length > 0) {
            res.status(400).json({ message: "El post ya está likeado" });
            return;
        }
        await db.query("INSERT INTO likes (userId, postId) VALUES (?, ?)", [userId, postId]);
        res.status(200).json({ message: "Post likeado" });
    }
    catch (error) {
        console.error('Error al dar like al post:', error);
        res.status(500).json({ message: 'Error al dar like al post' });
    }
    finally {
        if (db)
            db.release();
    }
};
exports.like = like;
const dislike = async (req, res) => {
    let db;
    const userId = req.user?.userId;
    const { postId } = req.params;
    console.log(userId, postId);
    try {
        db = await (0, db_1.default)();
        const [post] = await db.query("SELECT id FROM posts WHERE id = ?", [postId]);
        if (post.length === 0) {
            res.status(400).json({ message: "El post no existe" });
            return;
        }
        const [liked] = await db.query("SELECT userId, postId FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);
        if (liked.length === 0) {
            res.status(400).json({ message: "El post no está likeado" });
            return;
        }
        await db.query("DELETE FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);
        res.status(200).json({ message: "Post deslikeado" });
    }
    catch (error) {
        console.error('Error al dar dislike al post:', error);
        res.status(500).json({ message: 'Error al dar dislike al post' });
    }
    finally {
        if (db)
            db.release();
    }
};
exports.dislike = dislike;
