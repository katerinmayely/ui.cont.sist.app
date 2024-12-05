'use client'


const handleAccountClick = async (account) => {
    // Al hacer clic en una cuenta, obtenemos sus transacciones
    setSelectedAccount(account);
    setTransactions(account.transacciones); // Asumimos que `account.transacciones` contiene las transacciones de la cuenta
};

export default function AccountCard({
    account,
    name,
    total
}){
    return (
        <div 
            className="bg-white p-6 rounded-md shadow-lg cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
            onClick={() => handleAccountClick(account)} // Manejar el clic en la tarjeta de la cuenta
        >
            <h3 className="text-xl font-semibold text-black">{name}</h3>
            <p className="text-lg text-gray-600">Saldo: L.{total}</p>
        </div>
    );
}