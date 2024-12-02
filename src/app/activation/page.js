'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validateCode } from '../utils/validations';
import { activateUser } from '../services/api';

export default function Activation() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    const codeError = validateCode(code);
    if (codeError) {
      setError(codeError);
      setIsProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const data = await activateUser(token, code);
      console.log(data);
      router.push('/login'); // Despues de activar el usuario, redirigir al login
    } catch (err) {
      setError(err.message || 'Error en la activación del usuario.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-20 bg-dark-100">
      <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Activación de su cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Código
            </label>
            <input
              id="code"
              value={code}
              placeholder="Ingrese el código que recibió por correo..."
              onChange={(e) => setCode(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {isProcessing && <p className="text-blue-500 text-sm">Procesando activación...</p>}
          <button
            disabled={isProcessing}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isProcessing ? 'Procesando...' : 'Activar cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}