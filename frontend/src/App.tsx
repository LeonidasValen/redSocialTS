import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layaout } from './components/Layaout'
import ErrorPage from './ErrorPage'
import { Home } from './pages/home/Home'
import { Register } from './pages/register/Register'
import { Login } from './pages/login/Login'
import { Profile } from './pages/profile/Profile'
import { AdminPanel } from './pages/admin/AdminPanel'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layaout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: '/profile',
          element: <Profile/>
        },
        {
          path: '/admin',
          element: <AdminPanel/>
        },
      ]
    },
    {
      path: '/register',
      element: <Register/>
    },
    {
      path: '/login',
      element: <Login/>
    }
  ])


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
