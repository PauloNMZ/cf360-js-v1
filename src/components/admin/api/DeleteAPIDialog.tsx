
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { APICredentials } from '@/types/api';

interface DeleteAPIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  api: APICredentials;
  onDelete: (apiId: string) => void;
}

const DeleteAPIDialog: React.FC<DeleteAPIDialogProps> = ({
  isOpen,
  onClose,
  api,
  onDelete
}) => {
  const handleDelete = () => {
    onDelete(api.id);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a API <strong>{api.name}</strong>?
            <br />
            <br />
            Esta ação não pode ser desfeita e pode afetar integrações ativas 
            que dependem desta configuração.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir API
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAPIDialog;
