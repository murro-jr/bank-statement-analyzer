
import React, { useState, useCallback } from 'react';
import { Transaction, TransactionCategory } from './types';
import { extractAndCategorizeTransactions } from './services/geminiService';
import FileUploader from './components/FileUploader';
import TransactionTable from './components/TransactionTable';
import StatusIndicator from './components/StatusIndicator';
import { CATEGORY_DETAILS } from './constants';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // remove the "data:mime/type;base64," prefix
    };
    reader.onerror = (error) => reject(error);
  });
};


const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
      setTransactions([]);
      setCurrentFile(null);
      setError(null);
      return;
    }
    
    if (file.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setTransactions([]);
    setCurrentFile(file);

    try {
      const base64Data = await fileToBase64(file);
      const extractedData = await extractAndCategorizeTransactions(base64Data, file.type);
      setTransactions(extractedData);
    } catch (err) {
      console.error(err);
      setError('Failed to process the bank statement. Please try again with a different file.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans transition-colors duration-300">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-2">
            Bank Statement Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your PDF statement to automatically extract and categorize transactions.
          </p>
        </header>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
          
          <StatusIndicator isLoading={isLoading} error={error} />
          
          {transactions.length > 0 && (
            <div className="mt-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Transaction Analysis</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Analysis for {currentFile?.name}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-center">
                    <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">{totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Income</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">{totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Categories:</h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Fix: Assign icon component to a capitalized variable (Icon) before use, as JSX requires component names to start with a capital letter. */}
                    {Object.values(TransactionCategory).map(cat => {
                      const Icon = CATEGORY_DETAILS[cat]?.icon;
                      return (
                        <div key={cat} className={`text-xs font-semibold inline-flex items-center px-2.5 py-0.5 rounded-full ${CATEGORY_DETAILS[cat]?.className}`}>
                          {Icon && <Icon className="w-4 h-4 mr-1.5" />}
                          {cat}
                        </div>
                      );
                    })}
                  </div>
                </div>
              <TransactionTable transactions={transactions} />
            </div>
          )}
        </div>
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
            <p>Powered by Google Gemini. Your data is processed securely and is not stored.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
