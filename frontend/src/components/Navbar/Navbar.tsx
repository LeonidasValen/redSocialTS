import { Link, useNavigate } from 'react-router-dom'
import './navbar.css'
import { useAuth } from '../../context/authContext'

export function Navbar() {

    const { loading, isAuthenticated, user, logout } = useAuth();

    const navigate = useNavigate()

    const handleLogout = () => {
        const logouts = async () => {
            try {
                await logout()
                navigate('/login')
            } catch (error) {
                console.error("Error al cerrar sesion:");
            }
        }
        logouts()
    }

    if (loading) {
        return <h1>Cargando...</h1>;
    }

    return (
        <nav className='navbar'>
            <header className='nHeader'>
                <h1 className="nLogo"><Link to={'/'}>LOGO</Link></h1>
                <ul className="nItems">
                    {isAuthenticated
                        ? (
                            <>
                                <li className='nProfile'>
                                    {user?.photo
                                        ? <img src={`/./img/${user?.photo}`} alt="" />
                                        : <img src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png" alt="" />
                                    }
                                </li>
                                <li>
                                    <Link to={`/profile/${user?.id}`}>{user?.username}</Link>
                                </li>
                                {user?.rol === 'Admin' &&
                                    <li>
                                        <Link to={'/admin'}>Panel admin</Link>
                                    </li>
                                }
                                <li>
                                    <span onClick={handleLogout}>Cerrar sesion</span>
                                </li>
                            </>
                        )
                        : (
                            <>
                                <li>
                                    <Link to={'/register'}>Registrate</Link>
                                </li>
                                <li>
                                    <Link to={'/login'}>Iniciar sesion</Link>
                                </li>
                            </>
                        )
                    }
                </ul>
            </header>
        </nav>
    )
}
