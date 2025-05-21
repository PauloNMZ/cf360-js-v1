import { useState, useEffect } from 'react';
import { ConvenenteData } from '@/types/convenente';
import { 
  getConvenentes, 
  getConvenenteById, 
  saveConvenente, 
  updateConvenente, 
  deleteConvenente,
  searchConvenentesByTerm 
} from '@/services/convenente/convenenteApi';

export const useConvenentes = () => {
  const [convenentes, setConvenentes] = useState<Array<ConvenenteData & { id: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  // Carregar convenentes iniciais
  useEffect(() => {
    loadConvenentes();
  }, []);

  // Carregar convenentes
  const loadConvenentes = async () => {
    try {
      setIsLoading(true);
      const data = await getConvenentes();
      setConvenentes(data);
    } catch (error) {
      console.error('Erro ao carregar convenentes:', error);
      setAlert({ type: 'error', message: 'Erro ao carregar convenentes' });
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar convenentes
  const handleSearch = async (term: string) => {
    try {
      setIsLoading(true);
      setSearchTerm(term);
      if (term.length >= 2) {
        const results = await searchConvenentesByTerm(term);
        setConvenentes(results);
      } else {
        await loadConvenentes();
      }
    } catch (error) {
      console.error('Erro ao buscar convenentes:', error);
      setAlert({ type: 'error', message: 'Erro ao buscar convenentes' });
    } finally {
      setIsLoading(false);
    }
  };

  // Criar novo convenente
  const handleCreate = async (data: ConvenenteData) => {
    try {
      setIsLoading(true);
      const newConvenente = await saveConvenente(data);
      setConvenentes(prev => [...prev, newConvenente]);
      setAlert({ type: 'success', message: 'Convenente criado com sucesso' });
      return newConvenente;
    } catch (error: any) {
      console.error('Erro ao criar convenente:', error);
      let message = error.message || 'Erro ao criar convenente';
      if (message.includes('duplicate key value') || message.includes('unique constraint')) {
        message = 'Já existe um convenente cadastrado com este CNPJ.';
      }
      setAlert({ type: 'error', message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar convenente
  const handleUpdate = async (id: string, data: ConvenenteData) => {
    try {
      setIsLoading(true);
      const updatedConvenente = await updateConvenente(id, data);
      if (updatedConvenente) {
        setConvenentes(prev => 
          prev.map(c => c.id === id ? updatedConvenente : c)
        );
        setAlert({ type: 'success', message: 'Convenente atualizado com sucesso' });
      }
      return updatedConvenente;
    } catch (error: any) {
      console.error('Erro ao atualizar convenente:', error);
      setAlert({ type: 'error', message: error.message || 'Erro ao atualizar convenente' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir convenente
  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteConvenente(id);
      setConvenentes(prev => prev.filter(c => c.id !== id));
      setAlert({ type: 'success', message: 'Convenente excluído com sucesso' });
    } catch (error: any) {
      console.error('Erro ao excluir convenente:', error);
      setAlert({ type: 'error', message: error.message || 'Erro ao excluir convenente' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar convenente por ID
  const handleGetById = async (id: string) => {
    try {
      setIsLoading(true);
      const convenente = await getConvenenteById(id);
      return convenente;
    } catch (error) {
      console.error('Erro ao buscar convenente:', error);
      setAlert({ type: 'error', message: 'Erro ao buscar convenente' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    convenentes,
    isLoading,
    searchTerm,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleGetById,
    loadConvenentes,
    alert,
    setAlert
  };
}; 