import React, { useState } from 'react';
import { Category, TransactionType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ICONS } from '../Icons';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAddCategory }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [icon, setIcon] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon) {
      setError('Nome e ícone são obrigatórios.');
      return;
    }
    onAddCategory({ name, type, icon });
    // Reset and close
    setName('');
    setType(TransactionType.EXPENSE);
    setIcon('');
    setError('');
    onClose();
  };
  
  const iconList = Object.keys(ICONS);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Categoria">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-muted-foreground">Tipo de Categoria</label>
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
          <label htmlFor="cat-name" className="block mb-2 text-sm font-medium text-muted-foreground">Nome da Categoria</label>
          <Input id="cat-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ex: Supermercado" required />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-muted-foreground">Ícone</label>
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 p-2 bg-secondary rounded-md max-h-48 overflow-y-auto">
            {iconList.map(iconKey => {
              const IconComponent = ICONS[iconKey];
              return (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => setIcon(iconKey)}
                  className={`flex items-center justify-center p-2 rounded-md transition-colors ${icon === iconKey ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                >
                  <IconComponent className="w-6 h-6" />
                </button>
              )
            })}
          </div>
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Adicionar Categoria</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;