
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIndexPageContext } from '@/hooks/useIndexPageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, AlertTriangle } from 'lucide-react';

interface ModalUniversalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  requireCompany?: boolean;
  customNoCompanyMessage?: string;
  customRedirectRoute?: string;
}

const ModalUniversal: React.FC<ModalUniversalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  requireCompany = false,
  customNoCompanyMessage,
  customRedirectRoute = '/empresa'
}) => {
  const navigate = useNavigate();
  const { selectedHeaderCompany, currentConvenenteId, formData } = useIndexPageContext();

  // Verificar se há empresa selecionada
  const hasCompanySelected = () => {
    // Verifica se há empresa no header
    if (selectedHeaderCompany && selectedHeaderCompany.razaoSocial) {
      return true;
    }

    // Verifica se há empresa via currentConvenenteId + formData
    if (currentConvenenteId && formData && formData.razaoSocial) {
      return true;
    }

    return false;
  };

  const handleRedirectToCompany = () => {
    onClose();
    navigate(customRedirectRoute);
  };

  const defaultMessage = "Para continuar, você precisa selecionar uma empresa primeiro. Clique no botão abaixo para ir à página de empresas.";

  // Se requireCompany for true e não houver empresa selecionada
  if (requireCompany && !hasCompanySelected()) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Empresa Não Selecionada
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <Building2 className="h-4 w-4" />
              <AlertDescription>
                {customNoCompanyMessage || defaultMessage}
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleRedirectToCompany} className="bg-primary-blue hover:bg-primary-blue/90">
                <Building2 className="h-4 w-4 mr-2" />
                Ir para Empresas
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Modal normal se empresa estiver selecionada ou requireCompany for false
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUniversal;
