// src/types/finance.ts
export type TransactionCategory = 
  // Income categories
  | "Work"
  | "Allowance" 
  | "Part-time Job" 
  | "Gift" 
  | "Other Income"
  // Expense categories 
  | "Food" 
  | "Transportation" 
  | "Entertainment" 
  | "Clothing" 
  | "Education" 
  | "Savings" 
  | "Other Expense";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // ISO string format
  description: string;
}

export interface User {
  id: string;
  name: string;
  grade: string;
  email: string;
}