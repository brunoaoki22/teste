import React, { useMemo } from 'react';
import { Debt, DebtStatus, DebtType, Currency } from '../../types';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { CreditCard, Landmark, Receipt, AlertTriangle, Wallet } from '../Icons';
import { formatCurrency } from '../../utils/helpers';

interface DebtManagementCardProps {
    debts: Debt[];
    onPayInstallment: (debt: Debt) => void;
    currency: Currency;
}

const debtTypeDetails: { [key in DebtType]: { name: string, icon: React.FC<React.SVGProps<SVGSVGElement>> } } = {
    [DebtType.CREDIT_CARD]: { name: 'Cartão de Crédito', icon: CreditCard },
    [DebtType.FINANCING]: { name: 'Financiamento', icon: Landmark },
    [DebtType.LOAN]: { name: 'Empréstimo', icon: Landmark },
    [DebtType.OTHER]: { name: 'Outra', icon: Receipt },
};

const getNextDueDate = (startDate: string, paidInstallments: number): Date => {
    const date = new Date(startDate + 'T00:00:00'); // Ensure it's parsed as local time
    date.setMonth(date.getMonth() + paidInstallments);
    return date;
};

const DebtManagementCard: React.FC<DebtManagementCardProps> = ({ debts, onPayInstallment, currency }) => {

    const processedDebts = useMemo(() => {
        return debts.map(debt => {
            if (debt.paidInstallments >= debt.installments) {
                return { ...debt, status: DebtStatus.PAID_OFF, nextDueDate: null };
            }

            const nextDueDate = getNextDueDate(debt.startDate, debt.paidInstallments);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date

            const status = nextDueDate < today ? DebtStatus.OVERDUE : DebtStatus.ACTIVE;
            
            return { ...debt, status, nextDueDate };
        });
    }, [debts]);

    const upcomingPayments = useMemo(() => {
        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);

        return processedDebts.filter(d => 
            d.status === DebtStatus.ACTIVE &&
            d.nextDueDate &&
            d.nextDueDate >= today &&
            d.nextDueDate <= sevenDaysFromNow
        );
    }, [processedDebts]);

    const activeDebts = processedDebts.filter(d => d.status !== DebtStatus.PAID_OFF);

    const getStatusChip = (status: DebtStatus) => {
        const styles = {
            [DebtStatus.ACTIVE]: 'bg-blue-500/20 text-blue-400',
            [DebtStatus.PAID_OFF]: 'bg-green-500/20 text-green-400',
            [DebtStatus.OVERDUE]: 'bg-red-500/20 text-red-400',
        };
        const text = {
            [DebtStatus.ACTIVE]: 'Ativa',
            [DebtStatus.PAID_OFF]: 'Quitada',
            [DebtStatus.OVERDUE]: 'Atrasada',
        }
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-6 h-6" />
                    Gerenciamento de Dívidas
                </CardTitle>
            </CardHeader>
            <CardContent>
                {upcomingPayments.length > 0 && (
                     <div className="p-4 mb-6 space-y-2 border-l-4 rounded-r-lg border-yellow-500 bg-yellow-500/10">
                        <h4 className="flex items-center gap-2 font-semibold text-yellow-400">
                            <AlertTriangle className="w-5 h-5" />
                            Alertas de Vencimento
                        </h4>
                        {upcomingPayments.map(debt => {
                             const daysLeft = Math.ceil((debt.nextDueDate!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                             return (
                                <p key={debt.id} className="text-sm text-yellow-200/80">
                                    A parcela de <strong>{debt.name}</strong> vence em {daysLeft} dia(s) ({debt.nextDueDate!.toLocaleDateString('pt-BR')}).
                                </p>
                            )
                        })}
                    </div>
                )}
               
                {activeDebts.length > 0 ? (
                    <ul className="space-y-6">
                        {activeDebts.map(debt => {
                            const DebtIcon = debtTypeDetails[debt.type].icon;
                            const installmentValue = debt.totalAmount / debt.installments;
                            const progress = (debt.paidAmount / debt.totalAmount) * 100;
                            return (
                                <li key={debt.id}>
                                    <div className="flex items-start gap-4">
                                        <DebtIcon className="w-8 h-8 mt-1 text-primary" />
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h4 className="font-semibold">{debt.name}</h4>
                                                {getStatusChip(debt.status as DebtStatus)}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {debtTypeDetails[debt.type].name}
                                            </p>
                                            
                                            <div className="w-full my-2 bg-secondary rounded-full h-2.5">
                                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{formatCurrency(debt.paidAmount, currency)}</span>
                                                <span>{formatCurrency(debt.totalAmount, currency)}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-center">
                                                <div className="p-2 rounded-md bg-secondary">
                                                    <p className="font-semibold">{debt.paidInstallments + 1} / {debt.installments}</p>
                                                    <p className="text-xs text-muted-foreground">Próxima Parcela</p>
                                                </div>
                                                <div className="p-2 rounded-md bg-secondary">
                                                    <p className="font-semibold">{debt.nextDueDate!.toLocaleDateString('pt-BR')}</p>
                                                    <p className="text-xs text-muted-foreground">Vencimento</p>
                                                </div>
                                            </div>
                                             <Button variant="ghost" className="w-full mt-3" onClick={() => onPayInstallment(debt)}>
                                                Pagar Parcela ({formatCurrency(installmentValue, currency)})
                                             </Button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-center text-muted-foreground">
                        Você não tem nenhuma dívida ativa. Parabéns!
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default DebtManagementCard;
