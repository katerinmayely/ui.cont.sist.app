import { API_URL, GRAPHQL_URL } from '@/app/utils/settings';
import { GraphQLClient } from 'graphql-request';

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

// GraphQL
// Funcion para crear un nuevo cliente de GraphQL: Me sirve para autenticar el uso del servicio
// para poder hacer las queries sin problemas
const createGraphQLClient = (token) => {
  return new GraphQLClient(GRAPHQL_URL, {
    headers: token ? {
      Authorization: `Bearer ${token}`,
    } : {},
  });
};

export const getAccounts = async (email, token) => {
  const graphQLClient = createGraphQLClient(token);

  const query = `
    query Transacciones($email: String) {
      usuarios(email: $email) {
        email
        id
        cuentas {
          account_name
          id
          total
          transacciones {
            amount
            current_balance
            description
            etiquetas {
              etiqueta {
                id
                name
              }
            }
            transaction_date
          }
        }
      }
    }
  `;

  const variables = {
    "email": email
  };

  try {
    const data = await graphQLClient.request(query, variables);
    return data
  } catch (error) {
    console.log("Error fetching user accounts", error);
    throw new Error("Error al obtener las cuentas del usuario.");
  }
}

export const getTransactionsCount = async (idUser, token) => {
  const graphQLClient = createGraphQLClient(token);

  const query = `
    query conteoTransaccionesTag($id_user: Int!) {
      conteoTransaccionesTag(id_user: $id_user) {
        conteo
        tag {
          id
          name
        }
      }
    }
  `;

  const variables = {
    "id_user": idUser
  };

  try {
    const data = await graphQLClient.request(query, variables);
    return data
  } catch (error) {
    console.log("Error fetching user transactions count", error);
    throw new Error("Error al obtener el conteo de cuentas por tag.");
  }
}