import React, { useState, useEffect } from 'react';
import { Goal } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatNumberInput } from '../../utils/helpers';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateGoal: (goal: Goal) => void;
  goal: Goal | null;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, onUpdateGoal, goal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal && isOpen) {
      setName(goal.name);
      setTargetAmount(String(goal.targetAmount));
      setDeadline(goal.deadline);
      setError('');
    }
  }, [goal, isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setTargetAmount(rawValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline || !goal) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    const numericTarget = parseFloat(targetAmount);
    if (isNaN(numericTarget) || numericTarget <= 0) {
      setError('Por favor, insira um valor alvo positivo válido.');
      return;
    }

    onUpdateGoal({
      ...goal,
      name,
      targetAmount: numericTarget,
      deadline,
    });
    onClose();
  };
  
  if (!goal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar Meta: "${goal.name}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal-edit-name" className="block mb-2 text-sm font-medium text-muted-foreground">Nome da Meta</label>
          <Input id="goal-edit-name" type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="goal-edit-target" className="block mb-2 text-sm font-medium text-muted-foreground">Valor Alvo</label>
           <Input 
            id="goal-edit-target" 
            type="text" 
            inputMode="numeric"
            value={formatNumberInput(targetAmount)} 
            onChange={handleAmountChange} 
            required 
          />
        </div>
        <div>
          <label htmlFor="goal-edit-deadline" className="block mb-2 text-sm font-medium text-muted-foreground">Prazo</label>
          <Input id="goal-edit-deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar Alterações</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditGoalModal;
