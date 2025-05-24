
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CredentialRotationData } from '@/types/api';
import { AlertTriangle } from 'lucide-react';

const rotationSchema = z.object({
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  appKey: z.string().optional(),
}).refine(data => data.clientId || data.clientSecret || data.appKey, {
  message: "Pelo menos um campo deve ser preenchido",
});

interface CredentialRotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiId: string;
  apiName: string;
  onRotate: (apiId: string, newCredentials: CredentialRotationData) => void;
}

const CredentialRotationModal: React.FC<CredentialRotationModalProps> = ({
  isOpen,
  onClose,
  apiId,
  apiName,
  onRotate
}) => {
  const [fieldsToUpdate, setFieldsToUpdate] = React.useState({
    clientId: false,
    clientSecret: false,
    appKey: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CredentialRotationData>({
    resolver: zodResolver(rotationSchema),
  });

  const onSubmit = async (data: CredentialRotationData) => {
    // Only include fields that are selected for update
    const updateData: CredentialRotationData = {};
    
    if (fieldsToUpdate.clientId && data.clientId) {
      updateData.clientId = data.clientId;
    }
    if (fieldsToUpdate.clientSecret && data.clientSecret) {
      updateData.clientSecret = data.clientSecret;
    }
    if (fieldsToUpdate.appKey && data.appKey) {
      updateData.appKey = data.appKey;
    }

    onRotate(apiId, updateData);
    handleClose();
  };

  const handleClose = () => {
    reset();
    setFieldsToUpdate({
      clientId: false,
      clientSecret: false,
      appKey: false,
    });
    onClose();
  };

  const handleFieldToggle = (field: keyof typeof fieldsToUpdate) => {
    setFieldsToUpdate(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Rotação de Credenciais</DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Atenção</h4>
              <p className="text-sm text-yellow-700">
                A rotação de credenciais para <strong>{apiName}</strong> pode afetar 
                integrações ativas. Certifique-se de que as novas credenciais estão válidas.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="updateClientId"
                checked={fieldsToUpdate.clientId}
                onCheckedChange={() => handleFieldToggle('clientId')}
              />
              <Label htmlFor="updateClientId">Atualizar Client ID</Label>
            </div>
            
            {fieldsToUpdate.clientId && (
              <div>
                <Label htmlFor="clientId">Novo Client ID</Label>
                <Input
                  id="clientId"
                  {...register('clientId')}
                  placeholder="Novo Client ID"
                />
                {errors.clientId && (
                  <p className="text-sm text-red-500 mt-1">{errors.clientId.message}</p>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="updateClientSecret"
                checked={fieldsToUpdate.clientSecret}
                onCheckedChange={() => handleFieldToggle('clientSecret')}
              />
              <Label htmlFor="updateClientSecret">Atualizar Client Secret</Label>
            </div>
            
            {fieldsToUpdate.clientSecret && (
              <div>
                <Label htmlFor="clientSecret">Novo Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  {...register('clientSecret')}
                  placeholder="Novo Client Secret"
                />
                {errors.clientSecret && (
                  <p className="text-sm text-red-500 mt-1">{errors.clientSecret.message}</p>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="updateAppKey"
                checked={fieldsToUpdate.appKey}
                onCheckedChange={() => handleFieldToggle('appKey')}
              />
              <Label htmlFor="updateAppKey">Atualizar App Key</Label>
            </div>
            
            {fieldsToUpdate.appKey && (
              <div>
                <Label htmlFor="appKey">Nova App Key</Label>
                <Input
                  id="appKey"
                  {...register('appKey')}
                  placeholder="Nova App Key"
                />
                {errors.appKey && (
                  <p className="text-sm text-red-500 mt-1">{errors.appKey.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !Object.values(fieldsToUpdate).some(Boolean)}
            >
              {isSubmitting ? 'Atualizando...' : 'Rotacionar Credenciais'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialRotationModal;
