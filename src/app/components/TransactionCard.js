'use client'

import getTransactionCountByTag from '../utils/functions';

export default function TransactionCard({
  index,
  transaction,
  transactionCount
}) {
  return (
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
  );
}
