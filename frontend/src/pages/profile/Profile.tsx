import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import { EditProfile } from "../../components/ModalEditProfile/EditProfile";
import './profile.css';
import { Posts } from "../../components/Posts/Posts";
import { usePost } from "../../context/postContext";



export function Profile() {
    const { user, userProfile, getProfile } = useAuth();
    const { getPostProfile } = usePost()
    const [modal, setModal] = useState<boolean>(false);
    const { userId } = useParams<{ userId: string }>();//si tienes problemas con el useparams recuarda que el error radica en las url ya sea el proxy o del axios

    const [loadingProfile, setLoadingProfile] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(true)

    useEffect(() => {
        if (userId) {
            const fetchProfile = async () => {
                try {
                    await getProfile(Number(userId))
                } catch (error: any) {
                    console.error(error.response.data.message);
                } finally {
                    setLoadingProfile(false)
                }
            };
            fetchProfile();
        }
    }, [userId]);

    useEffect(() => {
        try {
            getPostProfile(Number(userId))
        }  catch (error:any) {   
            console.error(error.response?.data?.message || "Error en traer los posts")
        }finally{
            setLoadingPosts(false)
        }
    }, [userId])

    if (!userProfile) {
        return <div>No se encontró el perfil</div>;
    }

    if (loadingProfile) {
        return <h1>Cargando...</h1>;
    }

    if (loadingPosts) {
        return <h1>Cargando...</h1>;
    }

    return (
        <>
            <section className="profile-content">
                <div className="pPhotoProfile">
                    {userProfile?.photo
                        ? <img src={`/./img/${userProfile.photo}`} alt="userPhoto" />
                        : <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" alt="userPhoto" />
                    }
                </div>
                <div className="pInfoUser">
                    <div className="pInfoEdit">
                        <h1>Datos de la cuenta:</h1>
                        {user?.id === Number(userId) && (
                            <button onClick={() => setModal(!modal)}>Editar perfil</button>
                        )}
                    </div>
                    <div className="pInfoProfile">
                        <div className="pData">
                            <span>Nombre:</span>
                            <p>{userProfile?.username}</p>
                        </div>
                        <div className="pData">
                            <span>Correo:</span>
                            <p>{userProfile?.email}</p>
                        </div>
                    </div>
                </div>
            </section>

            {modal && user?.id === Number(userId) && (
                <EditProfile setModal={setModal} user={user} />
            )}

            <section className="postsProfile">
                <Posts />
            </section>
        </>
    );
}
