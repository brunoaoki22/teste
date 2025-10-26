import React from 'react';
import { Transaction, Category, TransactionType, Currency } from '../../types';
import { ChevronLeft, ChevronRight, PlusCircle, Pencil, Trash2 } from '../Icons';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ICONS } from '../Icons';
import { formatCurrency } from '../../utils/helpers';

interface MonthlyViewProps {
    currentDate: Date;
    transactions: Transaction[];
    categories: Category[];
    income: number;
    expense: number;
    balance: number;
    currency: Currency;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onAddTransaction: () => void;
    onEditTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transactionId: string) => void;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({
    currentDate, transactions, categories, income, expense, balance, currency,
    onPrevMonth, onNextMonth, onAddTransaction, onEditTransaction, onDeleteTransaction
}) => {

    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <Button onClick={onPrevMonth} variant="ghost" size="sm" className="p-2 focus:ring-0 focus:ring-offset-0"><ChevronLeft className="w-6 h-6 flex-shrink-0" /></Button>
                        <CardTitle className="text-2xl text-center">{capitalizedMonth} de {year}</CardTitle>
                        <Button onClick={onNextMonth} variant="ghost" size="sm" className="p-2 focus:ring-0 focus:ring-offset-0"><ChevronRight className="w-6 h-6 flex-shrink-0" /></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                        <div className="p-4 rounded-lg bg-secondary">
                            <p className="text-sm text-muted-foreground">Receita</p>
                            <p className="text-xl font-bold text-green-500">{formatCurrency(income, currency)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary">
                            <p className="text-sm text-muted-foreground">Despesa</p>
                            <p className="text-xl font-bold text-red-500">{formatCurrency(expense, currency)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary">
                            <p className="text-sm text-muted-foreground">Saldo</p>
                            <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-500'}`}>{formatCurrency(balance, currency)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <CardTitle>Transações do Mês</CardTitle>
                        <Button onClick={onAddTransaction} size="sm" className="gap-2"><PlusCircle className="w-4 h-4 flex-shrink-0" /> Nova Transação</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sortedTransactions.length > 0 ? sortedTransactions.map(t => {
                            const category = categories.find(c => c.id === t.categoryId);
                            const Icon = category ? ICONS[category.icon] : ICONS.HelpCircle;
                            const isIncome = t.type === TransactionType.INCOME;
                            return (
                                <div key={t.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-3 rounded-lg bg-secondary">
                                    <div className="flex items-center min-w-0 mr-auto grow">
                                        <div className={`flex items-center justify-center w-10 h-10 mr-4 rounded-full shrink-0 ${isIncome ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{t.description}</p>
                                            <p className="text-sm text-muted-foreground">{category?.name} - {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center shrink-0">
                                        <p className={`font-bold w-28 text-right ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                                            {isIncome ? '+' : '-'} {formatCurrency(t.amount, currency)}
                                        </p>
                                        <div className="flex items-center ml-2">
                                            <Button onClick={() => onEditTransaction(t)} variant="ghost" size="sm" className="p-2"><Pencil className="w-4 h-4 flex-shrink-0" /></Button>
                                            <Button onClick={() => onDeleteTransaction(t.id)} variant="ghost" size="sm" className="p-2 text-red-500 hover:bg-red-500/10 hover:text-red-500"><Trash2 className="w-4 h-4 flex-shrink-0" /></Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <p className="py-8 text-center text-muted-foreground">Nenhuma transação para este mês.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default MonthlyView;
