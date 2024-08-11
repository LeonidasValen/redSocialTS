import axios from "axios"

axios.defaults.withCredentials = true;

export const registerRequest = async(user:any) => axios.post(`/auth/register`, user)

export const verifyToken = async(token:any) => axios.post(`/auth/verifyEmail`, { token })

export const loginRequest = async(user:any) => axios.post(`/auth/login`, user)

export const getUser = async() => axios.get(`/user/user`)

export const getProfiles = async(userId:number) => axios.get(`http://localhost:8000/user/profile/${userId}`)

export const logoutRequest = async() => axios.post(`/auth/logout`)

export const updateRequest = async(user:any, id:any) => axios.put(`/user/update/${id}`, user, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}
);