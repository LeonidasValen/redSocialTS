import axios from "axios"

axios.defaults.withCredentials = true;

export const getUser = async() => axios.get(`/user/user`)

export const searchUsers = async(searchUser: string) => axios.get(`/user/searchUser`, { params: {searchUser}})

export const getProfiles = async(userId:number) => axios.get(`/user/profile/${userId}`)

export const updateRequest = async(user:any, id:any) => axios.put(`/user/update/${id}`, user, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}
);