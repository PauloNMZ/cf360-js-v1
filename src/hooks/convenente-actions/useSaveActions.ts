
import { useToast } from "@/hooks/use-toast";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { 
  createConvenente, 
  fetchConvenentes, 
  updateConvenenteData 
} from "@/services/convenente/convenenteService";
import { useRef } from "react";

export const useSaveActions = (
  {
    setFormMode,
    setFormData,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    setIsLoading
  }: {
    setFormMode: (mode: 'view' | 'create' | 'edit') => void;
    setFormData: (data: ConvenenteData) => void;
    setConvenentes: (convenentes: Array<ConvenenteData & { id: string }>) => void;
    currentConvenenteId: string | null;
    setCurrentConvenenteId: (id: string | null) => void;
    setIsLoading: (loading: boolean) => void;
  }
) => {
  const { toast } = useToast();
  const saveInProgressRef = useRef<boolean>(false);

  const handleSave = async (formData: ConvenenteData) => {
    if (saveInProgressRef.current) return;
    saveInProgressRef.current = true;
    try {
      if (!formData.cnpj?.trim()) {
        toast({
          title: "Dados incompletos",
          description: "CNPJ é obrigatório.",
          variant: "destructive",
        });
        return;
      }
      if (!formData.razaoSocial?.trim()) {
        toast({
          title: "Dados incompletos",
          description: "Razão Social é obrigatória.",
          variant: "destructive",
        });
        return;
      }
      setIsLoading(true);

      if (currentConvenenteId === null) {
        try {
          const savedConvenente = await createConvenente(formData);
          toast({
            title: "Convenente salvo",
            description: `${formData.razaoSocial} foi cadastrado com sucesso.`,
          });
          const updatedConvenentes = await fetchConvenentes();
          setConvenentes(updatedConvenentes);
          setFormMode('view');
          setTimeout(() => {
            if (savedConvenente?.id) setCurrentConvenenteId(savedConvenente.id);
          }, 300);
        } catch (error: any) {
          toast({
            title: "Erro ao salvar convenente",
            description: error?.message || "Falha ao salvar convenente. Verifique se está autenticado e tente novamente.",
            variant: "destructive",
          });
        }
      } else {
        try {
          const updatedConvenente = await updateConvenenteData(currentConvenenteId, formData);
          if (updatedConvenente) {
            toast({
              title: "Convenente atualizado",
              description: `${formData.razaoSocial} foi atualizado com sucesso.`,
            });
            const updatedConvenentes = await fetchConvenentes();
            setConvenentes(updatedConvenentes);
            setFormMode('view');
          } else {
            toast({
              title: "Erro ao atualizar",
              description: "Não foi possível atualizar o convenente.",
              variant: "destructive",
            });
          }
        } catch (error: any) {
          toast({
            title: "Erro ao atualizar convenente",
            description: error?.message || "Houve uma falha ao atualizar o convenente.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        saveInProgressRef.current = false;
      }, 800);
    }
  };

  return {
    handleSave,
  };
};
