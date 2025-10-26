import React, { useEffect, useState } from 'react';
import { Check, AlertTriangle, X } from '../Icons';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toast) {
      setShow(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleClose = () => {
    setShow(false);
    // Allow animation to finish before calling parent onClose
    setTimeout(onClose, 300); 
  };
  
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const bgColor = isSuccess ? 'bg-green-500/90' : 'bg-red-500/90';
  const Icon = isSuccess ? Check : AlertTriangle;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} transition-transform duration-300 transform ${show ? 'translate-x-0' : 'translate-x-[calc(100%+20px)]'}`}
    >
      <Icon className="w-6 h-6 mr-3 flex-shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button onClick={handleClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
        <X className="w-5 h-5 flex-shrink-0" />
      </button>
    </div>
  );
};

export default Toast;