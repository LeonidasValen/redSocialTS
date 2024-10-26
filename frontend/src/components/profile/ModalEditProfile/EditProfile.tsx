import { useState, ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import { useAuth } from '../../../context/authContext';
import { IconDeleted } from '../../../../public/icons/icons';
import './editProfile.css';

interface User {
  id: number;
  photo: string | null;
  username: string;
}

interface ModalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  user: User;
}

interface FormDataState {
  username: string;
  photo: File | null;
}

interface Errors {
  username?: string;
  photo?: string;
  general?: string;
}

export const EditProfile: React.FC<ModalProps> = ({ setModal, user }) => {
  const { updateUser, checkLogin } = useAuth();

  //guarda los datos del usuario
  const [formData, setFormData] = useState<FormDataState>({
    username: user.username,
    photo: null
  });

  const [deletePhoto, setDeletePhoto] = useState<boolean>(false);//detecta si borro si foto
  const [errors, setErrors] = useState<Errors>({});//trae los errores del cliente
  const [errorBackend, setErrorBackend] = useState<string[]>([]);//trae los errores del backend

  //guarda lo que escribe
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });//limpia el error
  };

  //guarda la foto
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, photo: selectedFile });
  };

  //envio de los datos
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Errors = {};
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }
    //obtienen todos los errores
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('username', formData.username);//guarda el nombre en FormData
    if (deletePhoto) {//detecta si borro la foto
      formDataToSubmit.append('photo', 'null'); // Indicar que la foto debe ser eliminada
    } else if (formData.photo) {//si hay una foto nueva envia la nueva foto
      formDataToSubmit.append('photo', formData.photo);
    }
   // console.log('FormData entries:', Array.from(formDataToSubmit.entries()));

    try {
      //envia los datos al servidor
      await updateUser(formDataToSubmit as unknown as Partial<User>, user.id);
      checkLogin();
      setModal(false);
    } catch (error: any) {
      setErrors({ general: error?.response?.data?.message || "Error al iniciar sesión, por favor inténtelo de nuevo" })
      setErrorBackend(error.response?.data?.error || []);
    }
  };

  //borra la foto
  const handleDeletePhoto = () => {
    setDeletePhoto(true);
    setFormData({ ...formData, photo: null });
  };

  return (
    <section className="modal">
      <div className="modalbg" onClick={() => setModal(false)}></div>
      <div className="mTarget">
        <div className="mHeader">
          <h1>Editar perfil</h1>
          <button onClick={() => setModal(false)}>X</button>
        </div>
        <form className="mContent" onSubmit={handleSubmit}>
          <div className="mpPhoto">
            {user.photo
              ? <img src={`/./img/${user.photo}`} alt="" />
              : <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" alt="" id="iPhoto" />
            }
            <input type="file" accept=".png, .jpg, .jpeg" name="photo" onChange={handleFileChange} />
            {user.photo &&
              <button type="button" className="mpDelete" onClick={handleDeletePhoto}>
                <IconDeleted />
              </button>
            }
          </div>
          <div className="mpEdit">
            <label htmlFor="username">Nombre</label>
            <input type="text" placeholder="username" name="username" value={formData.username} onChange={handleChange} />
            {errors.username && <p className="rError">{errors.username}</p>}
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
  );
};
