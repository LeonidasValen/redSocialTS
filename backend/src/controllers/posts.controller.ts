import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import connectToDB from "../db/db";
import { UserIdInterface } from "../interface/user";
import { Request, Response } from "express";

interface ExistingUser extends RowDataPacket {
    id: number;
}

interface PostRow extends RowDataPacket {
    postId: number;
    desc: string;
    userId: number;
    creationAt: string;
    images: string | null;
    username: string;
    photo: string | null;
    likeCount: number;
    hasLiked: number;
}

interface PostId extends RowDataPacket {
    postId: number;
    userId: number;
}

export const post = async (req: UserIdInterface, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const descrip = req.body.descrip;

    let cover: string[] = [];
    try {
        if (req.files && Array.isArray(req.files)) {
            cover = req.files.map(file => file.filename);
        }

        if (cover.length === 0 && !descrip) {
            res.status(400).json({ message: 'Debes agregar algún contenido, ya sea descripción o imágenes.' });
            return;
        }

        // Verificar si el usuario existe
        const [userUpdate] = await req.db!.query<ExistingUser[]>("SELECT id FROM user WHERE id = ?", [userId]);
        if (userUpdate.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return
        }
        // Insertar el post
        const [postInsertResult] = await req.db!.query<ResultSetHeader>("INSERT INTO posts (`desc`, userId) VALUES (?, ?)", [descrip, userId]);
        const postId = postInsertResult.insertId;

        // Insertar las imágenes asociadas al post
        if (cover.length > 0) {
            const imgPostsValues = cover.map(filename => [filename, postId]);
            await req.db!.query("INSERT INTO imgposts (img, postId) VALUES ?", [imgPostsValues]);
        }

        res.status(200).json({ message: 'Post guardado' });
    } catch (error) {
        console.error('Error al guardar el post:', error);
        res.status(500).json({ message: 'Error en el servidor al guardar el post' });
    }
}

export const getPosts = async (req: UserIdInterface, res: Response): Promise<void> => {
    const userId = req.user?.userId || null; // Si el usuario está autenticado, obtiene su ID
    try {

        const [results] = await req.db!.query<PostRow[]>(`
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

        // Procesar los resultados y calcular el puntaje de relevancia
        const posts = results.map(row => {
            const ageInDays = (new Date().getTime() - new Date(row.creationAt).getTime()) / (1000 * 60 * 60 * 24);

            // Ponderación básica
            const relevanceScore =
                row.likeCount * 2 +  // Ponderación de los likes
                (row.hasLiked ? 5 : 0) -  // Bonificación si el usuario ha dado "like"
                ageInDays;  // Penalización por antigüedad (publicaciones más antiguas tienen menos relevancia)

            return {
                postId: row.postId,
                desc: row.desc,
                creationAt: row.creationAt,
                userId: row.userId,
                username: row.username,
                userPhoto: row.photo,
                images: row.images ? row.images.split(',') : [],
                likeCount: row.likeCount,
                hasLiked: Boolean(row.hasLiked),
                relevanceScore // Agrega el puntaje de relevancia
            };
        });

        // Ordenar las publicaciones por el puntaje de relevancia
        posts.sort((a, b) => b.relevanceScore - a.relevanceScore);

        res.status(200).json(posts);

    } catch (error) {
        console.error('Error al traer los posts con likes:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener los posts con likes' });
    }
}

//trae el post de un usuario
export const getPostsUsers = async (req: UserIdInterface, res: Response): Promise<void> => {
    const userIdProfile = req.params?.id; // Si el usuario está autenticado, obtiene su ID
    const userId = req.user?.userId || null;

    if (!userIdProfile) {
        res.status(400).json({ message: 'El ID del perfil no es valido' });
        return;
    }
    try {

        const [results] = await req.db!.query<PostRow[]>(`
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
            WHERE
                posts.userId = ?
            GROUP BY 
                posts.id, posts.desc, posts.userId, posts.creationAt, user.username, user.photo
            ORDER BY 
                posts.creationAt DESC;
        `, [userId, userIdProfile]);

        const posts = results.map(row => ({
            postId: row.postId,
            desc: row.desc,
            creationAt: row.creationAt,
            userId: row.userId,
            username: row.username,
            userPhoto: row.photo,
            images: row.images ? row.images.split(',') : [],
            likeCount: row.likeCount,
            hasLiked: Boolean(row.hasLiked) // Convierte 0 o 1 a booleano
        }));

        res.status(200).json(posts);

    } catch (error) {
        console.error('Error al traer los posts con likes:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener los posts con likes' });
    }
}

export const like = async (req: UserIdInterface, res: Response): Promise<void> => {
    let db;
    const userId = req.user?.userId;
    const { postId } = req.params;

    try {
        db = await connectToDB();

        const [post] = await db.query<PostRow[]>("SELECT id FROM posts WHERE id = ?", [postId]);
        if (post.length === 0) {
            res.status(400).json({ message: "El post no existe" });
            return
        }

        const [liked] = await db.query<PostRow[]>("SELECT userId, postId FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);
        if (liked.length > 0) {
            res.status(400).json({ message: "El post ya está likeado" });
            return
        }

        await db.query("INSERT INTO likes (userId, postId) VALUES (?, ?)", [userId, postId]);

        res.status(200).json({ message: "Post likeado" });
    } catch (error) {
        console.error('Error al dar like al post:', error);
        res.status(500).json({ message: 'Error al dar like al post' });
    } finally {
        if (db) db.release();
    }
};

export const dislike = async (req: UserIdInterface, res: Response): Promise<void> => {
    let db;
    const userId = req.user?.userId;
    const { postId } = req.params;
    console.log(userId, postId)

    try {
        db = await connectToDB();

        const [post] = await db.query<PostId[]>("SELECT id FROM posts WHERE id = ?", [postId]);
        if (post.length === 0) {
            res.status(400).json({ message: "El post no existe" });
            return
        }

        const [liked] = await db.query<PostId[]>("SELECT userId, postId FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);
        if (liked.length === 0) {
            res.status(400).json({ message: "El post no está likeado" });
            return
        }

        await db.query("DELETE FROM likes WHERE userId = ? AND postId = ?", [userId, postId]);

        res.status(200).json({ message: "Post deslikeado" });
    } catch (error) {
        console.error('Error al dar dislike al post:', error);
        res.status(500).json({ message: 'Error al dar dislike al post' });
    } finally {
        if (db) db.release();
    }
};