
import { useState } from 'react';

interface SuccessModalConfig {
  title: string;
  message: string;
  buttonText: string;
}

export const useSuccessModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<SuccessModalConfig>({
    title: "Sucesso!",
    message: "",
    buttonText: "OK"
  });

  const showSuccess = (
    title: string = "Sucesso!",
    message: string,
    buttonText: string = "OK"
  ) => {
    setConfig({ title, message, buttonText });
    setIsOpen(true);
  };

  const hideSuccess = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    config,
    showSuccess,
    hideSuccess,
    setIsOpen
  };
};
