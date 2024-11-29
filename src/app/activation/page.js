'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { validateCode} from '../utils/validations'
import { validateAccount } from '../services/api'


export default function Login() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLogin(true)

    const codeError = validateCode(code)

    if (codeError) {
        setError(codeError)
        setIsLogin(false)
        return
    }

    try {
      const data = await validateAccount({ code })
      localStorage.setItem('token', data.idToken)
      setIsLogin(false)
      router.push('/')
    } catch (err) {
      setError(err.message || 'Error en el inicio de sesión')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Activacion de usuario:</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Codigo</label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button disabled={isLogin} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            { isLogin ? 'Procesando...' : 'PROCESAR' }
          </button>
        </form>
      </div>
    </div>
  )
}