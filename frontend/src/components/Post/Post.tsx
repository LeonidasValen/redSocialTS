import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { useAuth } from '../../context/authContext'
import { usePost } from '../../context/postContext';
import { IconImg } from '../../../public/icons/icons';
import './post.css'

interface FormDataState {
    descrip: string;
    files: File[];
}

export function Post() {
    const { isAuthenticated, user } = useAuth();

    const { savePost, getPost } = usePost();

    const textbox = useRef<HTMLTextAreaElement | null>(null);
    const fileInput = useRef<HTMLInputElement | null>(null);

    //ajusta los tamaños del textarea
    function resizeText() {
        if (textbox.current) {
            textbox.current.style.height = '31px';
            textbox.current.style.height = `${textbox.current.scrollHeight}px`;
        }
    }

    const [errors, setErrors] = useState<string | null>();//errores del post
    const [previewImages, setPreviewImages] = useState<string[]>([]);//guarda la visualisacion de la imagen
    const [formData, setFormData] = useState<FormDataState>({
        descrip: '',
        files: [],
    });

    //guarda la descripcion del post
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
        setErrors(null);// elimina el error al volver esc
    }

    //Guarda las imagenes
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const updatedFiles = [...formData.files, ...files];
            if (updatedFiles.length > 4) {
                setErrors('Solo puedes agregar un máximo de 4 fotos');
                return;
            }

            setFormData({ ...formData, files: updatedFiles });
            // Guarda la visualización de la imagen
            const previews = updatedFiles.map((file) => URL.createObjectURL(file));
            setPreviewImages(previews);
            setErrors(null);
        }
    };
    
    //Borra la imagen
    const handleDeleteImg = (index: number) => {
        setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setFormData((prevData) => ({
            ...prevData,
            files: prevData.files.filter((_, i) => i !== index),
        }));
        if (formData.files.length <= 1 && fileInput.current) {
            fileInput.current.value = ''; // Resetea el valor del input de tipo file solo si se eliminó la última imagen
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formSend = new FormData();
        formSend.append('descrip', formData.descrip);

        if (!formData.descrip && formData.files.length === 0) {
            setErrors('Debes agregar algún contenido');
            return;
        }

        formData.files.forEach((file) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                setErrors('Debes agregar una foto válida (JPEG, PNG, JPG)');
                return;
            }
            formSend.append('imgPost', file);
        });

        try {
            //console.log('FormData entries:', Array.from(formSend.entries()));
            await savePost(formSend);
            // Limpia el post
            setFormData({
                descrip: '',
                files: [],
            });
            setPreviewImages([]);
            if (fileInput.current) {
                fileInput.current.value = '';
            }
            setErrors(null);
            getPost();
        } catch (error:any) {
            setErrors(error?.response?.data?.message || "Error al guardar el post por favor intentelo de nuevo");
        }
    }

    return (
        <>
            {isAuthenticated
                ? (
                    <section className='createPost' >
                        <div className="profileImg">
                            {user?.photo
                                ? <img src={`./img/${user?.photo}`} alt="" />
                                : <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" alt="" />
                            }
                        </div>
                        <form className="formPost" onSubmit={handleSubmit}>
                            <div className="fpTextarea">
                                <textarea id="" ref={textbox} onChange={handleChange} onInput={resizeText} placeholder='¿Que vas a publicar?' name='descrip' value={formData.descrip} />
                                {previewImages.length > 0 && (
                                    <div className={`previewImages ${previewImages.length > 1 && ('colum')}`} >
                                        {previewImages.map((src, index) => (
                                            <div className='pImg' key={index}>
                                                <button className='deleteImg' onClick={() => handleDeleteImg(index)}>X</button>
                                                <img src={src} alt={`Preview ${index + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="btnPost">
                                <label htmlFor='imgPost'><IconImg/>Image</label>
                                <input type="file" style={{ display: 'none' }} name='imgPost' accept=".png, .jpg, .jpeg" id='imgPost' onChange={handleFileChange} ref={fileInput} multiple />
                                <button>Publicar</button>
                            </div>
                            {errors && <p className="field-error">{errors}</p>}
                        </form>
                    </section>
                )
                :
                (
                    <></>
                )
            }
        </>
    )
}
