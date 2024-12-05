'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccounts, getTransactionsCount, getUserData } from '@/app/services/api';
import AccountCard from './components/AccountCard';
import getTransactionCountByTag from './utils/functions';

export default function Home() {
  const [user, setUser] = useState(null);
  const [timeTrans, setTimeTrans] = useState('');
  const [accountsInfo, setAccountsInfo] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null); // Estado para la cuenta seleccionada
  const [transactions, setTransactions] = useState([]); // Estado para las transacciones de la cuenta seleccionada
  const [hasAccounts, setHasAccounts] = useState(false);
  const [idUser, setIdUser] = useState(0);
  const [transactionCount, setTransactionCount] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Consume el servicio de FastAPI para obtener la información del usuario
        const userData = await getUserData(token);
        setUser(userData);

        let time = userData.timeTrans;

        // Tiempo transcurrido desde la creación de la cuenta
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

        // Consume servicio de GraphQL con información de cuentas (Consulta normal)
        const info = await getAccounts(userData.email, token);
        let id = Number(info.usuarios[0].id);
        setIdUser(id);
        
        if (info && info.usuarios && info.usuarios[0] && info.usuarios[0].cuentas) {
          setAccountsInfo(info.usuarios[0].cuentas);

          if(info.usuarios[0].cuentas.length > 0){
            setHasAccounts(true);
          }
        } else {
          console.error("No se encontraron cuentas para este usuario.");
        }

        // Consume servicio de graphQL con el conteo de transacciones x tag (Agregacion)
        const tranXTag = await getTransactionsCount(idUser, token);
        setTransactionCount(tranXTag.conteoTransaccionesTag)

      } catch (err) {
        console.error('Error fetching user data:', err);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleAccountClick = async (account) => {
    setSelectedAccount(account);
    setTransactions(account.transacciones);};

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="bg-white p-4">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-purple-700 mb-6">
          Bienvenido (a) {user.firstname} {user.lastname}
        </h1>
        <div className="text-gray-700 mb-6">
          <p>
            <strong className="font-medium text-gray-900">Correo electrónico:</strong> {user.email}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="py-2 px-6 text-sm font-medium text-white bg-purple-600 rounded-md shadow-md hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <p className='text-black flex justify-center mt-10'>
        <strong>Han transcurrido {timeTrans} desde la activación de la cuenta.</strong>
      </p>
      
      <hr className='mt-10 mb-10'/>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuentas */}
        <div>
          <h4 className="text-2xl font-bold text-purple-700 mb-6">Tus cuentas</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-6">
            {
              accountsInfo.length === 0 ? (
                <p className='text-black'>No tienes cuentas.</p>
              ) : (
                accountsInfo.map((account) => (
                  <div 
                    key={account.id} 
                    className="bg-gray-100 p-6 rounded-md shadow-lg cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
                    onClick={() => handleAccountClick(account)} // Manejar el clic en la tarjeta de la cuenta
                  >
                    <h3 className="text-xl font-semibold text-black">{account.account_name}</h3>
                    <p className="text-lg text-gray-600">Saldo: L.{account.total}</p>
                  </div>
                ))
            )
            }
          </div>
        </div>

        {/* Transacciones */}
        {hasAccounts && (
          <div className="bg-gray-50 p-6 rounded-md shadow-md">
            {selectedAccount ? (
              <>
                <h4 className="text-md font-bold text-purple-700 mb-6">Transacciones de {selectedAccount.account_name}</h4>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <p>No hay transacciones disponibles para esta cuenta.</p>
                  ) : (
                    transactions.map((transaction, index) => (
                      <div key={index} className="bg-white text-black p-4 rounded-md shadow-md">
                        <p><strong>Descripción:</strong> {transaction.description}</p>
                        <p><strong>Monto:</strong> L.{transaction.amount}</p>
                        <p><strong>Fecha:</strong> {new Date(transaction.transaction_date).toLocaleDateString()}</p>
                        <div className="mt-2">
                          {transaction.etiquetas.map((etiqueta, i) => (
                            <span key={i} title={'Tienes ' + getTransactionCountByTag(transactionCount, etiqueta.etiqueta.name) + ' transacciones con esta etiqueta.'} className="cursor-default text-sm bg-purple-200 text-purple-700 px-2 py-1 rounded-md mr-2">
                              {etiqueta.etiqueta.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-600">Selecciona una cuenta para ver las transacciones.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}