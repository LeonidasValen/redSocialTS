import { useEffect, useState } from "react";
import { useAdmin, User } from "../../context/adminContent";
import { useAuth } from "../../context/authContext";
import { Navigate } from "react-router-dom";
import { Search } from "../../components/Crud/Search";
import { Table } from "../../components/Crud/Table";
import { Pagination } from "../../components/Crud/Pagination";
import { Edit } from "../../components/Crud/Edit";
import { Delete } from "../../components/Crud/Delete";

import './adminPanel.css'

export function AdminPanel() {
    const { isAuthenticated, user } = useAuth()
    //trae los datos del usuario
    const { getAllUsers, users, totalUser, loading } = useAdmin()
    //buscador
    const [search, setSearch] = useState('')
    //paginacion
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    //fetch de los usuarios
    useEffect(() => {
        try {
            getAllUsers(search, page, limit)
        } catch (error) {
            console.error(error)
        }
    }, [page, limit])

    const totalPages = Math.ceil(totalUser / limit);

    //modal de editar y borrar
    const [isEditing, setIsEditing] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    //guarda los datos del empleado para luego su edicion
    const [selectedUsers, setSelectedUsers] = useState<User | null>(null);

    //funcion para editar
    const handleEdit = (id: number) => {
        //obtiene los datos del usuario seleccionado
        const [userToEdit] = users.filter(user => user.id === id)
        setSelectedUsers(userToEdit)
        setIsEditing(true)//muestra el modal
    }
    //funcion para borrar al usuario
    const handleDelete = (id: number) => {
        const [userToDelete] = users.filter(user => user.id === id)
        setSelectedUsers(userToDelete)
        setIsDelete(true)
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        isAuthenticated && user?.rol === "Admin"
            ? <>
                <section className='table-users'>
                    <Search limit={limit} search={search} setSearch={setSearch} setPage={setPage}/>
                    <Table users={users} handleEdit={handleEdit} handleDelete={handleDelete} />
                    <Pagination totalPages={totalPages} page={page} setPage={setPage} />
                </section>
                {isEditing && selectedUsers && (
                    <Edit selectedUsers={selectedUsers} setIsEditing={setIsEditing} page={page} limit={limit} />
                )}
                {isDelete && selectedUsers && (
                    <Delete selectedUsers={selectedUsers} setIsDelete={setIsDelete} page={page} limit={limit} />
                )}
            </>
            : <Navigate to={'/error'} />
    )
}