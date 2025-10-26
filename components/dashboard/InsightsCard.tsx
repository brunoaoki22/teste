import React, { useMemo } from 'react';
import { Transaction, Category, Insight, TransactionType, Currency } from '../../types';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle } from '../Icons';
import { formatCurrency } from '../../utils/helpers';

interface InsightsCardProps {
    transactions: Transaction[];
    categories: Category[];
    currency: Currency;
}

const InsightIcons: { [key in Insight['type']]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    info: TrendingUp,
    warning: AlertTriangle,
    suggestion: Lightbulb,
};

const InsightColors: { [key in Insight['type']]: string } = {
    info: 'text-green-400',
    warning: 'text-yellow-400',
    suggestion: 'text-blue-400',
};

const InsightsCard: React.FC<InsightsCardProps> = ({ transactions, categories, currency }) => {

    const insights = useMemo<Insight[]>(() => {
        const generatedInsights: Insight[] = [];
        const now = new Date();
        const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Filter transactions for current and last month
        const currentMonthTxs = transactions.filter(t => new Date(t.date) >= firstDayCurrentMonth);
        const lastMonthTxs = transactions.filter(t => {
            const txDate = new Date(t.date);
            return txDate >= firstDayLastMonth && txDate <= lastDayLastMonth;
        });
        
        // --- 1. Spending comparison ---
        const getSpendingByCategory = (txs: Transaction[]) => txs
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((acc, t) => {
                acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
                return acc;
            }, {} as { [key: string]: number });

        const currentSpending = getSpendingByCategory(currentMonthTxs);
        const lastMonthSpending = getSpendingByCategory(lastMonthTxs);

        for (const categoryId in currentSpending) {
            const currentAmount = currentSpending[categoryId];
            const lastAmount = lastMonthSpending[categoryId] || 0;
            if (lastAmount > 0 && currentAmount > lastAmount) {
                const percentageIncrease = ((currentAmount - lastAmount) / lastAmount) * 100;
                if (percentageIncrease > 20) {
                    const category = categories.find(c => c.id === categoryId);
                    generatedInsights.push({
                        id: `insight-spending-${categoryId}`,
                        type: 'warning',
                        text: `Atenção! Seu gasto com ${category?.name} subiu ${percentageIncrease.toFixed(0)}% em relação ao mês passado.`,
                    });
                }
            }
        }
        
        // --- 2. Savings comparison ---
        const calculateBalance = (txs: Transaction[]) => {
            const income = txs.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
            const expense = txs.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
            return income - expense;
        }

        const currentBalance = calculateBalance(currentMonthTxs);
        const lastMonthBalance = calculateBalance(lastMonthTxs);
        
        if (currentBalance > lastMonthBalance) {
             generatedInsights.push({
                id: 'insight-savings-up',
                type: 'info',
                text: `Parabéns! Você economizou ${formatCurrency(currentBalance - lastMonthBalance, currency)} a mais que no mês anterior.`,
            });
        } else if (currentBalance < lastMonthBalance && currentMonthTxs.length > 0) {
             generatedInsights.push({
                id: 'insight-savings-down',
                type: 'warning',
                text: `Sua economia este mês foi ${formatCurrency(lastMonthBalance - currentBalance, currency)} menor que no mês anterior.`,
            });
        }

        // --- 3. Savings goal suggestion ---
        const currentIncome = currentMonthTxs.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        if (currentIncome > 0) {
            const suggestedSavings = currentIncome * 0.20; // Suggest saving 20%
             generatedInsights.push({
                id: 'insight-goal-suggestion',
                type: 'suggestion',
                text: `Que tal definir uma meta de economia de ${formatCurrency(suggestedSavings, currency)} este mês? Isso representa 20% da sua renda.`,
            });
        }
        
        // --- 4. Investment simulation ---
        if (currentBalance > 100) {
             const monthlyInvestment = currentBalance;
             const annualRate = 0.08; // 8% annual return
             const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1;
             const periods = 5 * 12; // 5 years
             const futureValue = monthlyInvestment * ( (Math.pow(1 + monthlyRate, periods) - 1) / monthlyRate );

             generatedInsights.push({
                id: 'insight-investment-sim',
                type: 'suggestion',
                text: `Investindo ${formatCurrency(monthlyInvestment, currency)} (sua economia deste mês) mensalmente com um retorno de 8% ao ano, em 5 anos você poderia ter aproximadamente ${formatCurrency(futureValue, currency)}.`
            });
        }

        return generatedInsights;

    }, [transactions, categories, currency]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Insights Automáticos</CardTitle>
            </CardHeader>
            <CardContent>
                {insights.length > 0 ? (
                    <ul className="space-y-4">
                       {insights.map(insight => {
                           const Icon = InsightIcons[insight.type] || Lightbulb;
                           const color = InsightColors[insight.type] || 'text-primary';
                           return (
                             <li key={insight.id} className="flex items-start gap-4">
                               <Icon className={`w-6 h-6 flex-shrink-0 mt-1 ${color}`} />
                               <p className="text-sm text-muted-foreground">{insight.text}</p>
                            </li>
                           )
                       })}
                    </ul>
                ) : (
                    <p className="text-center text-muted-foreground">
                        Continue registrando suas transações para receber insights automáticos.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default InsightsCard;
