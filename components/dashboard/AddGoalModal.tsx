import React, { useState } from 'react';
import { Goal } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatNumberInput } from '../../utils/helpers';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'userId' | 'currentAmount'>) => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onAddGoal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setTargetAmount(rawValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    const numericTarget = parseFloat(targetAmount);
    if (isNaN(numericTarget) || numericTarget <= 0) {
      setError('Por favor, insira um valor alvo positivo válido.');
      return;
    }

    onAddGoal({
      name,
      targetAmount: numericTarget,
      deadline,
    });

    // Reset form and close
    setName('');
    setTargetAmount('');
    setDeadline('');
    setError('');
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Meta Financeira">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal-name" className="block mb-2 text-sm font-medium text-muted-foreground">Nome da Meta</label>
          <Input id="goal-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ex: Viagem para a Europa" required />
        </div>
        <div>
          <label htmlFor="goal-target" className="block mb-2 text-sm font-medium text-muted-foreground">Valor Alvo</label>
          <Input 
            id="goal-target" 
            type="text" 
            inputMode="numeric"
            value={formatNumberInput(targetAmount)} 
            onChange={handleAmountChange} 
            placeholder="5.000" 
            required 
          />
        </div>
        <div>
          <label htmlFor="goal-deadline" className="block mb-2 text-sm font-medium text-muted-foreground">Prazo</label>
          <Input id="goal-deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Adicionar Meta</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGoalModal;
