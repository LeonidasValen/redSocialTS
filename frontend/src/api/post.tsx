import axios from "axios"

axios.defaults.withCredentials = true;

export const getPosts = async () => axios.get(`/post/posts`)

export const getPostsProfiles = async (userId: number) => axios.get(`/post/postsUser/${userId}`)

export const postLikes = async (postId: number) => axios.post(`/post/like/${postId}`)

export const disLike = async (postId: number) => axios.delete(`/post/dislike/${postId}`)

export const savedPost = async (post: any) => axios.post(`/post/post`, post, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}
)