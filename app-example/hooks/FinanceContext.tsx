// src/context/FinanceContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MMKV } from 'react-native-mmkv';
import { Transaction } from '../constants/financeTypes';
import { useAuth } from './AuthContext';
const storage = new MMKV();

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  getTransactionsByCategory: (category: string) => Transaction[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'finance_tracker_transactions';

// Sample transactions for new users
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2025-03-05',
    amount: 1200.00,
    type: 'income',
    category: 'Work',
    description: 'Monthly internship payment'
  },
  {
    id: '2', 
    date: '2025-03-02',
    amount: 45.50,
    type: 'expense',
    category: 'Food',
    description: 'Grocery shopping'
  },
  {
    id: '3',
    date: '2025-02-28', 
    amount: 35.00,
    type: 'expense',
    category: 'Transportation',
    description: 'Bus pass'
  },
  {
    id: '4',
    date: '2025-02-25',
    amount: 25.00,
    type: 'expense',
    category: 'Entertainment',
    description: 'Movie tickets'
  },
  {
    id: '5',
    date: '2025-02-22',
    amount: 300.00,
    type: 'income', 
    category: 'Work',
    description: 'Tutoring sessions'
  },
  {
    id: '6',
    date: '2025-02-19',
    amount: 65.00,
    type: 'expense',
    category: 'Food',
    description: 'Restaurant dinner'
  },
  {
    id: '7',
    date: '2025-02-16',
    amount: 150.00,
    type: 'expense',
    category: 'Education',
    description: 'Textbooks'
  },
  {
    id: '8',
    date: '2025-02-15',
    amount: 40.00,
    type: 'expense',
    category: 'Transportation',
    description: 'Uber rides'
  },
  {
    id: '9',
    date: '2025-02-17',
    amount: 500.00,
    type: 'income',
    category: 'Work',
    description: 'Part-time work'
  },
  {
    id: '10',
    date: '2025-02-20',
    amount: 30.00,
    type: 'expense',
    category: 'Entertainment',
    description: 'Streaming subscriptions'
  },
  {
    id: '11',
    date: '2025-02-23',
    amount: 200.00,
    type: 'income',
    category: 'Gift',
    description: 'Birthday gift from family'
  },
  {
    id: '12',
    date: '2025-02-26',
    amount: 85.00,
    type: 'expense',
    category: 'Clothing',
    description: 'New shoes'
  },
  {
    id: '13',
    date: '2025-03-01',
    amount: 250.00,
    type: 'income',
    category: 'Allowance',
    description: 'Monthly allowance'
  },
  {
    id: '14',
    date: '2025-02-18',
    amount: 75.00,
    type: 'expense',
    category: 'Food',
    description: 'Weekly groceries'
  },
  {
    id: '15',
    date: '2025-02-21',
    amount: 100.00,
    type: 'expense',
    category: 'Savings',
    description: 'Emergency fund deposit'
  }
];

export const FinanceProvider = ({ children }: FinanceProviderProps) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Helper function to sort transactions by date
  const sortTransactionsByDate = (transactions: Transaction[]) => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  };

  // Load transactions from MMKV on initial load
  useEffect(() => {
    const loadTransactions = async () => {
      if (!currentUser) {
        setTransactions([]);
        return;
      }

      try {
        const savedTransactions = storage.getString(STORAGE_KEY);
        if (savedTransactions) {
          const parsedTransactions: Transaction[] = JSON.parse(savedTransactions);
          const validTransactions = parsedTransactions.map((t: Transaction) => ({
            ...t,
            amount: Number(t.amount),
          }));
          const combinedTransactions = [...SAMPLE_TRANSACTIONS, ...validTransactions];
          setTransactions(sortTransactionsByDate(combinedTransactions));
        } else {
          setTransactions(sortTransactionsByDate(SAMPLE_TRANSACTIONS));
          storage.set(STORAGE_KEY, JSON.stringify([]));
        }
      } catch (error) {
        console.error('Failed to load transactions', error);
      }
    };

    loadTransactions();
  }, [currentUser]);

  // Save transactions to MMKV whenever they change
  useEffect(() => {
    const saveTransactions = async () => {
      if (!currentUser) return;
      const userTransactions = transactions.filter(t =>
        !SAMPLE_TRANSACTIONS.some(sample => sample.id === t.id)
      );
      try {
        storage.set(STORAGE_KEY, JSON.stringify(userTransactions));
      } catch (error) {
        console.error('Failed to save transactions', error);
      }
    };

    saveTransactions();
  }, [transactions, currentUser]);

  // Calculate balances whenever transactions change
  useEffect(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(transaction => {
      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        income += amount;
      } else {
        expenses += amount;
      }
    });
    setTotalIncome(income);
    setTotalExpenses(expenses);
    setCurrentBalance(income - expenses);
  }, [transactions]);

  const addTransaction = (transaction: Transaction) => {
    if (!currentUser) return;
    // Ensure amount is a number
    const newTransaction = {
      ...transaction,
      amount: Number(transaction.amount)
    };
    setTransactions(prev => sortTransactionsByDate([...prev, newTransaction]));
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    if (!currentUser) return;
    // Ensure amount is a number
    const validTransaction = {
      ...updatedTransaction,
      amount: Number(updatedTransaction.amount)
    };
    setTransactions(prev =>
      sortTransactionsByDate(
        prev.map(transaction =>
          transaction.id === validTransaction.id ? validTransaction : transaction
        )
      )
    );
  };

  const deleteTransaction = (id: string) => {
    if (!currentUser) return;
    setTransactions(prev => 
      sortTransactionsByDate(
        prev.filter(transaction => transaction.id !== id)
      )
    );
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return sortTransactionsByDate(
      transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
      })
    );
  };

  const getTransactionsByCategory = (category: string) => {
    return sortTransactionsByDate(
      transactions.filter(transaction => transaction.category === category)
    );
  };

  return React.createElement(
    FinanceContext.Provider,
    {
      value: {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        currentBalance,
        totalIncome,
        totalExpenses,
        getTransactionsByDateRange,
        getTransactionsByCategory,
      }
    },
    children
  );
};