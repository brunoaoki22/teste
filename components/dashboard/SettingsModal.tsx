import React from 'react';
import { Theme, Currency } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  currency,
  setCurrency,
}) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurações">
      <div className="space-y-6">
        {/* Theme Settings */}
        <div>
          <h3 className="mb-2 text-lg font-semibold text-card-foreground">Tema da Interface</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setTheme('light')}
              variant={theme === 'light' ? 'primary' : 'secondary'}
            >
              Claro
            </Button>
            <Button
              onClick={() => setTheme('dark')}
              variant={theme === 'dark' ? 'primary' : 'secondary'}
            >
              Escuro
            </Button>
          </div>
        </div>

        {/* Currency Settings */}
        <div>
          <label htmlFor="currency-select" className="block mb-2 text-lg font-semibold text-card-foreground">
            Moeda
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="BRL">Real Brasileiro (BRL)</option>
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        
        <div className="flex justify-end pt-4">
            <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
