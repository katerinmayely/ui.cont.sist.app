import { API_URL } from '@/app/utils/settings';

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Error en creacion de cuenta');
    }
    return response.json();
  };

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error('Error en el inicio de sesión');
  }
  return response.json();
};

export const getUserData = async (token) => {
  const response = await fetch(`${API_URL}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener datos del usuario');
  }
  return response.json();
};

// Consumir endpoint para activar usuario
export const activateUser = async (token, code) => {
  const response = await fetch(`${API_URL}/activation`, {
    method: 'POST', // Especificar el método HTTP
    headers: {
      'Authorization': `Bearer ${token}`, // Token de autorización
      'Content-Type': 'application/json', // Encabezado para enviar JSON
    },
    body: JSON.stringify({ code }), // Convertir el código a JSON
  });

  if (!response.ok) {
    throw new Error('Error al activar el usuario');
  }
  return await response.json();
};