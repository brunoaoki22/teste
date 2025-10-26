import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category, TransactionStatus } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ICONS } from '../Icons';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  categories: Category[];
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAddTransaction, categories }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const availableCategories = useMemo(() => {
    return categories.filter(c => c.type === type);
  }, [categories, type]);

  // Reset category when type changes
  React.useEffect(() => {
    setCategoryId('');
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !description || !date) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Por favor, insira um valor positivo válido.');
      return;
    }

    // FIX: Add missing status and isInstallment properties to the transaction object.
    onAddTransaction({
      type,
      amount: numericAmount,
      categoryId,
      description,
      date,
      status: TransactionStatus.PAID,
      isInstallment: false,
    });
    
    // Reset form and close
    setAmount('');
    setCategoryId('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-muted-foreground">Tipo de Transação</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === TransactionType.EXPENSE ? 'primary' : 'secondary'}
              onClick={() => setType(TransactionType.EXPENSE)}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={type === TransactionType.INCOME ? 'primary' : 'secondary'}
              onClick={() => setType(TransactionType.INCOME)}
            >
              Receita
            </Button>
          </div>
        </div>
        
        <div>
          <label htmlFor="amount" className="block mb-2 text-sm font-medium text-muted-foreground">Valor</label>
          <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" step="0.01" required />
        </div>
        
        <div>
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-muted-foreground">Categoria</label>
          <select
            id="category"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="" disabled>Selecione uma categoria</option>
            {availableCategories.map(cat => {
              const Icon = ICONS[cat.icon];
              return (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            )})}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-muted-foreground">Descrição</label>
          <Input id="description" type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="ex: Compras da semana" required />
        </div>

        <div>
          <label htmlFor="date" className="block mb-2 text-sm font-medium text-muted-foreground">Data</label>
          <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Adicionar Transação</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;