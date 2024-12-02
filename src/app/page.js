'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserData } from '@/app/services/api'

export default function Home() {
  const [user, setUser] = useState(null)
  const [timeTrans, setTimeTrans] = useState('');

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        router.push('/login')
        return
      }

      try {
        const userData = await getUserData(token)
        setUser(userData)

        let time = userData.timeTrans;

        // Establecer la duración transcurrida en formato adecuado
        let duration = '';

        if(time.y !== 0) {
          duration = `${time.y} años`;
        } else if(time.months !== 0) {
          duration = `${time.months} meses`;
        } else if(time.days !== 0) {
          duration = `${time.days} días`;
        } else if(time.hours !== 0) {
          duration = `${time.hours} horas`;
        } else {
          duration = `${time.minutes} minutos`;
        }

        setTimeTrans(duration);

        console.log(userData);
      } catch (err) {
        console.error('Error fetching user data:', err)
        localStorage.removeItem('token')
        router.push('/login')
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="bg-DARK-100 p-4">
      <div className="max-w-md mx-auto bg-gray-100 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Bienvenido (a)</h1>
        <div className="space-y-2 text-gray-800">
          <p><strong>Nombre:</strong> {user.firstname}</p>
          <p><strong>Apellido:</strong> {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cerrar Sesión
        </button>
      </div>
      <p className='text-gray-100 flex justify-center mt-10' ><strong>Han transcurrido {timeTrans} desde la activación de la cuenta.</strong></p>
    </div>
  )
}
