
import { Category, Transaction, Goal, Debt, TransactionType, TransactionStatus, DebtType } from '../types';

export const defaultCategories: Category[] = [
  // Expenses
  { id: 'cat-exp-1', name: 'Moradia', icon: 'Home', type: TransactionType.EXPENSE },
  { id: 'cat-exp-2', name: 'Alimentação', icon: 'Utensils', type: TransactionType.EXPENSE },
  { id: 'cat-exp-3', name: 'Transporte', icon: 'Car', type: TransactionType.EXPENSE },
  { id: 'cat-exp-4', name: 'Saúde', icon: 'HeartPulse', type: TransactionType.EXPENSE },
  { id: 'cat-exp-5', name: 'Lazer', icon: 'FerrisWheel', type: TransactionType.EXPENSE },
  { id: 'cat-exp-6', name: 'Educação', icon: 'GraduationCap', type: TransactionType.EXPENSE },
  { id: 'cat-exp-7', name: 'Contas Fixas', icon: 'FileText', type: TransactionType.EXPENSE },
  { id: 'cat-exp-8', name: 'Compras', icon: 'ShoppingCart', type: TransactionType.EXPENSE },
  { id: 'cat-exp-9', name: 'Outros', icon: 'HelpCircle', type: TransactionType.EXPENSE },
  
  // Incomes
  { id: 'cat-inc-1', name: 'Salário', icon: 'Briefcase', type: TransactionType.INCOME },
  { id: 'cat-inc-2', name: 'Freelance', icon: 'Code', type: TransactionType.INCOME },
  { id: 'cat-inc-3', name: 'Investimentos', icon: 'LineChart', type: TransactionType.INCOME },
  { id: 'cat-inc-4', name: 'Presente', icon: 'Gift', type: TransactionType.INCOME },
  { id: 'cat-inc-5', name: 'Outros', icon: 'HelpCircle', type: TransactionType.INCOME },
];

const today = new Date();
const getDateString = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

export const mockTransactions: Transaction[] = [
    { id: 'trans-1', userId: 'user-1', type: TransactionType.INCOME, amount: 5000, categoryId: 'cat-inc-1', description: 'Salário Mensal', date: getDateString(5), status: TransactionStatus.PAID, isInstallment: false },
    { id: 'trans-2', userId: 'user-1', type: TransactionType.EXPENSE, amount: 1500, categoryId: 'cat-exp-1', description: 'Aluguel', date: getDateString(5), status: TransactionStatus.PAID, isInstallment: false },
    { id: 'trans-3', userId: 'user-1', type: TransactionType.EXPENSE, amount: 450, categoryId: 'cat-exp-2', description: 'Supermercado', date: getDateString(3), status: TransactionStatus.PAID, isInstallment: false },
    { id: 'trans-4', userId: 'user-1', type: TransactionType.EXPENSE, amount: 80, categoryId: 'cat-exp-5', description: 'Cinema', date: getDateString(2), status: TransactionStatus.PAID, isInstallment: false },
    { id: 'trans-5', userId: 'user-1', type: TransactionType.INCOME, amount: 750, categoryId: 'cat-inc-2', description: 'Projeto Freelance', date: getDateString(1), status: TransactionStatus.PAID, isInstallment: false },
    { id: 'trans-6', userId: 'user-1', type: TransactionType.EXPENSE, amount: 120, categoryId: 'cat-exp-3', description: 'Gasolina', date: getDateString(1), status: TransactionStatus.PAID, isInstallment: false },
];

export const mockGoals: Goal[] = [
    { id: 'goal-1', userId: 'user-1', name: 'Viagem de Férias', targetAmount: 8000, currentAmount: 2500, deadline: new Date(today.getFullYear() + 1, 6, 1).toISOString().split('T')[0] },
    { id: 'goal-2', userId: 'user-1', name: 'Reserva de Emergência', targetAmount: 15000, currentAmount: 11000, deadline: new Date(today.getFullYear() + 2, 0, 1).toISOString().split('T')[0] },
];

export const mockDebts: Debt[] = [
    { id: 'debt-1', userId: 'user-1', name: 'Financiamento do Carro', type: DebtType.FINANCING, totalAmount: 45000, paidAmount: 15000, installments: 36, paidInstallments: 12, startDate: new Date(today.getFullYear() - 1, today.getMonth(), 5).toISOString().split('T')[0] },
    { id: 'debt-2', userId: 'user-1', name: 'Parcelamento Notebook', type: DebtType.CREDIT_CARD, totalAmount: 6000, paidAmount: 3000, installments: 12, paidInstallments: 6, startDate: new Date(new Date().setMonth(today.getMonth() - 6)).toISOString().split('T')[0] }
];
