import React, { useState, useEffect } from 'react';
import { Debt, Currency } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/helpers';

interface PayInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayInstallment: (debtId: string, installmentAmount: number) => void;
  debt: Debt | null;
  currency: Currency;
}

const PayInstallmentModal: React.FC<PayInstallmentModalProps> = ({ isOpen, onClose, onPayInstallment, debt, currency }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debt) return;
    
    const installmentAmount = debt.totalAmount / debt.installments;
    onPayInstallment(debt.id, installmentAmount);
    onClose();
  };

  if (!debt) return null;
  
  const installmentAmount = debt.totalAmount / debt.installments;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Pagar Parcela de "${debt.name}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-md bg-accent text-center">
            <p className="text-muted-foreground">Você está prestes a registrar o pagamento da parcela</p>
            <p className="text-2xl font-bold my-2">{debt.paidInstallments + 1} de {debt.installments}</p>
            <p className="text-3xl font-bold text-primary">
                {formatCurrency(installmentAmount, currency)}
            </p>
        </div>
        <p className="text-sm text-center text-muted-foreground">
            Isso irá adicionar uma transação de despesa correspondente em "Dívidas e Parcelamentos". Deseja continuar?
        </p>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Confirmar Pagamento</Button>
        </div>
      </form>
    </Modal>
  );
};

export default PayInstallmentModal;
