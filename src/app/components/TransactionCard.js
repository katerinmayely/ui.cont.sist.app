'use client'

export default function TransactionCard({
  amount,
  description,
  current_balance,
  date
}) {
  return (
    <div className="bg-white p-6 rounded-md shadow-lg cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 mb-4">
      <h3 className="text-xl font-semibold text-black">Transacción</h3>
      <p className="text-lg text-gray-600"><strong>Monto:</strong> L.{amount}</p>
      <p className="text-lg text-gray-600"><strong>Descripción:</strong> {description}</p>
      <p className="text-lg text-gray-600"><strong>Saldo actual:</strong> L.{current_balance}</p>
      <p className="text-lg text-gray-600"><strong>Fecha:</strong> {new Date(date).toLocaleDateString()}</p>
    </div>
  );
}
