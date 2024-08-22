import axios from "axios"

axios.defaults.withCredentials = true;

export const registerRequest = async(user:any) => axios.post(`/auth/register`, user)

export const verifyToken = async(token:any) => axios.post(`/auth/verifyEmail`, { token })

export const loginRequest = async(user:any) => axios.post(`/auth/login`, user)

export const logoutRequest = async() => axios.post(`/auth/logout`)
