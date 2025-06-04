
import { useState } from 'react';

export const useModalUniversal = (requireCompany: boolean = false) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
    requireCompany
  };
};
