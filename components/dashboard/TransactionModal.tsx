import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType, Category, TransactionStatus } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatNumberInput } from '../../utils/helpers';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'userId'>, installments: number) => void;
  onUpdate: (transaction: Transaction) => void;
  categories: Category[];
  transactionToEdit?: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, onUpdate, categories, transactionToEdit }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isInstallment, setIsInstallment] = useState(false);
  const [installments, setInstallments] = useState('2');
  const [error, setError] = useState('');

  const isEditMode = !!transactionToEdit;

  useEffect(() => {
    if (isOpen) {
        if (isEditMode && transactionToEdit) {
            setType(transactionToEdit.type);
            setAmount(String(transactionToEdit.amount));
            setCategoryId(transactionToEdit.categoryId);
            setDescription(transactionToEdit.description.replace(/\s\(\d+\/\d+\)$/, ''));
            setDate(transactionToEdit.date);
            setIsInstallment(transactionToEdit.isInstallment);
        } else {
            setType(TransactionType.EXPENSE);
            setAmount('');
            setCategoryId('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
            setIsInstallment(false);
            setInstallments('2');
        }
        setError('');
    }
  }, [isOpen, transactionToEdit, isEditMode]);


  const availableCategories = useMemo(() => {
    return categories.filter(c => c.type === type);
  }, [categories, type]);

  useEffect(() => {
    if (!isEditMode && !availableCategories.find(c => c.id === categoryId)) {
        setCategoryId('');
    }
  }, [type, availableCategories, categoryId, isEditMode]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setAmount(rawValue);
  };

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
    const numInstallments = isInstallment ? parseInt(installments, 10) : 1;
    if (isInstallment && (isNaN(numInstallments) || numInstallments <= 1)) {
        setError('Número de parcelas deve ser 2 ou mais.');
        return;
    }

    if (isEditMode && transactionToEdit) {
        // NOTE: Editing installment plans is complex. For now, editing only affects this single transaction.
        // A full implementation would ask the user if they want to update all future installments.
        const updatedTransaction: Transaction = {
            ...transactionToEdit,
            type,
            amount: numericAmount,
            categoryId,
            description: transactionToEdit.isInstallment ? description + transactionToEdit.description.match(/\s\(\d+\/\d+\)$/)?.[0] : description,
            date,
        };
        onUpdate(updatedTransaction);
    } else {
         onSave({
            type,
            amount: numericAmount,
            categoryId,
            description,
            date,
            status: TransactionStatus.PAID,
            isInstallment,
        }, numInstallments);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Transação" : "Adicionar Nova Transação"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-muted-foreground">Tipo</label>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant={type === TransactionType.EXPENSE ? 'primary' : 'secondary'} onClick={() => setType(TransactionType.EXPENSE)}>Despesa</Button>
            <Button type="button" variant={type === TransactionType.INCOME ? 'primary' : 'secondary'} onClick={() => setType(TransactionType.INCOME)}>Receita</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-muted-foreground">Valor {isInstallment && '(por parcela)'}</label>
                <Input id="amount" type="text" inputMode="numeric" value={formatNumberInput(amount)} onChange={handleAmountChange} placeholder="2.000" required />
            </div>
            <div>
                 <label htmlFor="date" className="block mb-2 text-sm font-medium text-muted-foreground">Data {isInstallment && '(da 1ª parcela)'}</label>
                 <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
        </div>
        
        <div>
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-muted-foreground">Categoria</label>
          <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="" disabled>Selecione uma categoria</option>
            {availableCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-muted-foreground">Descrição</label>
          <Input id="description" type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="ex: Compras da semana" required />
        </div>

        {transactionToEdit?.isInstallment && (
            <div className="p-3 text-sm rounded-md bg-accent text-accent-foreground">
                Editando uma parcela. Alterações aqui não afetarão as outras parcelas.
            </div>
        )}

        {!isEditMode && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is-installment" checked={isInstallment} onChange={e => setIsInstallment(e.target.checked)} className="w-4 h-4 rounded" />
              <label htmlFor="is-installment" className="text-sm font-medium text-muted-foreground">É um parcelamento?</label>
            </div>
            {isInstallment && (
              <div>
                <label htmlFor="installments" className="block mb-2 text-sm font-medium text-muted-foreground">Número de Parcelas</label>
                <Input id="installments" type="number" value={installments} onChange={e => setInstallments(e.target.value)} placeholder="2" min="2" />
              </div>
            )}
          </div>
        )}
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{isEditMode ? 'Salvar Alterações' : 'Adicionar'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
