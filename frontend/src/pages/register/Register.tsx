import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import './register.css'

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export function Register() {
  const { signUp } = useAuth()

  const navigate = useNavigate()

  const [errors, setErrors] = useState<Errors>({})//errores del cliente con el formulario
  const [errorBackend, setErrorBackend] = useState<string[]>([])//errores traidos del backend

  const [formData, setFormData] = useState<FormData>({
    username: '',
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
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es obligatorio'
    }
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
      await signUp(formData)
      navigate("/")
    } catch (error: any) {
      //console.error(error)
      setErrors({ general: error?.response?.data?.message || "Error al iniciar sesión, por favor inténtelo de nuevo" })
      setErrorBackend(error.response?.data?.error || [])
    }
  }
  console.log(errorBackend)

  return (
    <div className='formContent'>
      <form className="register" onSubmit={handleSubmit}>
        <h1>Registrarte</h1>
        <div className="rInputs">
          <label htmlFor="username">Nombre</label>
          <input type="text" placeholder='Nombre' name="username" onChange={handleChange} />
          {
            errors.username && <p className="rError">{errors.username}</p>
          }
          <label htmlFor="email">Correo</label>
          <input type="email" placeholder='Email' name="email" onChange={handleChange} />
          {
            errors.email && <p className="rError">{errors.email}</p>
          }
          <label htmlFor="password">Contraseña</label>
          <input type="password" placeholder='Contraseña' name="password" onChange={handleChange} />
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
        <button className="bSubmit">Registrarse</button>
        <p>
          Tenes cuenta? <Link to={'/login'}>Iniciar sesion</Link>
        </p>
      </form>
    </div>
  )
}
