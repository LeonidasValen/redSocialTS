import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import './register.css';

export function Verifyemail() {
    const location = useLocation();
    const { verifyEmail } = useAuth();
    const [errors, setErrors] = useState('');
    const [errorsBackend, setErrorsBackend] = useState([]);

    useEffect(() => {
        const verifyToken = async (token:string) => {
            try {
                await verifyEmail(token);
            } catch (error:any) {
                setErrors(error.response?.data?.message || "Error al verificar el email, por favor inténtelo de nuevo");
                setErrorsBackend(error.response?.data?.error || []);
            }
        };

        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');

        if (tokenFromUrl) {
            verifyToken(tokenFromUrl);
        }
    }, [location.search, verifyEmail]);

    return (
        <div>
            {errors ? <div className="error">{errors}</div> : <div>Email verificado ya puede <Link to={'/login'}>iniciar sesion</Link></div>}
            {errorsBackend.length > 0 && (
                <ul>
                    {errorsBackend.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}