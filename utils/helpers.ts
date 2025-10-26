import { Currency } from '../types';

export const formatCurrency = (value: number, currency: Currency = 'BRL') => {
    const options: Intl.NumberFormatOptions = { style: 'currency', currency };
    if (currency === 'BRL') return value.toLocaleString('pt-BR', options);
    if (currency === 'USD') return value.toLocaleString('en-US', options);
    if (currency === 'EUR') return value.toLocaleString('de-DE', options);
    return value.toLocaleString(undefined, options);
};

export const formatNumberInput = (value: string): string => {
  if (!value) return '';
  const numberValue = parseInt(value.replace(/\D/g, ''), 10);
  if (isNaN(numberValue)) return '';
  return new Intl.NumberFormat('pt-BR').format(numberValue);
};
