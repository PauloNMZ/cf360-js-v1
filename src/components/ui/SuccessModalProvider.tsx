
import React, { createContext, useContext } from 'react';
import { useSuccessModal } from '@/hooks/useSuccessModal';
import SuccessModal from './SuccessModal';

interface SuccessModalContextType {
  showSuccess: (title?: string, message?: string, buttonText?: string) => void;
}

const SuccessModalContext = createContext<SuccessModalContextType | undefined>(undefined);

export const useSuccessModalContext = () => {
  const context = useContext(SuccessModalContext);
  if (!context) {
    throw new Error('useSuccessModalContext must be used within a SuccessModalProvider');
  }
  return context;
};

interface SuccessModalProviderProps {
  children: React.ReactNode;
}

export const SuccessModalProvider: React.FC<SuccessModalProviderProps> = ({ children }) => {
  const { isOpen, config, showSuccess, hideSuccess } = useSuccessModal();

  return (
    <SuccessModalContext.Provider value={{ showSuccess }}>
      {children}
      <SuccessModal
        open={isOpen}
        onOpenChange={hideSuccess}
        title={config.title}
        message={config.message}
        buttonText={config.buttonText}
        onButtonClick={hideSuccess}
      />
    </SuccessModalContext.Provider>
  );
};
