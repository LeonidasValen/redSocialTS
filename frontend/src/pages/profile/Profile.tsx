import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import './profile.css'
import { EditProfile } from "../../components/ModalEditProfile/EditProfile";

export function Profile() {
    const { loading, isAuthenticated, user } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) { // Espera a que el estado de carga termine
            if (!isAuthenticated || !user) {
                navigate('/');
            }
        }
    }, [loading, isAuthenticated, user, navigate]);

    const [modal, setModal] = useState<boolean>(false)

    return (
        <>
            <section className="profile-content">
                <div className="pPhotoProfile">
                    {user?.photo
                        ? <img src={`./img/${user.photo}`} alt="userPhoto" />
                        : <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" alt="userPhoto" />
                    }
                </div>
                <div className="pInfoUser">
                    <div className="pInfoEdit">
                        <h1>Datos de la cuenta:</h1>
                        <button onClick={() => setModal(!modal)}>Editar perfil</button>
                    </div>
                    <div className="pInfoProfile">
                        <div className="pData">
                            <span>Nombre:</span>
                            <p>{user?.username}</p>
                        </div>
                        <div className="pData">
                            <span>Correo:</span>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                </div>
            </section>

            {modal && user && (
                <EditProfile setModal={setModal} user={user} />
            )}
        </>
    )
}