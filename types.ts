
export interface User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    profilePicture: string;
    subscriptionPlan: 'free' | 'premium';
}

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export enum TransactionStatus {
    PAID = 'paid',
    PENDING = 'pending',
}

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    categoryId: string;
    description: string;
    date: string; // YYYY-MM-DD
    status: TransactionStatus;
    isInstallment: boolean;
    installmentParentId?: string;
}

export interface Goal {
    id: string;
    userId: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string; // YYYY-MM-DD
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    type: TransactionType;
}

export enum DebtType {
    CREDIT_CARD = 'credit_card',
    FINANCING = 'financing',
    LOAN = 'loan',
    OTHER = 'other',
}

export enum DebtStatus {
    ACTIVE = 'active',
    PAID_OFF = 'paid_off',
    OVERDUE = 'overdue',
}

export interface Debt {
    id: string;
    userId: string;
    name: string;
    type: DebtType;
    totalAmount: number;
    paidAmount: number;
    installments: number;
    paidInstallments: number;
    startDate: string; // YYYY-MM-DD
}

export type Theme = 'light' | 'dark';
export type Currency = 'BRL' | 'USD' | 'EUR';

export interface Insight {
    id: string;
    type: 'info' | 'warning' | 'suggestion';
    text: string;
}
