import { createContext, ReactNode, useContext, useState } from "react"
import { deleteUser, getUsers, updateRequest } from "../api/admin";

interface AdminContextProps {
    loading: boolean;
    users: User[];
    totalUser: number;
    updateUser: (user: Partial<User>, id: number) => Promise<void>;
    userDelete: (id: number) => Promise<void>;
    getAllUsers: (searchUser: string, page: number, limit: number) => Promise<void>;
}

export interface User {
    id: number;
    photo: string | null;
    username: string;
    email: string;
    rol: string;
    f_creation: Date;
}

export const AdminContext = createContext<AdminContextProps | undefined>(undefined)
//verifica que este el contexto
export const useAdmin = () => {
    const context = useContext(AdminContext)
    if (!context) {
        throw new Error("useAdmin no esta dentro del contexto")
    }
    return context
}

interface AuthProviderProp {
    children: ReactNode
}

export const AdminProvider: React.FC<AuthProviderProp> = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([]);
    const [totalUser, setTotalUser] = useState(0);

    const updateUser = async (user: Partial<User>, id: number) => {
        await updateRequest(user, id)
        //console.log(user)
    }

    const userDelete = async (id: number) => {
        await deleteUser(id)
        //console.log(res)
    }

    const getAllUsers = async (searchUser: string, page: number, limit: number) => {
        try {
            const res = await getUsers(searchUser, page, limit)
            //console.log(res.data.users)
            setUsers(res.data.users)
            setTotalUser(res.data.total)
        } catch (error) {
            console.error("Error en el servidor al traer los usuarios")
            setUsers([])
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <AdminContext.Provider value={{ loading, users, totalUser, updateUser, userDelete, getAllUsers }}>
            {children}
        </AdminContext.Provider>
    )
}