import React from 'react';
import { Transaction, Category, TransactionType, Currency } from '../../types';
import { ArrowLeft, PlusCircle, Pencil, Trash2 } from '../Icons';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ICONS } from '../Icons';
import { formatCurrency } from '../../utils/helpers';

interface MonthDetailViewProps {
    year: number;
    month: number;
    transactions: Transaction[];
    categories: Category[];
    onBack: () => void;
    onAddTransaction: () => void;
    onEditTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transactionId: string) => void;
    currency: Currency;
}

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const MonthDetailView: React.FC<MonthDetailViewProps> = ({
    year, month, transactions, categories, onBack, onAddTransaction, onEditTransaction, onDeleteTransaction, currency
}) => {

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const { income, expense, balance } = transactions.reduce((acc, t) => {
        if (t.type === TransactionType.INCOME) acc.income += t.amount;
        else acc.expense += t.amount;
        acc.balance = acc.income - acc.expense;
        return acc;
    }, { income: 0, expense: 0, balance: 0 });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button onClick={onBack} variant="ghost" size="sm" className="p-2"><ArrowLeft className="w-5 h-5 flex-shrink-0" /></Button>
                        <CardTitle>Detalhes de {months[month]} {year}</CardTitle>
                    </div>
                    <Button onClick={onAddTransaction} size="sm" className="gap-2"><PlusCircle className="w-4 h-4 flex-shrink-0" /> Adicionar</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div className="p-2 rounded-lg bg-secondary">
                        <p className="text-sm text-muted-foreground">Receita</p>
                        <p className="text-lg font-bold text-green-500">{formatCurrency(income, currency)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary">
                        <p className="text-sm text-muted-foreground">Despesa</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(expense, currency)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary">
                        <p className="text-sm text-muted-foreground">Saldo</p>
                        <p className={`text-lg font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-500'}`}>{formatCurrency(balance, currency)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {sortedTransactions.length > 0 ? sortedTransactions.map(t => {
                        const category = categories.find(c => c.id === t.categoryId);
                        const Icon = category ? ICONS[category.icon] : ICONS.HelpCircle;
                        const isIncome = t.type === TransactionType.INCOME;
                        return (
                            <div key={t.id} className="flex items-center p-3 rounded-lg bg-secondary">
                                <div className={`flex items-center justify-center w-10 h-10 mr-4 rounded-full flex-shrink-0 ${isIncome ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{t.description}</p>
                                    <p className="text-sm text-muted-foreground">{category?.name} - {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                                        {isIncome ? '+' : '-'} {formatCurrency(t.amount, currency)}
                                    </p>
                                </div>
                                <div className="ml-4 flex items-center gap-1">
                                    <Button onClick={() => onEditTransaction(t)} variant="ghost" size="sm" className="p-2"><Pencil className="w-4 h-4 flex-shrink-0" /></Button>
                                    <Button onClick={() => onDeleteTransaction(t.id)} variant="ghost" size="sm" className="p-2 text-red-500 hover:bg-red-500/10 hover:text-red-500"><Trash2 className="w-4 h-4 flex-shrink-0" /></Button>
                                </div>
                            </div>
                        )
                    }) : (
                        <p className="py-8 text-center text-muted-foreground">Nenhuma transação para este mês.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default MonthDetailView;
