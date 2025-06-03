
import React, { createContext, useContext, useState } from 'react';
import NotificationModal, { NotificationType } from './NotificationModal';

interface NotificationConfig {
  type: NotificationType;
  title: string;
  message: string;
  buttonText: string;
}

interface NotificationModalContextType {
  showSuccess: (title?: string, message?: string, buttonText?: string) => void;
  showError: (title?: string, message?: string, buttonText?: string) => void;
  showWarning: (title?: string, message?: string, buttonText?: string) => void;
  showInfo: (title?: string, message?: string, buttonText?: string) => void;
  showNotification: (type: NotificationType, title: string, message: string, buttonText?: string) => void;
}

const NotificationModalContext = createContext<NotificationModalContextType | undefined>(undefined);

export const useNotificationModalContext = () => {
  const context = useContext(NotificationModalContext);
  if (!context) {
    throw new Error('useNotificationModalContext must be used within a NotificationModalProvider');
  }
  return context;
};

interface NotificationModalProviderProps {
  children: React.ReactNode;
}

export const NotificationModalProvider: React.FC<NotificationModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<NotificationConfig>({
    type: 'success',
    title: '',
    message: '',
    buttonText: 'OK'
  });

  const showNotification = (type: NotificationType, title: string, message: string, buttonText: string = 'OK') => {
    setConfig({ type, title, message, buttonText });
    setIsOpen(true);
  };

  const showSuccess = (title: string = 'Sucesso!', message: string = '', buttonText: string = 'OK') => {
    showNotification('success', title, message, buttonText);
  };

  const showError = (title: string = 'Erro!', message: string = '', buttonText: string = 'OK') => {
    showNotification('error', title, message, buttonText);
  };

  const showWarning = (title: string = 'Atenção!', message: string = '', buttonText: string = 'OK') => {
    showNotification('warning', title, message, buttonText);
  };

  const showInfo = (title: string = 'Informação', message: string = '', buttonText: string = 'OK') => {
    showNotification('info', title, message, buttonText);
  };

  const hideNotification = () => {
    setIsOpen(false);
  };

  return (
    <NotificationModalContext.Provider value={{ 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo, 
      showNotification 
    }}>
      {children}
      <NotificationModal
        open={isOpen}
        onOpenChange={hideNotification}
        type={config.type}
        title={config.title}
        message={config.message}
        buttonText={config.buttonText}
        onButtonClick={hideNotification}
      />
    </NotificationModalContext.Provider>
  );
};
