
import React from 'react';
import { AlertTriangle, Folder } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DirectoryDialogProps } from '@/types/importacao';

const DirectoryDialog: React.FC<DirectoryDialogProps> = ({
  isOpen,
  onOpenChange,
  workflow,
  updateWorkflow,
  handleSaveSettings
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Diretório de Saída</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500">
            Configure o diretório onde os arquivos CNAB serão salvos (opcional).
            No navegador, os arquivos serão baixados diretamente.
          </p>
          
          <div className="flex items-center space-x-2">
            <Folder className="h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Caminho do diretório (ex: C:/Remessa)"
              value={workflow.outputDirectory || ''}
              onChange={(e) => updateWorkflow("outputDirectory", e.target.value)}
            />
          </div>
          
          <div className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
            <p className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Ao usar a aplicação web, os arquivos serão sempre baixados, independente do diretório configurado.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveSettings}
            className="bg-green-600 hover:bg-green-700"
          >
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DirectoryDialog;
