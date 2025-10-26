import React, { useState, useEffect } from 'react';
import { Goal, Currency } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatCurrency, formatNumberInput } from '../../utils/helpers';

interface UpdateGoalProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateGoal: (goalId: string, amountToAdd: number) => void;
  goal: Goal | null;
  currency: Currency;
}

const UpdateGoalProgressModal: React.FC<UpdateGoalProgressModalProps> = ({ isOpen, onClose, onUpdateGoal, goal, currency }) => {
  const [amountToAdd, setAmountToAdd] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
        setAmountToAdd('');
        setError('');
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setAmountToAdd(rawValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    const numericAmount = parseFloat(amountToAdd);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Por favor, insira um valor positivo válido.');
      return;
    }

    onUpdateGoal(goal.id, numericAmount);
    onClose();
  };

  if (!goal) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Atualizar Progresso de "${goal.name}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-md bg-accent">
            <p><strong>Meta:</strong> {formatCurrency(goal.targetAmount, currency)}</p>
            <p><strong>Atual:</strong> {formatCurrency(goal.currentAmount, currency)}</p>
            <p><strong>Faltam:</strong> {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount), currency)}</p>
        </div>
        <div>
          <label htmlFor="amount-to-add" className="block mb-2 text-sm font-medium text-muted-foreground">Valor a Adicionar</label>
          <Input 
            id="amount-to-add" 
            type="text"
            inputMode="numeric" 
            value={formatNumberInput(amountToAdd)} 
            onChange={handleAmountChange} 
            placeholder="100" 
            required 
          />
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Atualizar Progresso</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateGoalProgressModal;
