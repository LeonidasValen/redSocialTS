import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getUser, loginRequest, logoutRequest, registerRequest, updateRequest, verifyToken } from "../api/auth";


interface AuthContextProps {
    loading: boolean;
    isAuthenticated: boolean;
    user: User | null;
    signUp: (user: Partial<User>) => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
    signIn: (user: Partial<User>) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: Partial<User>, id: number) => Promise<void>;
    checkLogin: () => Promise<void>;
}

interface User {
    id: number;
    email: string;
    photo: string | null;
    rol: string;
    username: string;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

//verifica que este el conetexto
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth no esta dentro del contexto")
    }
    return context;
}

interface AuthProviderProp {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProp> = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null)

    //Register
    const signUp = async (user: Partial<User>) => {
        await registerRequest(user)
        //console.log(ress)
    }

    //Verifica el correo
    const verifyEmail = async (token: string) => {
        await verifyToken(token)
        //console.log(res)
    }

    //login
    const signIn = async (user: Partial<User>) => {
        const res = await loginRequest(user)
        //console.log(res)
        setUser(res.data)
        setAuthenticated(true)
        localStorage.setItem('session_username', res.data.username);
    }

    const logout = async () => {
        await logoutRequest()
        setUser(null)
        setAuthenticated(false)
        localStorage.removeItem('session_username');
    }

    // Actualizar usuario
    const updateUser = async (user: Partial<User>, id: number) => {
        await updateRequest(user, id);
        //console.log(res)
    }

    const checkLogin = async () => {
        const storedUsername = localStorage.getItem('session_username');
        if (storedUsername) {
            try {
                const res = await getUser();
                if (!res.data) {
                    setAuthenticated(false);
                    localStorage.removeItem('session_username');
                } else {
                    setAuthenticated(true);
                    setUser(res.data.user);
                }
            } catch (error) {
                setAuthenticated(false);
                setUser(null);
                localStorage.removeItem('session_username');
            } finally {
                setLoading(false);
            }
        } else {
            setAuthenticated(false);
            setUser(null);
            setLoading(false);
        }
    }

    //trae los datos del usuario
    useEffect(() => {
        checkLogin();
    }, []);

    if (loading) {
        return <h1>Cargando...</h1>;
    }

    return (
        <AuthContext.Provider value={{ loading, isAuthenticated, user, signUp, verifyEmail, signIn, logout, updateUser, checkLogin }}>
            {children}
        </AuthContext.Provider>
    )
}