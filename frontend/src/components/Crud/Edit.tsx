import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { useAdmin } from '../../context/adminContent';
import { IconDeleted } from '../../../public/icons/icons';

export interface User {
  id: number;
  photo: string | null;
  username: string;
  rol: string;
}

interface EditInterface {
  selectedUsers: User ;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  page: number;
  limit: number;
}

interface FormDataState {
  photo: File | null;
  username: string;
  rol: string;
}

interface Errors {
  username?: string;
  photo?: string;
  general?: string;
}

export function Edit({ selectedUsers, setIsEditing, page, limit }: EditInterface) {

  const { getAllUsers, updateUser } = useAdmin()
  const [formData, setFormData] = useState<FormDataState>({
    username: selectedUsers.username,
    photo: null,
    rol: selectedUsers.rol,
  });
  
  const [deletePhoto, setDeletePhoto] = useState<boolean>(false);//detecta si borro si foto
  const [errors, setErrors] = useState<Errors>({});//trae los errores del cliente
  const [errorBackend, setErrorBackend] = useState<string[]>([]);//trae los errores del backend
  
  //guarda lo que escribe
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Limpia el error
  };
  
  //guarda la foto
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, photo: selectedFile });
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    //verificacion de los inputs
    const roles = ['Admin', 'noVerify', 'Verify'];
    const newErrors: Errors = {};
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }
    if (!roles.includes(formData.rol)) {
      newErrors.username = 'El rol es requerido';
    }
    //obtienen todos los errores
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('username', formData.username);
      formDataToSubmit.append('rol', formData.rol);
      if (deletePhoto) {//detecta si borro la foto
        formDataToSubmit.append('photo', 'null'); // Indicar que la foto debe ser eliminada
      } else if (formData.photo) {//si hay una foto nueva envia la nueva foto
        formDataToSubmit.append('photo', formData.photo);
      }
      //console.log('FormData entries:', Array.from(formData.entries()));
      await updateUser(formDataToSubmit as unknown as Partial<User>, selectedUsers.id);
      await getAllUsers('',page, limit)
      setIsEditing(false);
    } catch (error: any) {
      setErrors({ general: error?.response?.data?.message || "Error al actualizar el usuario" })
      setErrorBackend(error.response?.data?.error || []);
    }
  };

  //borra la foto
  const handleDeletePhoto = () => {
    setDeletePhoto(true);
    setFormData({ ...formData, photo: null });
  };

  return (
    <section className='modal'>
      <div className="modalbg" onClick={() => setIsEditing(false)}></div>
      <div className="mTarget">
        <div className="mHeader">
          <h1>Editar perfil</h1>
          <button onClick={() => setIsEditing(false)}>X</button>
        </div>
        <form className="mContent" onSubmit={handleSubmit}>
          <div className="mpPhoto">
            {selectedUsers.photo
              ? <img src={`./img/${selectedUsers.photo}`} alt="" />
              : <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" alt="" id='iPhoto' />
            }
            <input type="file" accept=".png, .jpg, .jpeg" name="photo" onChange={handleFileChange} />
            {selectedUsers.photo &&
              <button type="button" className="mpDelete" onClick={handleDeletePhoto}>
                <IconDeleted />
              </button>
            }
          </div>
          <div className="mpEdit">
            <label htmlFor="username">Nombre</label>
            <input type="text" placeholder="username"  name="username" value={formData.username} onChange={handleChange} />
            <label htmlFor="rol">Rol:</label>
            <select id="rol" name="rol" value={formData.rol} onChange={handleChange}>
              <option value='Admin'>Admin</option>
              <option value='Verify'>Verify</option>
              <option value='noVerify'>noVerify</option>
            </select>

            {errors.username && <p className="rError">Nombre de usuario requerido</p>}
            {errors.photo && <p className="rError">Foto de usuario es requerida</p>}
            {
              errors.general && <p className="fError">{errors.general}</p>
            }
            {errorBackend.length > 0 && errorBackend.map((err, index) => (
              <p className="fError" key={index}>{err}</p>
            ))}
            <button className="bSubmit" type="submit">Actualizar</button>
          </div>
        </form>
      </div>
    </section>
  )
}
