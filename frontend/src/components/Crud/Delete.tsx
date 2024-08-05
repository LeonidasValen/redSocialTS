import { Dispatch, SetStateAction, useState } from "react";
import { useAdmin, User } from "../../context/adminContent";

interface DeleteInterface{
  selectedUsers: User | null;
  setIsDelete: Dispatch<SetStateAction<boolean>>;
  page: number;
  limit: number; 
}

export function Delete({ selectedUsers, setIsDelete, page, limit }: DeleteInterface) {

  const { getAllUsers, userDelete } = useAdmin()

  const [error, setErrors] = useState<string | null>(null);

  const handleDeleteUser = (async (id:number) => {
    try {
      await userDelete(id)
      await getAllUsers('',page, limit)
      setIsDelete(false)
    } catch (error: any) {
      console.error(error.response?.data?.message || "Error al borrar al usuario, por favor inténtelo de nuevo")
      setErrors(error.response?.data?.message || "Error al actualizar, por favor inténtelo de nuevo");
    }
  })

  return (
    <section className='modal'>
      <div className="modalbg" onClick={() => setIsDelete(false)}></div>
      <div className="mTarget">
        <h1 className="tDelete">¿Seguro que quieres eliminar al usuario?</h1>
        {error && <p className="fError">{error}</p>}
        <div className="btnDelete">
          <button onClick={() => selectedUsers && handleDeleteUser(selectedUsers.id)}>Eliminar</button>
          <button onClick={() => setIsDelete(false)}>Cancelar</button>
        </div>
      </div>
    </section>
  )
}
