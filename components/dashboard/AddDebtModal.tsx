import React, { useState } from 'react';
import { Debt, DebtType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDebt: (debt: Omit<Debt, 'id' | 'userId' | 'paidAmount' | 'paidInstallments'>) => void;
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({ isOpen, onClose, onAddDebt }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DebtType>(DebtType.OTHER);
  const [totalAmount, setTotalAmount] = useState('');
  const [installments, setInstallments] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalAmount || !installments || !startDate) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    const numericAmount = parseFloat(totalAmount);
    const numericInstallments = parseInt(installments, 10);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Por favor, insira um valor total positivo válido.');
      return;
    }
    if (isNaN(numericInstallments) || numericInstallments <= 0) {
        setError('Por favor, insira um número de parcelas válido.');
        return;
    }

    onAddDebt({
      name,
      type,
      totalAmount: numericAmount,
      installments: numericInstallments,
      startDate,
    });

    // Reset form and close
    setName('');
    setType(DebtType.OTHER);
    setTotalAmount('');
    setInstallments('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setError('');
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Dívida">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="debt-name" className="block mb-2 text-sm font-medium text-muted-foreground">Nome da Dívida</label>
          <Input id="debt-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ex: Financiamento do Carro" required />
        </div>
         <div>
          <label htmlFor="debt-type" className="block mb-2 text-sm font-medium text-muted-foreground">Tipo de Dívida</label>
          <select
            id="debt-type"
            value={type}
            onChange={e => setType(e.target.value as DebtType)}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={DebtType.CREDIT_CARD}>Cartão de Crédito</option>
            <option value={DebtType.FINANCING}>Financiamento</option>
            <option value={DebtType.LOAN}>Empréstimo</option>
            <option value={DebtType.OTHER}>Outra</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label htmlFor="debt-total" className="block mb-2 text-sm font-medium text-muted-foreground">Valor Total</label>
            <Input id="debt-total" type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="25000.00" step="0.01" required />
            </div>
            <div>
            <label htmlFor="debt-installments" className="block mb-2 text-sm font-medium text-muted-foreground">Nº de Parcelas</label>
            <Input id="debt-installments" type="number" value={installments} onChange={e => setInstallments(e.target.value)} placeholder="24" required />
            </div>
        </div>
        <div>
          <label htmlFor="debt-startdate" className="block mb-2 text-sm font-medium text-muted-foreground">Data da Primeira Parcela</label>
          <Input id="debt-startdate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Adicionar Dívida</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDebtModal;