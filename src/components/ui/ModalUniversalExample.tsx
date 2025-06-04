
import React from 'react';
import ModalUniversal from './ModalUniversal';
import { useModalUniversal } from '@/hooks/useModalUniversal';
import { Button } from './button';

const ModalUniversalExample: React.FC = () => {
  const modal = useModalUniversal(true); // Requer empresa selecionada

  return (
    <div className="p-4">
      <Button onClick={modal.openModal}>
        Abrir Modal (Requer Empresa)
      </Button>

      <ModalUniversal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        title="Exemplo de Modal Universal"
        requireCompany={modal.requireCompany}
        customNoCompanyMessage="Este é um exemplo de modal que requer uma empresa selecionada. Você precisa selecionar uma empresa antes de continuar."
      >
        <div className="space-y-4">
          <p>Este é o conteúdo do modal que só aparece quando uma empresa está selecionada.</p>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={modal.closeModal}>
              Cancelar
            </Button>
            <Button onClick={modal.closeModal}>
              Confirmar
            </Button>
          </div>
        </div>
      </ModalUniversal>
    </div>
  );
};

export default ModalUniversalExample;
