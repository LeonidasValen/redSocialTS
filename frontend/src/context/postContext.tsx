import { createContext, ReactNode, useContext, useState } from "react";
import { disLike, getPosts, postLikes, savedPost } from "../api/post";

interface PostContextProps {
    posts: Post[];
    loading: boolean;
    // likes: Record<number, boolean>;
    // setLikes: (likes: Record<number, boolean>) => void;
    getPost: () => Promise<void>;
    saveLike: (postId: number) => Promise<void>;
    removeLike: (postId: number) => Promise<void>;
    savePost: (value: FormData) => Promise<void>;
}

interface Post {
    postId: number;
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
        try {
            const res = await getPosts()
            setPosts(res.data)
        } catch (error:any) {   
            console.error(error.response?.data?.message || "Error en traer los posts")
        }finally{
            setLoading(false)
        }
    }

    const saveLike = async(postId:number) => {
        //console.log(postId)
        await postLikes(postId)
    }
    const removeLike = async (postId: number) => {
        const res = await disLike(postId)
        console.log(res)
    }

    const savePost = async (value: FormData) => {
        await savedPost(value)
        //console.log(res)
    }

    return (
        <PostContext.Provider value={{ savePost, getPost, posts, saveLike, removeLike, loading }}>
            {children}
        </PostContext.Provider>
    )
}