import React, { useMemo, useState } from 'react';
import { Transaction, TransactionType, Currency } from '../../types';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ChevronLeft, ChevronRight } from '../Icons';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/helpers';

interface AnnualReportCardProps {
    transactions: Transaction[];
    currency: Currency;
}

const AnnualReportCard: React.FC<AnnualReportCardProps> = ({ transactions, currency }) => {
    const [reportYear, setReportYear] = useState(new Date().getFullYear());

    const handlePrevYear = () => setReportYear(prev => prev - 1);
    const handleNextYear = () => setReportYear(prev => prev + 1);

    const annualData = useMemo(() => {
        const filtered = transactions.filter(t => new Date(t.date + 'T00:00:00').getFullYear() === reportYear);
        
        return filtered.reduce((acc, t) => {
            if (t.type === TransactionType.INCOME) {
                acc.income += t.amount;
            } else {
                acc.expense += t.amount;
            }
            acc.balance = acc.income - acc.expense;
            return acc;
        }, { income: 0, expense: 0, balance: 0 });

    }, [transactions, reportYear]);

    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <CardTitle>Relatório Anual</CardTitle>
                    <div className="flex items-center gap-1 text-sm">
                        <Button onClick={handlePrevYear} variant="ghost" size="sm" className="p-1 h-auto focus:ring-0 focus:ring-offset-0"><ChevronLeft className="w-4 h-4 flex-shrink-0" /></Button>
                        <span className="font-semibold text-center w-16">{reportYear}</span>
                        <Button onClick={handleNextYear} variant="ghost" size="sm" className="p-1 h-auto focus:ring-0 focus:ring-offset-0"><ChevronRight className="w-4 h-4 flex-shrink-0" /></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {annualData.income === 0 && annualData.expense === 0 ? (
                     <p className="text-center text-muted-foreground">
                        Não há dados para o ano de {reportYear}.
                    </p>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-between p-3 rounded-lg bg-secondary">
                            <span className="font-medium text-muted-foreground">Receita Total</span>
                            <span className="font-bold text-green-500">{formatCurrency(annualData.income, currency)}</span>
                        </div>
                         <div className="flex justify-between p-3 rounded-lg bg-secondary">
                            <span className="font-medium text-muted-foreground">Despesa Total</span>
                            <span className="font-bold text-red-500">{formatCurrency(annualData.expense, currency)}</span>
                        </div>
                         <div className="flex justify-between p-3 rounded-lg bg-secondary">
                            <span className="font-medium text-muted-foreground">Saldo Final</span>
                            <span className={`font-bold ${annualData.balance >= 0 ? 'text-blue-400' : 'text-red-500'}`}>
                                {formatCurrency(annualData.balance, currency)}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AnnualReportCard;
