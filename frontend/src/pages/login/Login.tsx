import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import './login.css'
import { IconEye, IconEyeClose } from '../../../public/icons/icons';

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

export function Login() {
  const { signIn } = useAuth()

  const navigate = useNavigate()

  const [eye, setEye] = useState(false)//estado para ver la contraseña

  const [errors, setErrors] = useState<Errors>({})//errores del cliente con el formulario
  const [errorBackend, setErrorBackend] = useState<string[]>([])//errores traidos del backend

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Limpiar el error cuando el usuario comienza a escribir
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors: Errors = {};
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else {
      const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailFormat.test(formData.email)) {
        newErrors.email = 'Ingrese un correo electrónico válido';
      }
    }
    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    // Si hay errores, mostrarlos y detener el envío del formulario
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors || "Error al iniciar sesión, por favor inténtelo de nuevo")
      return;
    }

    try {
      await signIn(formData)
      navigate("/")
    } catch (error: any) {
      //console.error(error?.response?.data)
      setErrors({ general: error?.response?.data?.message || "Error al iniciar sesión, por favor inténtelo de nuevo" })
      setErrorBackend(error?.response?.data?.error || [])
    }
  }

  return (
    <div className='formContent'>
      <form className="register" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <div className="rInputs">
          <label htmlFor="email">Correo</label>
          <input type="email" placeholder='Email' name="email" onChange={handleChange} />
          {
            errors.email && <p className="rError">{errors.email}</p>
          }
          <label htmlFor="password">Contraseña</label>
          <div className='inputPassword'>
            <input type={eye ? 'text' : 'password'} placeholder='Contraseña' name="password" onChange={handleChange} />
            <button className='pEye' onClick={(e)=>{ e.preventDefault(); setEye(!eye)}}>
              { eye 
                ?<IconEyeClose />
                : <IconEye/>
              }
            </button>
          </div>
          {
            errors.password && <p className="rError">{errors.password}</p>
          }
        </div>
        {
          errors.general && <p className="fError">{errors.general}</p>
        }
        {
          errorBackend.map((err, index) => (
            <p className="fError" key={index}>{err}</p>
          ))
        }
        <button className="bSubmit">Iniciar session</button>
        <p>
          No Tenes cuenta? <Link to={'/register'}>Registrate</Link>
        </p>
      </form>
    </div>
  )
}
