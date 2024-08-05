import axios from "axios"

axios.defaults.withCredentials = true;

export const getUsers = async(searchUser:any, page:any, limit:any) => axios.get(`admins/allUsers`, { params: {searchUser, page, limit } })

export const deleteUser = async(id:any) => axios.delete(`admins/deleteUser/${id}`)

export const updateRequest = async(user:any, id:any) => axios.put(`admins/updateUser/${id}`, user, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}
);