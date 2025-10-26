import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface UpdateProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeed: string;
  onUpdate: (newUrl: string) => void;
}

const UpdateProfilePictureModal: React.FC<UpdateProfilePictureModalProps> = ({ isOpen, onClose, currentSeed, onUpdate }) => {
    const [seed, setSeed] = useState(currentSeed);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (isOpen) {
            setSeed(currentSeed);
        }
    }, [isOpen, currentSeed]);

    useEffect(() => {
        const newUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(seed)}`;
        setPreviewUrl(newUrl);
    }, [seed]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(previewUrl);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Atualizar Foto de Perfil">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full bg-secondary" />
                    <p className="text-sm text-center text-muted-foreground">
                        Usamos o DiceBear para gerar avatares a partir de um texto. Altere o texto abaixo para gerar uma nova imagem.
                    </p>
                </div>
                <div>
                    <label htmlFor="avatar-seed" className="block mb-2 text-sm font-medium text-muted-foreground">Texto para o Avatar</label>
                    <Input id="avatar-seed" type="text" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="Seu nome" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Salvar Nova Foto</Button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateProfilePictureModal;
