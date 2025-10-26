import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AlertTriangle } from '../Icons';

interface ConfirmDeleteGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  goalName?: string;
}

const ConfirmDeleteGoalModal: React.FC<ConfirmDeleteGoalModalProps> = ({ isOpen, onClose, onDelete, goalName }) => {

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão de Meta">
        <div className="flex flex-col items-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4 flex-shrink-0" />
            <p className="text-lg font-semibold">Você tem certeza?</p>
            <p className="text-muted-foreground">
                Você está prestes a excluir a meta <strong className="text-foreground">{goalName}</strong>. Esta ação não pode ser desfeita.
            </p>
        </div>
        <div className="flex justify-end gap-2 pt-6 mt-4">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:tech-gradient-button" onClick={handleDelete}>
            Sim, Excluir Meta
          </Button>
        </div>
    </Modal>
  );
};

export default ConfirmDeleteGoalModal;