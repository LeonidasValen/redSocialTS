import { createContext, ReactNode, useContext, useState } from "react";
import { disLike, getPosts, getPostsProfiles, postLikes, savedPost } from "../api/post";

interface PostContextProps {
    posts: Post[];
    loading: boolean;
    getPost: () => Promise<void>;
    getPostProfile: (userId: number) => Promise<void>;
    saveLike: (postId: number) => Promise<void>;
    removeLike: (postId: number) => Promise<void>;
    savePost: (value: FormData) => Promise<void>;
}

interface Post {
    postId: number;
    userId: number;
    userPhoto: string;
    username: string;
    creationAt: string;
    desc: string;
    images: string[];
    hasLiked: boolean;
    likeCount: number;
}

export const PostContext = createContext<PostContextProps | undefined>(undefined)

export const usePost = () => {
    const context = useContext(PostContext)
    if (!context) {
        throw new Error("postContext no esta dentro del contexto")
    }
    return context
}

interface PostProvider {
    children: ReactNode
}

export const PostProvider: React.FC<PostProvider> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    // const [ likes, setLikes] = useState<Record<number, boolean>>({});

    const getPost = async () => {
        setPosts([]);//borra la info del posts para evitar conflictos con los posts del perfil con el del home
        try {
            const res = await getPosts()
            setPosts(res.data)
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error en traer los posts")
        } finally {
            setLoading(false)
        }
    }

    const getPostProfile = async (userId: number) => {
        setPosts([]);
        try {
            const res = await getPostsProfiles(userId)
            setPosts(res.data)
        } catch (error: any) {
            console.error(error.response?.data?.message || "Error en traer los posts")
        }finally {
            setLoading(false)
        }
    }

    const saveLike = async (postId: number) => {
        //console.log(postId)
        await postLikes(postId)
    }
    const removeLike = async (postId: number) => {
        await disLike(postId)
        //console.log(res)
    }

    const savePost = async (value: FormData) => {
        await savedPost(value)
        //console.log(res)
    }

    return (
        <PostContext.Provider value={{ savePost, getPost, getPostProfile, posts, saveLike, removeLike, loading }}>
            {children}
        </PostContext.Provider>
    )
}