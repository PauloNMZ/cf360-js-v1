
import { useState, useCallback } from 'react';
import { APICredentials, CredentialRotationData } from '@/types/api';
import { useToast } from '@/components/ui/use-toast';

export const useAPIManagement = () => {
  const { toast } = useToast();
  const [apis, setApis] = useState<APICredentials[]>([
    {
      id: '1',
      name: 'Banco do Brasil',
      clientId: 'eyJpZCI6IjY4NjZmOTctNmM5My0iLCJjb2RpZ29QdWJsaWNhZG9yIjowLCJjb2RpZ29Tb2Z0d2FyZSI6MTAzNTgxLCJzZXF1ZW5jaWFsSW5zdGFsYWNhbyI6Mn0',
      clientSecret: 'eyJpZCI6ImI1ODgyZWYtYWJlNi00NTMwLWExNGQtMTdjZDZjZDU0NWEyMTBmMGYxZDEtIiwiY29kaWdvUHVibGljYWRvciI6MCwiY29kaWdvU29mdHdhcmUiOjEwMzU4MSwic2VxdWVuY2lhbEluc3RhbGFjYW8iOjIsInNlcXVlbmNpYWxDcmVkZW5jaWFsIjoyLCJhbWJpZW50ZSI6InByb2R1Y2FvIiwiaWF0IjoxNzQ2MDMzNzI2MDcwfQ',
      appKey: '51f3e692d4f797199a0caa25c4784f3a',
      productionUrl: 'https://api.bb.com.br',
      sandboxUrl: 'https://api.sandbox.bb.com.br',
      authRules: 'OAuth',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  const addAPI = useCallback((newAPI: APICredentials) => {
    setApis(prevApis => [...prevApis, newAPI]);
    toast({
      title: "API adicionada",
      description: `A API ${newAPI.name} foi adicionada com sucesso.`,
    });
  }, [toast]);

  const editAPI = useCallback((updatedAPI: APICredentials) => {
    setApis(prevApis => 
      prevApis.map(api => 
        api.id === updatedAPI.id ? updatedAPI : api
      )
    );
    toast({
      title: "API atualizada",
      description: `A API ${updatedAPI.name} foi atualizada com sucesso.`,
    });
  }, [toast]);

  const deleteAPI = useCallback((apiId: string) => {
    const apiToDelete = apis.find(api => api.id === apiId);
    setApis(prevApis => prevApis.filter(api => api.id !== apiId));
    toast({
      title: "API excluída",
      description: `A API ${apiToDelete?.name} foi excluída com sucesso.`,
    });
  }, [apis, toast]);

  const rotateCredentials = useCallback((apiId: string, newCredentials: CredentialRotationData) => {
    setApis(prevApis => 
      prevApis.map(api => {
        if (api.id === apiId) {
          return {
            ...api,
            ...newCredentials,
            updatedAt: new Date(),
          };
        }
        return api;
      })
    );
    
    const api = apis.find(api => api.id === apiId);
    const updatedFields = Object.keys(newCredentials).join(', ');
    
    toast({
      title: "Credenciais rotacionadas",
      description: `As credenciais (${updatedFields}) da API ${api?.name} foram atualizadas com sucesso.`,
    });
  }, [apis, toast]);

  const toggleAPIStatus = useCallback((apiId: string) => {
    setApis(prevApis => 
      prevApis.map(api => {
        if (api.id === apiId) {
          const newStatus = !api.isActive;
          toast({
            title: newStatus ? "API ativada" : "API desativada",
            description: `A API ${api.name} foi ${newStatus ? 'ativada' : 'desativada'}.`,
          });
          return {
            ...api,
            isActive: newStatus,
            updatedAt: new Date(),
          };
        }
        return api;
      })
    );
  }, [toast]);

  return {
    apis,
    addAPI,
    editAPI,
    deleteAPI,
    rotateCredentials,
    toggleAPIStatus,
  };
};
