
import React from 'react';
import { Transaction } from '../types';
import CategoryBadge from './CategoryBadge';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-6 border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">Date</th>
            <th scope="col" className="py-3 px-6">Description</th>
            <th scope="col" className="py-3 px-6 text-center">Category</th>
            <th scope="col" className="py-3 px-6 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {transaction.date}
              </td>
              <td className="py-4 px-6">{transaction.description}</td>
              <td className="py-4 px-6 text-center">
                <CategoryBadge category={transaction.category} />
              </td>
              <td className={`py-4 px-6 text-right font-semibold ${transaction.amount < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                {transaction.amount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
