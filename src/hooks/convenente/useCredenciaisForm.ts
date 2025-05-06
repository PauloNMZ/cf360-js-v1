
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConvenenteCredentials, emptyCredentials } from "@/types/credenciais";
import { getConvenenteCredentials, saveOrUpdateCredentials } from "@/services/convenente/credenciaisService";

interface UseCredenciaisFormProps {
  convenenteId: string | null;
  onSuccess?: () => void;
}

export const useCredenciaisForm = ({ convenenteId, onSuccess }: UseCredenciaisFormProps) => {
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<ConvenenteCredentials>({...emptyCredentials});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Carregar credenciais quando o ID do convenente mudar
  useEffect(() => {
    const loadCredentials = async () => {
      if (!convenenteId) {
        setFormValues({...emptyCredentials});
        return;
      }
      
      try {
        setIsLoading(true);
        const credentials = await getConvenenteCredentials(convenenteId);
        
        if (credentials) {
          setFormValues(credentials);
          setIsEditing(true);
        } else {
          setFormValues({...emptyCredentials, convenente_id: convenenteId});
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Erro ao carregar credenciais:", error);
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar as credenciais do convenente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCredentials();
  }, [convenenteId, toast]);
  
  // Manipulador de mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Salvar credenciais
  const handleSave = async () => {
    if (!convenenteId) {
      toast({
        title: "Convenente não selecionado",
        description: "Selecione um convenente antes de salvar as credenciais.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const savedCredentials = await saveOrUpdateCredentials({
        ...formValues,
        convenente_id: convenenteId
      });
      
      toast({
        title: "Credenciais salvas",
        description: "As credenciais do convenente foram salvas com sucesso.",
      });
      
      setFormValues(savedCredentials);
      setIsEditing(true);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao salvar credenciais:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as credenciais do convenente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancelar edição
  const handleCancel = () => {
    if (convenenteId) {
      // Recarregar as credenciais originais
      getConvenenteCredentials(convenenteId).then(credentials => {
        if (credentials) {
          setFormValues(credentials);
        } else {
          setFormValues({...emptyCredentials, convenente_id: convenenteId});
        }
      });
    } else {
      setFormValues({...emptyCredentials});
    }
  };
  
  return {
    formValues,
    isLoading,
    isEditing,
    handleInputChange,
    handleSave,
    handleCancel
  };
};
