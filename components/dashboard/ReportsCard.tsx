import React, { useMemo, useState } from 'react';
import { Transaction, Category, TransactionType, Currency } from '../../types';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ChevronLeft, ChevronRight } from '../Icons';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/helpers';

interface ReportsCardProps {
    transactions: Transaction[];
    categories: Category[];
    currency: Currency;
}

const ReportsCard: React.FC<ReportsCardProps> = ({ transactions, categories, currency }) => {
    const [reportDate, setReportDate] = useState(new Date());

    const handlePrevMonth = () => {
        setReportDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setReportDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const monthName = reportDate.toLocaleString('pt-BR', { month: 'long' });
    const year = reportDate.getFullYear();
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const expenseBreakdown = useMemo(() => {
        const filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date + 'T00:00:00');
            return t.type === TransactionType.EXPENSE &&
                   transactionDate.getFullYear() === reportDate.getFullYear() && 
                   transactionDate.getMonth() === reportDate.getMonth();
        });
        
        const totalExpenses = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

        if (totalExpenses === 0) return [];

        const spendingByCategory: { [key: string]: number } = {};
        for (const transaction of filteredTransactions) {
            if (spendingByCategory[transaction.categoryId]) {
                spendingByCategory[transaction.categoryId] += transaction.amount;
            } else {
                spendingByCategory[transaction.categoryId] = transaction.amount;
            }
        }
        
        return Object.entries(spendingByCategory)
            .map(([categoryId, amount]) => {
                const category = categories.find(c => c.id === categoryId);
                return {
                    categoryName: category ? category.name : 'Desconhecido',
                    amount,
                    percentage: (amount / totalExpenses) * 100,
                };
            })
            .sort((a, b) => b.amount - a.amount);

    }, [transactions, categories, reportDate]);


    return (
        <Card>
            <CardHeader>
                 <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle>Relatório de Despesas</CardTitle>
                    <div className="flex items-center gap-1 text-sm">
                        <Button onClick={handlePrevMonth} variant="ghost" size="sm" className="p-1 h-auto focus:ring-0 focus:ring-offset-0"><ChevronLeft className="w-4 h-4 flex-shrink-0" /></Button>
                        <span className="font-semibold text-center w-28 sm:w-24">{capitalizedMonth}/{year}</span>
                        <Button onClick={handleNextMonth} variant="ghost" size="sm" className="p-1 h-auto focus:ring-0 focus:ring-offset-0"><ChevronRight className="w-4 h-4 flex-shrink-0" /></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {expenseBreakdown.length > 0 ? (
                    <div className="space-y-4">
                        {expenseBreakdown.map(item => (
                            <div key={item.categoryName}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{item.categoryName}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formatCurrency(item.amount, currency)} ({item.percentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">
                        Não há despesas para {monthName.toLowerCase()} de {year}.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default ReportsCard;
