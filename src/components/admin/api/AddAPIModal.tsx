
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { APICredentials, NewAPICredentials } from '@/types/api';

const apiSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  clientId: z.string().min(1, 'Client ID é obrigatório'),
  clientSecret: z.string().min(1, 'Client Secret é obrigatório'),
  appKey: z.string().min(1, 'App Key é obrigatório'),
  productionUrl: z.string().url('URL de produção deve ser válida'),
  sandboxUrl: z.string().url('URL de sandbox deve ser válida'),
  authRules: z.enum(['certificado', 'OAuth']),
});

interface AddAPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (api: APICredentials) => void;
}

const AddAPIModal: React.FC<AddAPIModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<NewAPICredentials>({
    resolver: zodResolver(apiSchema),
    defaultValues: {
      authRules: 'OAuth'
    }
  });

  const authRules = watch('authRules');

  const onSubmit = async (data: NewAPICredentials) => {
    const newAPI: APICredentials = {
      ...data,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAdd(newAPI);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Template presets for common APIs
  const loadTemplate = (template: string) => {
    switch (template) {
      case 'bb':
        setValue('name', 'Banco do Brasil');
        setValue('productionUrl', 'https://api.bb.com.br');
        setValue('sandboxUrl', 'https://api.sandbox.bb.com.br');
        setValue('authRules', 'OAuth');
        break;
      case 'caixa':
        setValue('name', 'Caixa Econômica Federal');
        setValue('productionUrl', 'https://api.caixa.gov.br');
        setValue('sandboxUrl', 'https://api-sandbox.caixa.gov.br');
        setValue('authRules', 'certificado');
        break;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Nova API</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="template">Template (Opcional)</Label>
              <Select onValueChange={loadTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bb">Banco do Brasil</SelectItem>
                  <SelectItem value="caixa">Caixa Econômica Federal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="name">Nome da API</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Banco do Brasil API"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                {...register('clientId')}
                placeholder="Client ID da aplicação"
              />
              {errors.clientId && (
                <p className="text-sm text-red-500 mt-1">{errors.clientId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                {...register('clientSecret')}
                placeholder="Client Secret da aplicação"
              />
              {errors.clientSecret && (
                <p className="text-sm text-red-500 mt-1">{errors.clientSecret.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="appKey">App Key</Label>
              <Input
                id="appKey"
                {...register('appKey')}
                placeholder="Chave da aplicação"
              />
              {errors.appKey && (
                <p className="text-sm text-red-500 mt-1">{errors.appKey.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="productionUrl">URL de Produção</Label>
              <Input
                id="productionUrl"
                {...register('productionUrl')}
                placeholder="https://api.banco.com.br"
              />
              {errors.productionUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.productionUrl.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sandboxUrl">URL de Sandbox</Label>
              <Input
                id="sandboxUrl"
                {...register('sandboxUrl')}
                placeholder="https://api-sandbox.banco.com.br"
              />
              {errors.sandboxUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.sandboxUrl.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="authRules">Regras de Autenticação</Label>
              <Select
                value={authRules}
                onValueChange={(value: 'certificado' | 'OAuth') => setValue('authRules', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OAuth">OAuth 2.0</SelectItem>
                  <SelectItem value="certificado">Certificado Digital</SelectItem>
                </SelectContent>
              </Select>
              {errors.authRules && (
                <p className="text-sm text-red-500 mt-1">{errors.authRules.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Adicionar API'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAPIModal;
