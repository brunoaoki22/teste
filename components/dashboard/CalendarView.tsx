import React, { useMemo } from 'react';
import { Transaction, TransactionType, Currency } from '../../types';
import { ChevronLeft, ChevronRight } from '../Icons';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatCurrency } from '../../utils/helpers';

interface CalendarViewProps {
    transactions: Transaction[];
    year: number;
    setYear: (year: number) => void;
    onMonthSelect: (month: number) => void;
    currency: Currency;
}

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const CalendarView: React.FC<CalendarViewProps> = ({ transactions, year, setYear, onMonthSelect, currency }) => {

    const monthlyData = useMemo(() => {
        const data = Array(12).fill(null).map(() => ({
            income: 0,
            expense: 0,
            balance: 0,
        }));

        transactions.forEach(t => {
            const transactionDate = new Date(t.date + 'T00:00:00');
            if (transactionDate.getFullYear() === year) {
                const month = transactionDate.getMonth();
                if (t.type === TransactionType.INCOME) {
                    data[month].income += t.amount;
                } else {
                    data[month].expense += t.amount;
                }
                data[month].balance = data[month].income - data[month].expense;
            }
        });
        return data;
    }, [transactions, year]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Visão Geral do Calendário</CardTitle>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setYear(year - 1)} className="p-1 rounded-md hover:bg-accent"><ChevronLeft className="w-6 h-6" /></button>
                        <span className="text-xl font-bold">{year}</span>
                        <button onClick={() => setYear(year + 1)} className="p-1 rounded-md hover:bg-accent"><ChevronRight className="w-6 h-6" /></button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {months.map((monthName, index) => {
                        const data = monthlyData[index];
                        const balanceColor = data.balance >= 0 ? 'text-blue-400' : 'text-red-500';
                        return (
                            <div key={index} onClick={() => onMonthSelect(index)} className="p-4 transition-all border rounded-lg cursor-pointer bg-card/50 hover:bg-accent hover:border-primary">
                                <h3 className="font-bold text-center">{monthName}</h3>
                                <div className="mt-2 text-sm space-y-1">
                                    <p className="flex justify-between"><span>Receita:</span> <span className="font-semibold text-green-500">{formatCurrency(data.income, currency)}</span></p>
                                    <p className="flex justify-between"><span>Despesa:</span> <span className="font-semibold text-red-500">{formatCurrency(data.expense, currency)}</span></p>
                                    <p className="flex justify-between"><span>Saldo:</span> <span className={`font-semibold ${balanceColor}`}>{formatCurrency(data.balance, currency)}</span></p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default CalendarView;
