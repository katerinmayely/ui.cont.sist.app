'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccounts, getTransactionsCount, getUserData } from '@/app/services/api';
import getTransactionCountByTag from './utils/functions';
import UserInfo from './components/UserInfo';
import TransactionCard from './components/TransactionCard';

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
        
        if (info && info.usuarios[0].cuentas) {
          setAccountsInfo(info.usuarios[0].cuentas);

          if(accountsInfo.length > 0){
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
  }, [accountsInfo.length, idUser, router]);

  const handleAccountClick = async (account) => {
    setSelectedAccount(account);
    setTransactions(account.transacciones);
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="bg-white p-4">

      <UserInfo key={user.id} user={user} router={router}/>

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
                      <TransactionCard key={index} index={index} transaction={transaction} transactionCount={transactionCount}/>
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